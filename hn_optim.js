/** @param {NS} ns */
export async function main(ns) {
  while (do_best_upgrade(ns)) {
    await ns.sleep(100)
  }
}

/** @param {NS} ns */
function do_best_upgrade(ns) {
  let bestAction = find_best_action(ns)
  const WORTH_IT_TIME = 24 * 60 * 60
  if (bestAction[2] > WORTH_IT_TIME) {
    ns.print("Not even worth my time")
    return false;
  }
  ns.printf("Best Action: %s, %d", bestAction[0], bestAction[1])
  switch (bestAction[0]) {
    case "new_node":
      ns.hacknet.purchaseNode()
      return true;
    case "level":
      return ns.hacknet.upgradeLevel(bestAction[1], 1)
    case "ram":
      return ns.hacknet.upgradeRam(bestAction[1], 1)
    case "core":
      return ns.hacknet.upgradeCore(bestAction[1], 1)
    default:
      ns.print("No idea what action " + bestAction[0] + "relates to!?")
      return false;
  }
}

/** @param {NS} ns */
function find_best_action(ns) {
  const numNodes = ns.hacknet.numNodes()
  var bestAction = ["new_node", -1, next_server_payback_time(ns)]
  var mults = ns.getHacknetMultipliers()
  for (let i = 0; i < numNodes; i++) {
    var stats = ns.hacknet.getNodeStats(i)
    bestAction = update_best_action(
      ns,
      bestAction,
      "level",
      i,
      ns.hacknet.getLevelUpgradeCost(i, stats.level),
      calculateMoneyGainRate(stats.level + 1, stats.ram, stats.cores, mults.production),
      stats.production
    );
    bestAction = update_best_action(
      ns,
      bestAction,
      "ram",
      i,
      ns.hacknet.getRamUpgradeCost(i, stats.ram),
      calculateMoneyGainRate(stats.level, stats.ram + 1, stats.cores, mults.production),
      stats.production
    );
    bestAction = update_best_action(
      ns,
      bestAction,
      "core",
      i,
      ns.hacknet.getCoreUpgradeCost(i, stats.cores),
      calculateMoneyGainRate(stats.level, stats.ram, stats.cores + 1, mults.production),
      stats.production
    );
  }
  return bestAction;
}

function update_best_action(ns, bestAction, action, server_idx, cost, post_rate, production) {
  const payback_time = post_rate - production <= 0 ?
    Number.POSITIVE_INFINITY :
    cost / (post_rate - production);
  if (payback_time < bestAction[2]) {
    ns.printf(
      "Updating best action. Payback time for %s on node %d %s (%s / %s)",
      action,
      server_idx,
      ns.formatNumber(payback_time),
      ns.formatNumber(cost),
      ns.formatNumber(post_rate - production))
    return [action, server_idx, payback_time]
  }
  return bestAction;
}

function next_server_payback_time(ns) {
  let numNodes = ns.hacknet.numNodes()
  let maxNodes = ns.hacknet.maxNumNodes()
  if (numNodes >= maxNodes) {
    ns.print("No new node for you moneybags")
    return Number.POSITIVE_INFINITY
  }
  let nextNodeCost = ns.hacknet.getPurchaseNodeCost()
  if (nextNodeCost > ns.getPlayer().money) {
    ns.print("No new node for you pauper")
    return Number.POSITIVE_INFINITY
  }
  const nodeBaseProductionPerSec = calculateMoneyGainRate(1, 1, 1, 1)
  let payBackTime = nextNodeCost / nodeBaseProductionPerSec
  ns.printf(
    "Payback time for new node %s (%s / %s)",
    ns.formatNumber(payBackTime),
    ns.formatNumber(nextNodeCost),
    ns.formatNumber(nodeBaseProductionPerSec))
  return payBackTime
}

function calculateMoneyGainRate(level, ram, cores, mult) {
  //const gainPerLevel = HacknetNodeConstants.MoneyGainPerLevel;
  const gainPerLevel = 1.5;

  const levelMult = level * gainPerLevel;
  const ramMult = Math.pow(1.035, ram - 1);
  const coresMult = (cores + 5) / 6;
  //  return levelMult * ramMult * coresMult * mult * currentNodeMults.HacknetNodeMoney;
  return levelMult * ramMult * coresMult * mult;
}