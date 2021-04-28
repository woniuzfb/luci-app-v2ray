/**
 * @license
 * Copyright 2020 Xingwang Liao <kuoruan@gmail.com>
 *
 * Licensed to the public under the MIT License.
 */

"use strict";

"require form";
"require v2ray";
// "require view";

// @ts-ignore
return L.view.extend<SectionItem[][]>({
  load: function () {
    return Promise.all([
      v2ray.getSections("dns_server"),
      v2ray.getSections("fakedns_server", "ip_pool"),
    ]);
  },
  render: function ([dnsServers = [], fakednsServers = []] = []) {
    const m = new form.Map(
      "v2ray",
      "%s - %s".format(_("V2Ray"), _("DNS")),
      _("Details: %s").format(
        '<a href="https://www.v2ray.com/en/configuration/dns.html#dnsobject" target="_blank">DnsObject</a>'
      )
    );

    const s1 = m.section(form.NamedSection, "main_dns", "dns");
    s1.anonymous = true;
    s1.addremove = false;

    let o;

    o = s1.option(form.Flag, "enabled", _("Enabled"));
    o.rmempty = false;

    o = s1.option(form.Flag, "disable_cache", _("Disable cache"));

    o = s1.option(form.Flag, "disable_fallback", _("Disable fallback"));

    o = s1.option(form.Value, "tag", _("Tag"));

    o = s1.option(
      form.Value,
      "client_ip",
      _("Client IP"),
      '<a href="https://icanhazip.com" target="_blank">%s</a>'.format(
        _("Get my public IP address")
      )
    );
    o.datatype = "ipaddr";

    o = s1.option(
      form.DynamicList,
      "hosts",
      _("Hosts"),
      _(
        "A list of static addresses, format: <code>domain|address</code>. eg: %s"
      ).format("google.com|127.0.0.1")
    );

    o = s1.option(
      form.MultiValue,
      "servers",
      _("DNS Servers"),
      _("Select DNS servers to use")
    );
    for (const d of dnsServers) {
      o.value(d.value, d.caption);
    }

    if (fakednsServers.length) {
      o = s1.option(
        form.MultiValue,
        "pools",
        _("Fake DNS Servers"),
        _("Select Fake DNS servers to use")
      );
      for (const d of fakednsServers) {
        o.value(d.value, d.caption);
      }
    }

    o = s1.option(form.ListValue, "query_strategy", _("Query strategy"));
    o.value("");
    o.value("UseIP");
    o.value("UseIPv4");
    o.value("UseIPv6");

    const s2 = m.section(
      form.GridSection,
      "dns_server",
      _("DNS server"),
      _("Add DNS servers here")
    );
    s2.anonymous = true;
    s2.addremove = true;
    s2.sortable = true;
    s2.nodescription = true;

    o = s2.option(form.Flag, "skip_fallback", _("Skip fallback"));

    o = s2.option(form.Value, "alias", _("Alias"));
    o.rmempty = false;

    o = s2.option(form.Value, "address", _("Address"));

    o = s2.option(form.Value, "port", _("Port"));
    o.datatype = "port";
    o.placeholder = "53";

    o = s2.option(form.Value, "client_ip", _("Client IP"));
    o.datatype = "ipaddr";

    o = s2.option(form.DynamicList, "domains", _("Domains"));
    o.modalonly = true;

    o = s2.option(form.DynamicList, "expect_ips", _("Expect IPs"));
    o.modalonly = true;

    const s3 = m.section(
      form.TypedSection,
      "fakedns_server",
      _("Fake DNS server"),
      _("Add fake DNS servers here")
    );
    s3.anonymous = true;
    s3.addremove = true;

    o = s3.option(form.Value, "ip_pool", _("IP pool"));
    o.rmempty = false;

    o = s3.option(form.Value, "pool_size", _("Pool size"));
    o.placeholder = "65535";

    return m.render();
  },
});
