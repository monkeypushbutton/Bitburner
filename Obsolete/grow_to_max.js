/** @param {NS} ns */
export async function main(ns) {
  const this_host = ns.args[0]
  const mm = ns.args[1]
  const msl = ns.args[2];
  const threads = ns.args[3];
  ns.disableLog("weaken")
  ns.disableLog("grow")
  ns.disableLog("getServerMoneyAvailable")
  ns.disableLog("getServerSecurityLevel")
  var initialMoney = ns.getServerMoneyAvailable(this_host);
  for (
    var cm = initialMoney;
    cm < mm;
    cm = ns.getServerMoneyAvailable(this_host)) {
    ns.printf(
      "INFO Grow %s complete (%s/%s)",
      ns.formatPercent(100 * (cm - initialMoney) / (mm - initialMoney)),
      ns.formatNumber(cm),
      ns.formatNumber(mm))
    await ns.grow(this_host)
    var csl = ns.getServerSecurityLevel(this_host);
    while (csl - msl > 0.05 * threads) {
      ns.print("INFO Damn they noticed. Re-running weaken.")
      await ns.weaken(this_host)
      csl = ns.getServerSecurityLevel(this_host);
    }
  }
}