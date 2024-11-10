/** @param {NS} ns */
export async function main(ns) {
  await ns.sleep(50)
  const this_host = ns.getHostname()
  const script_name = "hwg-abg.js"

  //const freeRam = ns.getServerMaxRam(this_host) - ns.getServerUsedRam(this_host) + ns.getScriptRam(ns.getScriptName())
  //const scriptRam = ns.getScriptRam(script_name)
  const max_threads = 2;
  alert(ns, ns.sprintf("Starting %s on %s with %d threads", script_name, this_host, max_threads))

  var max_money = ns.getServerMaxMoney(this_host)
  // if(max_money == 0){
  //   ns.print("No point in running hwg-abg, server can't collect money.")
  //   return;
  // }

  var script_args = [
    this_host,
    1,
    max_money,
    ns.getServerSecurityLevel(this_host),
    ns.getServerMoneyAvailable(this_host),
    max_threads]

  ns.spawn(script_name, {threads: max_threads, spawnDelay: 50}, ...script_args)
}

function alert(ns, msg){
  ns.print(msg)
  ns.toast(msg)
}