const LETTERS_NUMBER_PER_ROW = 5;
const ARTICLES_CART_ID = "articlesCartId";

function getLetterHtmlLink(letter) {
    /*var aTag = document.createElement('a');
    aTag.setAttribute('href',"#");
    aTag.setAttribute('id',"idChar"+letter);
    aTag.setAttribute('onclick',"moveTo('"+letter+"')");
    aTag.innerHTML = letter;
    return aTag;*/
    //  <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="callAddCart(1)">1</button>
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

const PREFIX_SPAN_ADDON = "spanAddon";
function fillCartArticles(articlesJson) {
    let htmlElem = byId(ARTICLES_CART_ID);
//    for (let i = 0 ; i < articlesJson.length ; i++) {
//        let a = articlesJson[i];
//        //let rowAnchor = document.createElement("div");
//        /*rowAnchor.setAttribute("id", "id"+ a.id);
//        rowAnchor.setAttribute("href", "#");
//        rowAnchor.setAttribute('class',"list-group-item list-group-item-action");
//        rowAnchor.setAttribute("onclick", "selectArticleInList(this.id)");*/
//        //rowAnchor.innerHTML = a.name ;
//        //
//        let rowDiv = document.createElement("div");
//        rowDiv.setAttribute("class", "input-group");
//        rowDiv.appendChild(generateLabelHTML(a.id, a.name));
//        rowDiv.appendChild(generateInputWithPlusMinusHTML(a.id, a.qty, 0, 10));
//        htmlElem.appendChild(rowDiv);
//    }

    /*
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon3">https://example.com/users/</span>
      </div>
      <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
    </div>
    */
    for (let i = 0 ; i < articlesJson.length ; i++) {
        let a = articlesJson[i];
        let row = htmlTag("div", {class:"input-group mb-3"});
        let groupPrepend = htmlTag("div", {class:"input-group-prepend"});
        let labelLike = htmlTag("span", {class:"input-group-text", id:"spanAddon"+a.id}, a.name);
        // let inputQty = generateInputWithPlusMinusHTML(a.id, a.qty, 0, 10);
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

function labelsByForId(parentElement) {
    let result = {};
        let labels = parentElement.getElementsByTagName("label");
    for (let i = 0 ; i < labels.length ; i++) {
    log("label for "+labels[i].htmlFor);
            result[labels[i].htmlFor] = labels[i].innerHTML;
    }
    return result;
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
    let obj = cartToJson(htmlElem);
    // TODO simplifier et eviter obj qui est inutil
    console.log(JSON.stringify(obj));
    listeCourses = obj;
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

function generateLabelHTML(forId, value) {
    let input = document.createElement("label");
    input.setAttribute("for", forId);
    input.innerHTML = value;
    return input;
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

function generateInputWithPlusMinusHTML(id, value, min, max) {
    let input = document.createElement("input");
    input.setAttribute("id", id);
    input.setAttribute("type", "number");
    input.setAttribute("min", min);
    input.setAttribute("max", max);
    input.setAttribute("value", value);
    return input;
}

function htmlTag(tag, attr, innerHTML) {
    let element = document.createElement(tag);
    for (let k in attr) {
        element.setAttribute(k, attr[k]);
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
}