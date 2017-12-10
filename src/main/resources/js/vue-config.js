
var imgs = [
    '../image/a.png',
    '../image/b.png'
];

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}
var cardsData = [];
for (var j = 0 ; j < imgs.length ; j++) {
    cardsData[j] = {  idImg:j, pathImg: imgs[j] };
}
for (var j = 0 ; j < imgs.length ; j++) {
    cardsData[imgs.length+j] = {  idImg:j, pathImg: imgs[j] };
}

shuffle(cardsData);


var app = new Vue({
  el: '#app',
  data: {
    todos: cardsData
  }
})