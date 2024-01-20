var d = document.getElementById('square1');
var divCount;
var dir;
var timer;
var isSelfBite;
var dir_prev;
var biteCounter;
var steps=[80,50,30,10];
var bonus=[90,250,500,900];
var scoreUp=[30,50,100,400];
var level;
var isSpecialFoodPresent;
var specialFoodTimerStart;
var specialFoodTimerEnd;


function start(){
  init();
  var e = document.getElementById("level");
  level = e.value;
  placeFood();
  moveDiv();
}

function init(){
  for (var i = divCount; i > 1; i--) {
      var d_ = document.getElementById("square" + i);
      d_.remove();
  }
  divCount=1;
  $('#square1').css({
    'background-color': 'brown',
      'left': '40px',
      'top': '40px',
  });
  $('#score').val(0);
  $('#gameOver').hide();
  dir = 'right';
  isSelfBite = false;
  biteCounter=0;
  isSpecialFoodPresent=false;
}

document.addEventListener('keydown', function(event) {
    if (event.keyCode == 37) {
        dir = 'left';
    } else if (event.keyCode == 38) {
        dir = 'up';
    } else if (event.keyCode == 39) {
        dir = 'right';
    } else if (event.keyCode == 40) {
        dir = 'down';
    }
    dir = isReversePossible() ? dir : dir_prev;
}, true);

function moveDiv() {
    for (var i = divCount; i > 1; i--) {
        var d_ = document.getElementById("square" + i);
        var d_prev = document.getElementById("square" + (i - 1));
        d_.style.left = d_prev.offsetLeft + 'px';
        d_.style.top = d_prev.offsetTop + 'px';
    }
    if (dir == 'right') {
        checkBite(d.offsetLeft + 10, d.offsetTop);
        d.style.left = d.offsetLeft + 10 + 'px';
        if (isGameOver(d.offsetLeft, 420)) return;
    } else if (dir == 'left') {
        checkBite(d.offsetLeft - 10, d.offsetTop);
        d.style.left = d.offsetLeft - 10 + 'px';
        if (isGameOver(d.offsetLeft, 10)) return;
    } else if (dir == 'up') {
        checkBite(d.offsetLeft, d.offsetTop - 10);
        d.style.top = d.offsetTop - 10 + 'px';
        if (isGameOver(d.offsetTop, 10)) return;
    } else {
        checkBite(d.offsetLeft, d.offsetTop + 10);
        d.style.top = d.offsetTop + 10 + 'px';
        if (isGameOver(d.offsetTop, 420)) return;
    }
    dir_prev = dir;
    timer = window.setTimeout(moveDiv, steps[level]);
}

function placeFood() {
    var obj;
    var posx;
    var posy;
    do {
        posx = Math.floor((Math.random() * (390)).toFixed()) + 20;
        posy = Math.floor((Math.random() * (390)).toFixed()) + 20;
        posx = posx % 10 == 0 ? posx : Math.ceil((posx / 10)) * 10;
        posy = posy % 10 == 0 ? posy : Math.ceil((posy / 10)) * 10;
        obj = document.elementFromPoint(posx, posy);
    }
    while (window.getComputedStyle(obj).backgroundColor != 'rgb(0, 255, 255)');

    $('#food').css({
        'position': 'absolute',
        'left': posx + 'px',
        'top': posy + 'px',
    });
}

function placeSpecialFood() {
    var obj;
    var posx;
    var posy;
    do {
        posx = Math.floor((Math.random() * (390)).toFixed()) + 20;
        posy = Math.floor((Math.random() * (390)).toFixed()) + 20;
        posx = posx % 10 == 0 ? posx : Math.ceil((posx / 10)) * 10;
        posy = posy % 10 == 0 ? posy : Math.ceil((posy / 10)) * 10;
        obj = document.elementFromPoint(posx, posy);
    }
    while (window.getComputedStyle(obj).backgroundColor != 'rgb(0, 255, 255)');

    $('#specialFood').css({
        'position': 'absolute',
        'left': posx + 'px',
        'top': posy + 'px',
        'display':'block'
    });
    $('.wrapper').show();
    isSpecialFoodPresent = true;
    specialFoodTimerStart = Date.now();
    setTimeout(function() {
      $('#specialFood').css({
          'display':'none'
      });
      $('.wrapper').hide();
      isSpecialFoodPresent = false;
    }, 7000);
}

function checkBite(x, y) {
    var obj = document.elementFromPoint(x, y);
    if (obj.className == 'specialFood') {
      specialFoodTimerEnd = Date.now();
      addBonus(calcBonusPerc());
      $('#specialFood').css({
          'display':'none'
      });
      $('.wrapper').hide();
    }
    if (obj.className == 'food') {
        placeFood();
        incrementScore();
        growSnake();
        if(!isSpecialFoodPresent && ++biteCounter == 3){
          placeSpecialFood();
          biteCounter = 0;
        }
    } else if (obj.className == 'square') {
        isSelfBite = true;
    }
}

function incrementScore() {
    var currScore = parseInt($('#score').val());
    currScore += scoreUp[level];
    $('#score').val(currScore);
}

function addBonus(perc) {
    var currScore = parseInt($('#score').val());
    currScore += Math.round(bonus[level]*perc);
    $('#score').val(currScore);
}

function calcBonusPerc(){
  diffInMill = specialFoodTimerEnd-specialFoodTimerStart;
  diffInSec = Math.ceil(diffInMill/1000);
  bonusPerc = (7-diffInSec)/7;
  return bonusPerc;
}

function growSnake() {
    for (var i = 0; i <= 2; i++) {
        $("#wall").append("<div id=\"square" + ++divCount + "\" class=\"square\" style=\"left:" + parseInt(20030) + "px;top:" + parseInt(20030) + "px\"></div>");
    }
}

function isReversePossible() {
    if (divCount > 1 && ((dir == 'up' && dir_prev == 'down') ||
            (dir == 'down' && dir_prev == 'up') ||
            (dir == 'left' && dir_prev == 'right') ||
            (dir == 'right' && dir_prev == 'left'))) {
        return false;
    }
    return true;
}

function isGameOver(pos, offset) {
    if (pos == offset || isSelfBite) {
        d.style.backgroundColor = "yellow";
        gameOver();
        clearTimeout(timer);
        return true;
    }
    return false;
}

function gameOver() {
    $('#gameOver').show();
    $('#specialFood').hide();
    $('.wrapper').hide();
}
