function trigger() {
    Object.keys(aliases).length === 0 ? requestAliases() : replaceAliasesInDOM();
}

function requestAliases() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://liquipedia.net/starcraft/StarCraft_Remastered_Ladder", true);
    xhr.onload = function () { parseAliases(xhr.responseText) };
    xhr.send();
}

function parseAliases(result) {
    /* Extract an alias-to-progamer-name dictionary from Liquipedia */
    const regex = /<tr>\n.*\n<\/td>\n<td><a href.+?>([^<]+)<\/a>\n<\/td>\n<td>([^<]*)\n<\/td><\/tr>\n/g;
    let match = regex.exec(result);
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

    replaceAliasesInDOM();
}

/* Check all aliases against aliases dictionary: if match found, append progamer name */
function replaceAliasesInDOM() {
    document.querySelectorAll('table div a').forEach(elem => {
        const targetAlias = elem.innerHTML.replace(/\s/g,'').toLowerCase();
        if (aliases[targetAlias]) {
            elem.innerHTML = elem.innerHTML + ' (' + aliases[targetAlias] + ')';
        }
        lastTargetAlias = targetAlias;
    })
}

/* Trigger when DOM changes, to update names when [More] is pressed */
var timeout = null;
document.addEventListener("DOMSubtreeModified", function() {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(trigger, 500);
}, false);

let aliases = {}; /* Dictionary from alias to progamer name */
let lastTargetAlias = ''; /* Keeps track of "last gamer entry", to prevent infinite update loop */
trigger(); /* Always trigger at startup */
