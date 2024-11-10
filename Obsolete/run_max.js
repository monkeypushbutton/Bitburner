/** @param {NS} ns */
export async function main(ns) {
  const this_host = ns.getHostname()
  const script_name = ns.args[0]

  const freeRam = ns.getServerMaxRam(this_host) - ns.getServerUsedRam(this_host) + ns.getScriptRam(ns.getScriptName())
  const scriptRam = ns.getScriptRam(script_name)
  const max_threads = Math.floor(freeRam / scriptRam);
  alert(ns, ns.sprintf("Starting %s on %s with %d threads", script_name, this_host, max_threads))

  const flags_data = ns.flags([["threadcount", false]])
  var script_args = ns.args.slice(1)
  if(flags_data["threadcount"]){
    script_args = ns.args.slice(2).concat(max_threads)
  }

  await ns.spawn(script_name, {threads: max_threads, spawnDelay: 50}, ...script_args)
}

function alert(ns, msg){
  ns.print(msg)
  ns.toast(msg)
}