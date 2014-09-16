package org.onlab.onos.net;

import org.onlab.packet.MacAddress;
import org.onlab.packet.VlanId;

import java.net.URI;

/**
 * Immutable representation of a host identity.
 */
public final class HostId extends ElementId {

    // Public construction is prohibited
    private HostId(URI uri) {
        super(uri);
    }

    /**
     * Creates a device id using the supplied URI.
     *
     * @param uri device URI
     * @return host identifier
     */
    public static HostId hostId(URI uri) {
        return new HostId(uri);
    }

    /**
     * Creates a device id using the supplied URI string.
     *
     * @param string device URI string
     * @return host identifier
     */
    public static HostId hostId(String string) {
        return hostId(URI.create(string));
    }

    /**
     * Creates a device id using the supplied MAC &amp; VLAN ID.
     *
     * @param mac    mac address
     * @param vlanId vlan identifier
     * @return host identifier
     */
    public static HostId hostId(MacAddress mac, VlanId vlanId) {
        // FIXME: use more efficient means of encoding
        return hostId("nic" + ":" + mac + "-" + vlanId);
    }

    /**
     * Creates a device id using the supplied MAC and default VLAN.
     *
     * @param mac mac address
     * @return host identifier
     */
    public static HostId hostId(MacAddress mac) {
        return hostId(mac, VlanId.vlanId(VlanId.UNTAGGED));
    }

}
