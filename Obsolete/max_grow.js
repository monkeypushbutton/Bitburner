/** @param {NS} ns */
export async function main(ns) {
  const this_host = ns.getHostname()
  const freeRam = ns.getServerMaxRam(this_host) - ns.getServerUsedRam(this_host) + ns.getScriptRam(ns.getScriptName())
  const scriptRam = ns.getScriptRam("grow_to_max.js")
  const max_threads = Math.floor(freeRam / scriptRam)
  await ns.spawn("grow_to_max.js", max_threads)
}