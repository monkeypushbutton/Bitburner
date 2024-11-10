/** @param {NS} ns */
export async function main(ns) {
  const this_host = ns.args[0]
  const msl = ns.args[1]
  ns.disableLog("weaken")
  ns.disableLog("getServerSecurityLevel")
  const initialCsl = ns.getServerSecurityLevel(this_host);
  for(
      let csl = ns.getServerSecurityLevel(this_host);
      csl > msl;
      csl = ns.getServerSecurityLevel(this_host)){
        ns.printf("Weaken %s complete", ns.formatPercent(100 * (initialCsl - csl) / (initialCsl - msl)))
        await ns.weaken(this_host)
  }
  ns.toast("weaken_to_zero complete on " + this_host, "info")
}