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
