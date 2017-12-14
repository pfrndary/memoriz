class Card {
    constructor(htmlElement) {
        /*this.visible = false;
        this.found = false;
        this.busy = false;
        this.cid = null;
        this.htmlElement = htmlElement;
        this.callBackActions = [];*/
        htmlElement.addEventListener("transitionend", this.callBack, false);
        htmlElement.addEventListener("click", this.turn, false);
    }

    isequalTo(obj) {
        return obj && obj.cid == this.cid;
    }

    show(e) {
        e.currentTarget.addEventListener("transitionend", this.callBack, false);
        e.currentTarget.className += " rotate";
        e.currentTarget.visible = true;
        this.master.notify(this, e.currentTarget);
    }

    hide(e) {
        e.currentTarget.className = e.currentTarget.className.substring(0, e.currentTarget.className.length -  " rotate".length);
        e.currentTarget.visible = false;
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
        console.log('callback');
        while (this.callBackActions && this.callBackActions.length > 0) {
            this.callBackActions.shift()(e);
        }
        e.currentTarget.busy = false;
    }

}

/*function Card(htmlElement) {
    this.visible = false;
    this.found = false;
    this.busy = false;
    this.cid = null;
    this.htmlElement = htmlElement;
    this.callBack = [];
    this.htmlElement.addEventListener("transitionend", this.callBack, false);
    this.htmlElement.addEventListener("click", this.turn, false);
}



Card.prototype.equals = function(obj) {
    return obj && obj.cid == this.cid;
}

Card.prototype.setHtmlElement = function(elem) {
    this.htmlElement = elem;
    this.htmlElement.addEventListener("transitionend", Card.prototype.callBack, false);
    this.htmlElement.addEventListener("click", Card.prototype.turn, false);
}

Card.prototype.show = function() {
    console.log(this.htmlElement);
    this.htmlElement.className += " rotate";
}

Card.prototype.hide = function() {
    this.htmlElement.className = this.htmlElement.className.substring(0, this.htmlElement.className.length -  " rotate".length);
    this.visible = false;
}

Card.prototype.turn = function() {
    if (this.found || this.busy) {
        return null;
    }
    this.busy = true;
    if (this.visible) {
        Card.prototype.hide();
    } else {
    console.log('gfdgdf');
         Card.prototype.show();
  
    }
}

Card.prototype.callBack = function(e) {
    while (callBack.length > 0) {
        this.callBack.shift()(e);
    }
    this.busy = false;
}

Card.prototype.getVueData = function() {
    return { idImg:this.cid, pathImg:this.path };
}*/


var array = document.getElementsByName("card");
let master = new Master();
for (var i = 0 ; i < array.length ; i++) {
    var object = array[i];
    const card = new Card(object);
    card.master = master;
    // card.cid = object.cid;
}

