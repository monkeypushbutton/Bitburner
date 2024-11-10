/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]
  openPortsAndRoot(ns, target);
  ns.scp(hack_tools(ns), target)
  ns.exec("hack_this_init.js", target)
}

/** @param {NS} ns */
function hack_tools(ns){
  return ns.ls("home", ".js")
}

/** @param {NS} ns */
function openPortsAndRoot(ns, target){
  if (ns.fileExists("BruteSSH.exe", "home")) {
    ns.brutessh(target);
  }
  if (ns.fileExists("FTPCrack.exe", "home")) {
    ns.ftpcrack(target)
  }
  if (ns.fileExists("relaySMTP.exe", "home")) {
    ns.relaysmtp(target)
  }
  if (ns.fileExists("HTTPWorm.exe", "home")) {
    ns.httpworm(target)
  }
  if (ns.fileExists("SQLInject.exe", "home")) {
    ns.sqlinject(target)
  }
  // Get root access to target server
  ns.nuke(target);
}