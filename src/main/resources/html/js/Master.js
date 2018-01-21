class Master {
    constructor() {
        this.visibles = [];
        this.cards = [];
        this.nbrCard = 2;
    }

    addCard(idElem, card) {
        this.cards[idElem] = card;
    }


    notify(card, htmlCard) {
        if (htmlCard.visible) {
            this.visibles[htmlCard.id] = htmlCard.attributes.cid.value;
            this.didFindSameCards();
        } else {
            delete this.visibles[htmlCard.id];
        }
    }

    didFindSameCards() {
        if (this.nbrCard == Object.keys(this.visibles).length) {
            console.log('identiques !!');
            let targets = [];
            let cidFound = [];
            for (let key in this.visibles) {
                let htmlElem = document.getElementById(key);
                targets.push(htmlElem);
                console.log('tour '+key);
                if (!cidFound[htmlElem.attributes.cid.value]) {
                    cidFound[htmlElem.attributes.cid.value] = 0;
                }
                console.log(htmlElem);
                cidFound[htmlElem.attributes.cid.value]++;
            }
            if (Object.keys(cidFound).length == 1) {
                targets.forEach(e => {
                    this.removeListener(e);
                });
            } else {
                targets.forEach(e => {
                    console.log('click');
                    Card.hideHtmlCard(e);
                });
            }
            this.visibles = [];
        }
    }

    removeListener(htmlElem) {
        let elClone = htmlElem.cloneNode(true);
        htmlElem.parentNode.replaceChild(elClone, htmlElem);
    }

    hasWon() {

    }

}