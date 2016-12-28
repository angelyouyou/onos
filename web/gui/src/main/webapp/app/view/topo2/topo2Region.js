/*
 * Copyright 2016-present Open Networking Laboratory
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 ONOS GUI -- Topology Region Module.
 Module that holds the current region in memory
 */

(function () {
    'use strict';

    // Injected Services
    var Model;

    // Internal
    var instance

    // 'static' vars
    var ROOT = '(root)';

    angular.module('ovTopo2')
    .factory('Topo2RegionService', [
        '$log', 'Topo2Model', 'Topo2SubRegionService', 'Topo2DeviceService',
        'Topo2HostService', 'Topo2LinkService', 'Topo2ZoomService', 'Topo2DetailsPanelService',
        'Topo2BreadcrumbService', 'Topo2ViewController',
        function ($log, _Model_, t2sr, t2ds, t2hs, t2ls, t2zs, t2dps, t2bcs, ViewController) {

            Model = _Model_;

            var Region = ViewController.extend({
                initialize: function () {
                    instance = this;
                    this.model = null;
                },
                addRegion: function (data) {

                    var RegionModel = Model.extend({
                        findNodeById: this.findNodeById,
                        nodes: this.regionNodes.bind(this)
                    });

                    this.model = new RegionModel({
                        id: data.id,
                        layerOrder: data.layerOrder
                    });

                    this.model.set({
                        subregions: t2sr.createSubRegionCollection(data.subregions, this),
                        devices: t2ds.createDeviceCollection(data.devices, this),
                        hosts: t2hs.createHostCollection(data.hosts, this),
                        links: t2ls.createLinkCollection(data.links, this)
                    });

                    angular.forEach(this.model.get('links').models, function (link) {
                        link.createLink();
                    });

                    // Hide Breadcrumbs if there are no subregions configured in the root region
                    if (this.isRootRegion() && !this.model.get('subregions').models.length) {
                        t2bcs.hide();
                    }
                },
                isRootRegion: function () {
                    return this.model.get('id') === ROOT;
                },
                findNodeById: function (link, id) {
                    if (link.get('type') !== 'UiEdgeLink') {
                        // Remove /{port} from id if needed
                        var regex = new RegExp('^[^/]*');
                        id = regex.exec(id)[0];
                    }
                    return this.model.get('devices').get(id) ||
                        this.model.get('hosts').get(id) ||
                        this.model.get('subregions').get(id);
                },
                regionNodes: function () {

                    if (this.model) {
                        return [].concat(
                            this.model.get('devices').models,
                            this.model.get('hosts').models,
                            this.model.get('subregions').models
                        );
                    }

                    return [];
                },
                regionLinks: function () {
                    return (this.model) ? this.model.get('links').models : [];
                },
                filterRegionNodes: function (predicate) {
                    var nodes = this.regionNodes();
                    return _.filter(nodes, predicate);
                },
                deselectAllNodes: function () {
                    var selected = this.filterRegionNodes(function (node) {
                        return node.get('selected', true);
                    });

                    if (selected.length) {

                        selected.forEach(function (node) {
                            node.deselect();
                        });

                        t2dps().el.hide();
                        return true;
                    }

                    return false;
                },
                deselectLink: function () {
                    var selected = _.filter(this.regionLinks(), function (link) {
                        return link.get('selected', true);
                    });

                    if (selected.length) {

                        selected.forEach(function (link) {
                            link.deselect();
                        });

                        t2dps().el.hide();
                        return true;
                    }

                    return false;
                }
            });

            function getInstance() {
                return instance || new Region();
            }

            return getInstance();
        }]);

})();
