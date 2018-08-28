var xhr = new XMLHttpRequest();
xhr.open("GET", "https://liquipedia.net/starcraft/StarCraft_Remastered_Ladder", true);
xhr.onload = function () { replace(xhr.responseText) };
xhr.send();

function replace(result) {
    const regex = /<tr>\n.*\n<\/td>\n<td><a href.+?>([^<]+)<\/a>\n<\/td>\n<td>([^<]*)\n<\/td><\/tr>\n/g;

    let aliases = {};
    match = regex.exec(result);
    while (match != null) {
    const progamer = match[1];
    const progamerAliases = match[2].split(",").map(i => i.replace(/\s/g,'').toLowerCase());
    if (progamer.length > 0) {
        progamerAliases.forEach(alias => {
            aliases[alias] = progamer;
        })
    }
    match = regex.exec(result);
    }

    document.querySelectorAll('table div a').forEach(elem => {
        const targetAlias = elem.innerHTML.replace(/\s/g,'').toLowerCase();
        if (aliases[targetAlias]) {
            elem.innerHTML = elem.innerHTML + ' (' + aliases[targetAlias] + ')';
        }
    })
}
