// Get the modal
var modal = document.getElementById('modalWindow');

// Get the button that opens the modal
var btn = document.getElementById("openModalBtnId");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function(e) {
    modal.style.display = "block";
    setTimeout(function() {
       let obj = document.getElementById("cardModal");
       Card.showHtmlCard(obj);
    },100);
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    let obj = document.getElementById("cardModal");
    Card.hideHtmlCard(obj);
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        let obj = document.getElementById("cardModal");
        Card.hideHtmlCard(obj);
        modal.style.display = "none";
    }
}



class DelayAction {
    constructor(eventName, obj) {
        this.htmlObject = obj;
        this.eventName = eventName;
        this.i = -1;
        this.actions = [];
        let actions = this.actions;
        let i = this.i;
        obj.addEventListener(eventName, function(e) {
            i++;
            actions[i]();
        });
    }
    wait(delayMs) {
        let obj = this.htmlObject;
        let eventName = this.eventName;
        this.actions.push(function() {
            let evt = new Event(eventName);
            setTimeout(function() {
                obj.dispatchEvent(evt);
            }, delayMs);
        });
        return this;
    }

    mustDo(lambda) {
        let obj = this.htmlObject;
        let eventName = this.eventName;
        this.actions.push(function() {
            lambda();
            let evt = new Event(eventName);
            obj.dispatchEvent(evt);
        });
        return this;
    }

    exec() {
        this.actions.push(function(){});
        let evt = new Event(this.eventName);
        this.htmlObject.dispatchEvent(evt);
    }
}

let obj = document.getElementById('testd');
let actions = new DelayAction('toto', obj);
actions.mustDo(function() {
    console.log('1');
}).wait(2000).mustDo(function() {
    console.log('2');
}).exec();

