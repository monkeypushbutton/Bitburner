/** @param {NS} ns */
export async function main(ns) {
  const this_host = ns.getHostname()
  ns.print("Starting worm propogation on server " + this_host)
  let propogate_pid = ns.run("scan-propogate.js")
  while (ns.isRunning(propogate_pid)) {
    await ns.sleep(20000)
  }
  ns.spawn("run_max_hwg.js")
}