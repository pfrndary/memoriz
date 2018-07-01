const LETTERS_NUMBER_PER_ROW = 5;
const ARTICLES_CART_ID = "articlesCartId";
const ARTICLES_LIST_ID = "articlesListId"; // proposition d'article

function getLetterHtmlLink(letter) {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'btn btn-secondary');
    button.setAttribute('id',"idChar"+letter);
    button.setAttribute('onclick',"moveTo('"+letter+"')");
    button.innerHTML = letter;
    return button;
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

const PREFIX_SPAN_ADDON = "spanAddon";
function fillCartArticles(articlesJson) {
    let htmlElem = byId(ARTICLES_CART_ID);
    for (let i = 0 ; i < articlesJson.length ; i++) {
        let a = articlesJson[i];
        let row = htmlTag("div", {class:"input-group mb-3"});
        let groupPrepend = htmlTag("div", {class:"input-group-prepend"});
        let labelLike = htmlTag("span", {class:"input-group-text", id:"spanAddon"+a.id}, a.name);
        let inputQty = htmlTag("input", {id:a.id, value:a.qty, type:"number", readonly:""});
        inputQty.setAttribute("class", "form-control");
        row.appendChild(groupPrepend);
        groupPrepend.appendChild(labelLike);
        groupPrepend.appendChild(inputQty);
        groupPrepend.appendChild(htmlTag("button", { class:"btn btn-secondary", onclick:"decrById("+a.id+", 0)" }, "-"));
        groupPrepend.appendChild(htmlTag("button", { class:"btn btn-secondary disabled"}, "&nbsp;&nbsp;&nbsp;"));
        groupPrepend.appendChild(htmlTag("button", { class:"btn btn-secondary", onclick:"incrById("+a.id+", 10)" }, "+"));

        htmlElem.appendChild(row);
    }
}

function spansByForId(parentElement) {
    let result = {};
    let spans = parentElement.getElementsByTagName("span");
    for (let i = 0 ; i < spans.length ; i++) {
            let spanId = spans[i].id;
            let id = spanId.substring(PREFIX_SPAN_ADDON.length, spanId.length);
            result[id] = spans[i].innerHTML;
    }
    return result;
}

function saveCart() {
    let htmlElem = byId(ARTICLES_CART_ID);
    listeCourses = cartToJson(htmlElem);
    callUpdateCart(listeCourses);
}

function cartToJson(element) {
    let cart = [];
    let spans = spansByForId(element);
    let inputsQty = element.getElementsByTagName("input");
    for (let i = 0 ; i < inputsQty.length ; i++) {
        let id = inputsQty[i].id;
        let article = {id:id, name:spans[id], qty:parseInt(inputsQty[i].value)};
        cart.push(article);
    }
    return cart;
}

function decrById(idElem, min) {
    let elem = byId(idElem);
    let value = parseInt(elem.value);
    if (min || min === 0) {
        if (value <= min) {
            return;
        }
    }
    elem.value = --value;
}

function incrById(idElem, max) {
    let elem = byId(idElem);
    let value = parseInt(elem.value);
    if (max) {
        if (value >= max) {
            return;
        }
    }
    elem.value = ++value;
}

