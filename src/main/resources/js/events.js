var cardsdisplayed = [];

function rotate(event) {
    rotateObj(event.currentTarget);
}

function rotateObj(obj) {
    if (obj.className.length > 15) {
        if (cardsdisplayed[0].id == obj.id) {
            hideCard(0);
        } else if (cardsdisplayed[1].id == obj.id) {
            hideCard(1);
        }
    } else {
        if (cardsdisplayed[0]) {
            cardsdisplayed[1] = obj;
            rotateAndValidateWith(cardsdisplayed[1], cardsdisplayed[0]);
        } else if (cardsdisplayed[1]) {
            cardsdisplayed[0] = obj;
            rotateAndValidateWith(cardsdisplayed[0], cardsdisplayed[1]);
        } else {
            cardsdisplayed[0] = obj;
            showCard(obj);
        }
    }
}

function hideCard(idx) {
    cardsdisplayed[idx].className = cardsdisplayed[idx].className.substring(0, cardsdisplayed[idx].className.length -  " rotate".length);
    if (idx === 0) {
        cardsdisplayed[0] = null;
    } else if (idx === 1) {
        cardsdisplayed[1] = null;
    }
}

function showCard(card) {
    card.className += " rotate";
}

var reactionLose = function(event) {
        event.currentTarget.removeEventListener("transitionend", reactionLose);
        var myTimer = setTimeout(function() {
            hideCard(0);
            hideCard(1);
            window.clearTimeout(myTimer);
        },700);
    };
var reactionWin = function(event) {
        event.currentTarget.removeEventListener("transitionend", reactionWin);
        cardsdisplayed[0].removeEventListener("click", rotate);
        cardsdisplayed[1].removeEventListener("click", rotate);
        cardsdisplayed[0] = null;
        cardsdisplayed[1] = null;
    };

function rotateAndValidateWith(card1, card2) {
    if (cardEqual(card1, card2)) {
        card1.addEventListener("transitionend", reactionWin, false);
    } else {
        card1.addEventListener("transitionend", reactionLose, false);
    }
    showCard(card1);
}

function cardEqual(card1, card2) {
    return card1.attributes.cid.value == card2.attributes.cid.value;
}

var array = document.getElementsByName("card");
for (var i = 0 ; i < array.length ; i++) {
    var object = array[i];
    object.addEventListener("click", rotate);
}



