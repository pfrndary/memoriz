/*
MESSAGE QUEUE
USAGE :
msgQueue.push(function() {
    rotateObj(id);
});
waitAtLeastOneEvent();
*/
var msgQueue = [];


var myTimer = null;
function waitAtLeastOneEvent() {
    var event = null;
    myTimer = setTimeout(function() {
        event = msgQueue.shift();
        if (event) {
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
/*
function waitAtLeastOneEvent() {
    var event = null;
    event = msgQueue.shift();
    if (event) {
        myTimer = null;
        event();
    } else {
        while (!event) {
            event = msgQueue.shift();
            if (event) {
                event();
            }
        }
    }
    while (event) {
        event = msgQueue.shift();
        if (event) {
            event();
        }
    }
}*/

/*
GENERATE HTML TAG
USAGE :
let tagInput = htmlTag("input", {id:"myId", type:"text", class:"myInputClass"}); // last parameter optional
let tagDiv = htmlTag("div", {id:"myId", class:"myDivClass"}); // last parameter optional
tagDiv.appendChild(tagInput);
parentTag.appendChild(tagDiv);
*/

function htmlTag(tag, attr, innerHTML) {
    let element = document.createElement(tag);
    for (let k in attr) {
        //log("key="+k+" ; value="+attr[k]);
        element.setAttribute(k, attr[k]);
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
}