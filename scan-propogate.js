/** @param {NS} ns */
export async function main(ns) {
  const connectedHosts = ns.scan()
  const portTools = numPortTools(ns);
  const player = ns.getPlayer();
  let visited = new Set([ns.getHostname()]);
  [
    "getServerMaxRam",
    "getServerUsedRam",
    "getServerMinSecurityLevel",
    "getServerMaxMoney",
    "getServerSecurityLevel",
    "getServerMoneyAvailable",
    "scan"
  ].forEach((fn) => ns.disableLog(fn));

  while (connectedHosts.length > 0) {
    const host = connectedHosts.pop();
    // ns.print("Considering host " + host);
    visited.add(host);
    let serverInfo = ns.getServer(host);
    if (serverInfo.purchasedByPlayer) {
      // ns.print("Declining to hack %s: Owned by player.", host)
      continue;
    }
    if (serverInfo.requiredHackingSkill > player.skills.hacking) {
      ns.printf("WARN Declining to hack %s: Need more hacking skill (have %d, need %d)", host, player.skills.hacking, serverInfo.requiredHackingSkill)
      continue;
    }
    if (serverInfo.numOpenPortsRequired > portTools) {
      ns.printf("WARN Declining to hack %s: Need more port tools (have %d, need %d)", host, portTools, serverInfo.numOpenPortsRequired)
      continue;
    }
    if (!serverInfo.hasAdminRights) {
      ns.print("INFO Rooting " + host);
      openPortsAndRoot(ns, host);
    }
    var nn = ns.scan(host).filter((h) => !visited.has(h));
    if (nn.length > 0) {
      // ns.print("Adding unvisited hosts " + nn.join(", "))
      connectedHosts.push(...nn)
    }
    var processes = ns.ps(host)
    //ns.print(processes.map(p => p.filename).join("|"))
    if (processes.length > 0) {
      // ns.print("Declining to hack " + host + ": Already hacked.")
      continue;
    }
    run_max_hwg(ns, host);
  }
}

/** @param {NS} ns */
function numPortTools(ns) {
  if (!ns.fileExists("BruteSSH.exe", "home")) { return 0; }
  if (!ns.fileExists("FTPCrack.exe", "home")) { return 1; }
  if (!ns.fileExists("relaySMTP.exe", "home")) { return 2; }
  if (!ns.fileExists("HTTPWorm.exe", "home")) { return 3; }
  if (!ns.fileExists("SQLInject.exe", "home")) { return 4; }
  return 5;
}

/** @param {NS} ns */
function hack_tools(ns) {
  return ns.ls("home", ".js")
}

/** @param {NS} ns */
function openPortsAndRoot(ns, target) {
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

/** @param {NS} ns */
function run_max_hwg(ns, hostname){
  const script_name = "hwg-abg.js"
  const freeRam = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)
  const scriptRam = ns.getScriptRam(script_name)
  if(ns.getServerMaxRam(hostname) < 2){
    ns.printf("WARN Not enough ram on %s to run %s (have %s, need %s)", hostname, script_name, ns.formatRam(freeRam), ns.formatRam(scriptRam))
    return
  }

  const max_threads = Math.floor(freeRam / scriptRam);

  ns.printf("Starting %s on %s with %d threads", script_name, hostname, max_threads)

  // var max_money = ns.getServerMaxMoney(hostname)
  // if(max_money == 0){
  //   ns.print("No point in running hwg-abg, server can't collect money.")
  //   return;
  // }
  var script_args = [
    hostname,
    ns.getServerMinSecurityLevel(hostname),
    ns.getServerMaxMoney(hostname),
    ns.getServerSecurityLevel(hostname),
    ns.getServerMoneyAvailable(hostname),
    max_threads]
  ns.scp("hwg-abg.js", hostname);
  ns.exec(script_name, hostname, {threads: max_threads}, ...script_args)
}