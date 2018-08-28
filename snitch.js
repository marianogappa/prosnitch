var xhr = new XMLHttpRequest();
xhr.open("GET", "https://liquipedia.net/starcraft/StarCraft_Remastered_Ladder", true);
xhr.onload = function () { replace(xhr.responseText) };
xhr.send();

function replace(result) {
    /* Extract an alias-to-progamer-name dictionary from Liquipedia */
    const regex = /<tr>\n.*\n<\/td>\n<td><a href.+?>([^<]+)<\/a>\n<\/td>\n<td>([^<]*)\n<\/td><\/tr>\n/g;
    let aliases = {};
    match = regex.exec(result);
    while (match != null) {
        const progamer = match[1];
        const progamerAliases = match[2].split(",").map(i => i.replace(/\s/g,'').toLowerCase());
        if (progamer.length > 0 && progamer.length < 50) { // Use only reasonable lengths
            progamerAliases.forEach(alias => {
                if (alias.length > 0 && alias.length < 50) { // Use only reasonable lengths
                    aliases[alias] = progamer;
                }
            })
        }
        match = regex.exec(result);
    }

    /* Check all aliases against aliases dictionary: if match found, append progamer name */
    document.querySelectorAll('table div a').forEach(elem => {
        const targetAlias = elem.innerHTML.replace(/\s/g,'').toLowerCase();
        if (aliases[targetAlias]) {
            elem.innerHTML = elem.innerHTML + ' (' + aliases[targetAlias] + ')';
        }
    })
}
