/** @param {NS} ns */
export async function main(ns) {
    await ns.wget("https://api.github.com/repos/monkeypushbutton/Bitburner/contents/", "all_scripts.txt");
    const scripts_data = JSON.parse(ns.read("all_scripts.txt"));
    const files = scripts_data.filter((o) => o.type == "file");
    for(var i = 0; i < files.length; i++){
      await ns.wget(files[i].download_url, files[i].name)
    }
}