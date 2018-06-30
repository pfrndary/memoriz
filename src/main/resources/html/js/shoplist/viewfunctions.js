const LETTERS_NUMBER_PER_ROW = 5;

function getLetterHtmlLink(letter) {
    var aTag = document.createElement('a');
    aTag.setAttribute('href',"#");
    aTag.setAttribute('id',"idChar"+letter);
    aTag.setAttribute('onclick',"moveTo('"+letter+"')");
    aTag.innerHTML = letter;
    return aTag;
}

function moveTo(letter) {
    if (relativePath[letter]) {
        relativePath = relativePath[letter];
    } else {
        console.log("la lettre "+letter + " ne fait pas partie des solutions valide. (solutions possibles : " + JSON.stringify(relativePath)+")");
    }
    hideAllLetters();
    if (relativePath[SOLUTION_FOUND]) {
      wordFound(relativePath[SOLUTION_FOUND]);
    } else {
        refreshAllowedLetters();
    }
}

function getLetterRowHTML() {
    var div = document.createElement("div");
    div.setAttribute('class',"boite");
    return div;
}

function getFakeLetterHtmlElement() {
    var div = document.createElement("div");
    div.setAttribute('class',"element");
    div.innerHTML = "*";
    return div;
}

 function getLetterHtmlElement(letter) {
    var div = document.createElement("div");
    div.setAttribute('class',"element");
    div.setAttribute('id',"elemChar"+letter);
    var tag = getLetterHtmlLink(letter);
    div.appendChild(tag);
    return div;
}

function getMaxNumberLetter(numRow) {
    return LETTERS_NUMBER_PER_ROW + numRow % 2;
}

 function wordFound(word) {
    clearArticlesInModal();
    fillPossibleArticles([word]);
    $('#exampleModal').modal();
    relativePath = articlesTree;
    refreshAllowedLetters();
}

function clearArticlesInModal() {
    let htmlElem = byId("articlesListId");
    while (htmlElem.firstChild) {
        htmlElem.removeChild(htmlElem.firstChild);
    }
}

 function addRowOfLetters(container, letters) {
    var letter = letters.shift();
    var numRow = 0;
    var maxElementPerRow = getMaxNumberLetter(numRow);
    var currentNumberLetter = 0;
    var currentTagRow = getLetterRowHTML();
    while (letter) {
        var tag = getLetterHtmlElement(letter);
        currentTagRow.appendChild(tag);
        currentNumberLetter++;
        letter = letters.shift();
        if (letter && currentNumberLetter == maxElementPerRow) {
            container.appendChild(currentTagRow);
            currentTagRow = getLetterRowHTML();
            numRow++;
            currentNumberLetter = 0;
            maxElementPerRow = getMaxNumberLetter(numRow);
        }
    }
    while (currentNumberLetter < maxElementPerRow) {
        currentTagRow.appendChild(getFakeLetterHtmlElement());
        currentNumberLetter++;
    }
    container.appendChild(currentTagRow);
}

function hideAllLetters() {
    for (var i = 0 ; i < allowedChars.length ; i++) {
        byId("elemChar"+allowedChars[i]).style = "display:none";
    }
}
function refreshAllowedLetters() {
    for (var l in relativePath) {
        if (!byId("elemChar"+l)) {
            console.log("elemChar"+l + " est introuvable ?!");
        }
        byId("elemChar"+l).style = "";
    }
}

function fillPossibleArticles(articlesNames) {
    //<a href="#" id="idArticle1" class="list-group-item list-group-item-action" onclick="selectArticleInList(this.id)">LAIT</a>
    let htmlElem = byId("articlesListId");

    for (let i = 0 ; i < articlesNames.length ; i++) {
        let rowAnchor = document.createElement("a");
        rowAnchor.setAttribute("id", "id"+ articlesNames[i]);
        rowAnchor.setAttribute("href", "#");
        rowAnchor.setAttribute('class',"list-group-item list-group-item-action");
        rowAnchor.setAttribute("onclick", "selectArticleInList(this.id)");
        rowAnchor.innerHTML = articlesNames[i];
        htmlElem.appendChild(rowAnchor);
    }
}

 let selectedItemId = null;
function selectArticleInList(id) {
    if (selectedItemId) {
        let selectedInput = byId(selectedItemId);
        if (selectedInput) {
            selectedInput.className = selectedInput.className.substring(0, selectedInput.className.length - " active".length);
        }
    }
    selectedItemId = id;
    byId(id).className += " active";
}