class Card {
    constructor(htmlElement) {
        htmlElement.addEventListener("transitionend", this.callBack, false);
        htmlElement.addEventListener("click", this.turn, false);
        this.callBackActions = [];
        this.cardMode = htmlElement.attributes.mode || 1;
    }

    show(e) {
        e.currentTarget.className += " rotate";
        e.currentTarget.visible = true;
        let card = cards[e.currentTarget.id];
        if (card.cardMode == 1) {
            cards[e.currentTarget.id].callBackActions.push( function(evt) {
                master.notify(cards[evt.currentTarget.id], evt.currentTarget);
            } );
        } else {
            console.log(card.cardMode);
        }
    }

    static showHtmlCard(htmlCard) {
        htmlCard.className += " rotate";
        htmlCard.visible = true;
    }

    hide(e) {
        e.currentTarget.className = e.currentTarget.className.substring(0, e.currentTarget.className.length -  " rotate".length);
        e.currentTarget.visible = false;
        if (this.cardMode == 1) {
            master.notify(this, e.currentTarget);
        }
    }
    static hideHtmlCard(htmlCard) {
        htmlCard.className = htmlCard.className.substring(0, htmlCard.className.length -  " rotate".length);
        htmlCard.visible = false;
    }

    turn(e) {
        if (e.currentTarget.found || e.currentTarget.busy) {
            return null;
        }
        console.log('turn');
        e.currentTarget.busy = true;
        if (e.currentTarget.visible) {
            Card.prototype.hide(e);
        } else {
            console.log('gfdgdf');
            Card.prototype.show(e);
        }
    }

    callBack(e) {
        while (cards[e.currentTarget.id].callBackActions && cards[e.currentTarget.id].callBackActions.length > 0) {
            cards[e.currentTarget.id].callBackActions.shift()(e);
        }
        e.currentTarget.busy = false;
    }

}


cards = [];

var array = document.getElementsByName("card");
let master = new Master();
for (var i = 0 ; i < array.length ; i++) {
    var object = array[i];
    const card = new Card(object);
    card.master = master;
    master.addCard(object.id, card);
    cards[object.id] = card;
    // card.cid = object.cid;
}

