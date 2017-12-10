var cardsdisplayed = [];

function rotate(event) {
    rotateObj(event.currentTarget);
}

function rotateObj(obj) {
    if (obj.className.length > 15) {
        obj.className = obj.className.substring(0, obj.className.length -  " rotate".length);
        if (cardsdisplayed[0].id == obj.id) {
            cardsdisplayed[0] = cardsdisplayed[1];
            cardsdisplayed[1] = null;
        } else if (cardsdisplayed[1].id == obj.id) {
            cardsdisplayed[1] = cardsdisplayed[0];
            cardsdisplayed[0] = null;
        } else {
            alert('wut ?');
        }
    } else {
        obj.className += " rotate";
        if (cardsdisplayed[0] && cardsdisplayed[1]) {
            rotateObj(cardsdisplayed[0]);
            rotateObj(cardsdisplayed[0]);
            cardsdisplayed[0] = obj;
        } else if (cardsdisplayed[0]) {
            cardsdisplayed[1] = obj;
            // TODO win ?
        } else if (cardsdisplayed[1]) {
            cardsdisplayed[0] = obj;
            // TODO win ?
        } else {
            cardsdisplayed[0] = obj;
        }
    }
}

var array = document.getElementsByName("card");
for (var i = 0 ; i < array.length ; i++) {
    var object = array[i];
    object.addEventListener("click", rotate);
}



