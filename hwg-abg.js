// Weaken
// This function lowers the security level of the target server by 0.05.

// Hack
// A successful hack() on a server will raise that server’s security level by 0.002.

// Grow
// Once the grow is complete, $1 is added to the server's available money for every script thread.


/** @param {NS} ns */
export async function main(ns) {
  const this_host = ns.args[0]
  const min_sec = ns.args[1]
  const max_mny = ns.args[2]
  var curr_sec = ns.args[3]
  var curr_mny = ns.args[4]
  const threads = ns.args[5]

  const grow_security_inc = 0.004
  const hack_security_inc = 0.002
  
  var weak_cum_chance = Math.max(0, Math.min(1, (curr_sec / min_sec) - 1))
  var grow_chance = 0
  if(max_mny > 0) {
    grow_chance = Math.max(0, Math.min(1, 1 - (curr_mny / max_mny)))
  }
  var grow_cum_chance = Math.min(1, weak_cum_chance + grow_chance)
  for(var rnd = Math.random(); true; rnd = Math.random()){
    ns.printf(
      "Sec:%s Money:%s W/G/H:%s/%s/%s",
      ns.formatNumber(curr_sec),
      ns.formatNumber(curr_mny),
      ns.formatPercent(weak_cum_chance, 1),
      ns.formatPercent(grow_cum_chance - weak_cum_chance, 1),
      ns.formatPercent(Math.max(1 - (weak_cum_chance + grow_cum_chance), 0), 1)
      )
    if(rnd < weak_cum_chance){
      curr_sec -= await ns.weaken(this_host)
      if(curr_sec < min_sec) { curr_sec = min_sec }
    } else if (rnd < (weak_cum_chance + grow_cum_chance)){
      curr_mny *= await ns.grow(this_host)
      curr_sec += grow_security_inc * threads
    } else {
      curr_mny -= await ns.hack(this_host)
      curr_sec += hack_security_inc * threads
    }
    var weak_cum_chance = Math.max(0, Math.min(1, (curr_sec / min_sec) - 1))
    var grow_chance = 0
    if(max_mny > 0) {
      grow_chance = Math.max(0, Math.min(1, 1 - (curr_mny / max_mny)))
    }
    var grow_cum_chance = Math.min(1, weak_cum_chance + grow_chance)
  }
}