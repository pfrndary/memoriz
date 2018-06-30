const FULL_WORD_KEY = "fullWord";
const SOLUTION_FOUND = "solutionFound";
var allowedChars = "abcdefghijklmnopqrstuvwxyz0123456789%_";
var allowedCharsRegex = /^[a-zA-Z_0-9%']+$/;
var articlesTree = {};
var relativePath = null;

var mockDico = [
    "Savons", "Lessive", "Liquide_vaisselle", "papier_toilette",
    "Papier_sulfurise", "Cotons_tiges", "Lait",  "Yahourt",  "Cafe",  "Salade_lentilles", "Jus_orange", "Kiwi", "Sauce_tomate",
    "Sardines",  "Madeleines", "Fruits_secs", "Kombucha", "Crackers", "pistache", "jus_d'orange", "lait_bio_1%", "chocolat_au_lait"];

function explore(jsonMap, maxDeep) {
    if (maxDeep == 0) return undefined;
    if (jsonMap[FULL_WORD_KEY]) {
        return jsonMap[FULL_WORD_KEY];
    }
    var nbrBrothers = Object.keys(jsonMap).length;

    for (var letter in jsonMap) {
          var word = explore(jsonMap[letter], maxDeep-1);
          if (!word) {
            continue;
          }
          if (nbrBrothers == 1) {
            return word;
          } else {
            console.log("nbrBrothers = "+nbrBrothers+"solution trouvee pour "+word + " inscrit la " + letter);
            jsonMap[letter][SOLUTION_FOUND] = word;
          }
    }
    return undefined;
}

 function validateArticlesFormatAndBuildTree(dico) {
    for (var i = 0 ; i < dico.length ; i++) {
        var mot = dico[i].toLowerCase();
        if (allowedCharsRegex.test(mot)) {
            console.log(mot + " est valide");
        } else {
            console.log(mot + " est incorrect");
        }
        relativePath = articlesTree;
        for (var j = 0 ; j < mot.length ; j++) {
            var letter = mot[j];
            if (relativePath[letter]) {
                relativePath = relativePath[letter];
            } else {
                relativePath[letter] = {};
                relativePath = relativePath[letter];
            }
            if (j >= mot.length-1) {
                relativePath[FULL_WORD_KEY] = mot;
            }
        }
    }
    // Réinitialise a la racine
    relativePath = articlesTree;
    return articlesTree;
}
