function callGetArticles() {
    return mockDico;
}

function callAddCart(qty) {
    let article = selectedItemId;
    console.log('cmd '+article+' x '+qty);
}


function callUpdateCart(data) {
    let tmp = function() {
        toto();
    };
    doWithRetry(tmp, 5);
}

function doWithRetry(lamda, limitRetry) {
    let attempt = 0;
    let sendWithRetry = function() {
        try {
            lamda();
            log("successful sent ! " + JSON.stringify(data));
        } catch (e) {
            log("failure number " + attempt + " = "+e);
            attempt++;
            if (attempt < limitRetry) {
                msgQueue.push(sendWithRetry);
                waitAtLeastOneEvent();
            } else {
                // alert error
            }
        }
    };
    msgQueue.push(sendWithRetry);
    waitAtLeastOneEvent();
}

function callRefreshArticles() {

}

function callGetCart() {
    /*$.get( "js/shoplist/tools.js", function( data ) {
      alert(data );
    });*/
    return [{id:1, name:"lait", qty:1}, {id:2, name:"pistaches", qty:2}];
}
