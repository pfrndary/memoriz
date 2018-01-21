var cardsdisplayed = [];
var msgQueue = [];

function rotate(event) {
    if (msgQueue.length == 0) {
        var id = event.currentTarget.id;
        msgQueue.push(function() {
            rotateObj(id);
        });
        waitAtLeastOneEvent();
    }
}

function rotateObj(id) {
    var obj = document.getElementById(id);
    if (obj.className.length > 15) {
        if (cardsdisplayed[0] && cardsdisplayed[0].id == obj.id) {
            msgQueue.push(function() {
                hideCardById(obj.id);
                cardsdisplayed[0] = null;
            });
        } else if (cardsdisplayed[1] && cardsdisplayed[1].id == obj.id) {
            msgQueue.push(function() {
                hideCardById(obj.id);
                cardsdisplayed[1] = null;
            });
        }
    } else {
        if (cardsdisplayed[0]) {
            msgQueue.push(function() {
                cardsdisplayed[1] = obj;
                rotateAndValidateWith(cardsdisplayed[1], cardsdisplayed[0]);
            });
        } else if (cardsdisplayed[1]) {
            msgQueue.push(function() {
                cardsdisplayed[0] = obj;
                rotateAndValidateWith(cardsdisplayed[0], cardsdisplayed[1]);
            });
        } else {
            msgQueue.push(function() {
                cardsdisplayed[0] = obj;
                showCard(obj);
            });
        }
        waitAtLeastOneEvent();
        waitAtLeastOneEvent();
    }
}

function hideCardById(cardId) {
    console.log(cardId);
    var card = document.getElementById(cardId);
    card.className = card.className.substring(0, card.className.length -  " rotate".length);
}

function showCard(card) {
    card.className += " rotate";
}

var reactionLose = function(id1, id2) {
    var t = setTimeout(function() {
            // window.clearTimeout(t);
            hideCardById(id1);
            hideCardById(id2);
            cardsdisplayed[0] = null;
            cardsdisplayed[1] = null;
        },700);
    };

var reactionWin = function(id1, id2) {
    console.log('remove event click for '+id1);
    document.getElementById(id1).removeEventListener("click", rotate);
    console.log('remove event click for '+id2);
    document.getElementById(id2).removeEventListener("click", rotate);
    cardsdisplayed[0] = null;
    cardsdisplayed[1] = null;
};


function rotateAndValidateWith(card1, card2) {
    if (cardEqual(card1, card2)) {
        var fnc = function(e) {
            msgQueue.push(function() {
                reactionWin(card1.id, card2.id);
                card1.removeEventListener("transitionend", fnc);
            });
            waitAtLeastOneEvent();
        };
        card1.addEventListener("transitionend", fnc, false);
    } else {
        var fnc = function(e) {
            msgQueue.push(function() {
                reactionLose(card1.id, card2.id);
                card1.removeEventListener("transitionend", fnc);
            });
            waitAtLeastOneEvent();
        };
        card1.addEventListener("transitionend", fnc, false);
    }
    showCard(card1);
}

function cardEqual(card1, card2) {
    return card1.attributes.cid.value == card2.attributes.cid.value;
}

var array = document.getElementsByName("card");
for (var i = 0 ; i < array.length ; i++) {
    var object = array[i];°
    object.addEventListener("click", rotate);
}

var myTimer = null;
function waitAtLeastOneEvent() {
    var event = null;
    myTimer = setTimeout(function() {
        event = msgQueue.shift();
        if (event) {
            // window.clearTimeout(myTimer);
            myTimer = null;
            event();
        }
        while (event) {
            event = msgQueue.shift();
            if (event) {
                event();
            }
        }
    }, 20);
}



