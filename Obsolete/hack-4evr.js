/** @param {NS} ns */
export async function main(ns) {
  const this_host = ns.args[0]
  const hack_count = ns.args[1]
  const grow_count = ns.args[2]
  const weak_count = ns.args[3]
  const total = hack_count + grow_count + weak_count
  for(var i = 0; true; i = (i + 1) % total){
    if(i < hack_count){
      await ns.hack(this_host)
    } else if (i < hack_count + grow_count){
      await ns.grow(this_host)
    } else {
      await ns.weaken(this_host)
    }
  }
}