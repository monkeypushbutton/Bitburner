/** @param {NS} ns */
export async function main(ns) {
  const this_host = ns.getHostname()
  ns.toast("Max Weaken starting on " + this_host, "info")
  // const serverDeets = ns.getServer(this_host)
  // serverDeets.maxRam
  const freeRam = ns.getServerMaxRam(this_host) - ns.getServerUsedRam(this_host) + ns.getScriptRam(ns.getScriptName())
  const scriptRam = ns.getScriptRam("weaken_to_zero.js")
  const max_threads = Math.floor(freeRam / scriptRam);

  await ns.spawn("weaken_to_zero.js", max_threads)
}