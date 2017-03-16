var myCanvasContainer = null;
var myCanvas = null;
var myContext = null;
var myCardData = null;
var myPanelFromEdge = 50;
var myCurrentDraggedOutCard = null;
var myCurMouseX = 0;
var myCurMouseY = 0;
var myCardScale = 0.5;
var myCardTooltipScale = 0.8

myCardPanel = new CardPanel(270, 500);
myDeckBoard = new DeckBoard(850, 600, 30, 30);
myLogger = new Logger();

 var loadJSON = function (callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './cards/cards.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 var initializeCards = function () {
 loadJSON(function(response) {
    var cards_JSON = JSON.parse(response);
    myCardData = cards_JSON.cardData;
    cardJSONLoaded();
 });
}

var cardJSONLoaded = function () {
  updateLoadingProgress();
  myCardSpawn = setInterval(spawnCard, 1);
}

var updateLoadingProgress = function () {
  myContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
  progress = parseInt((myCurCardToAdd / myCardData.length) * 100);
  myLogger.logToScreen("Initializing cards...." + progress + "%");
  myLogger.draw(myContext);
}

var myCurCardToAdd = 0;
var spawnCard = function () {
  if(myCurCardToAdd < myCardData.length) {
    var card = new Card(myCardData[myCurCardToAdd]);
    addRandomTimes(card);
    // myCardPanel.addCard(card);
    myCurCardToAdd++;
    updateLoadingProgress();
  } else {
    clearInterval(myCardSpawn);
    myLogger.clearLog();
    setInterval(tick, 1000 / 30); //30 FPS
  }
}

var addRandomTimes = function(card) {
  var random = Math.floor((Math.random() * 2) + 1);
  for(randIndex = 0; randIndex < random; randIndex++) {
    myCardPanel.addCard(card);
  }
}

var initializeCanvas = function () {

  myCanvasContainer = document.createElement('div');
  document.body.appendChild(myCanvasContainer);
  myCanvasContainer.style.position = "absolute";
  myCanvasContainer.style.left = "0px";
  myCanvasContainer.style.top = "0px";
  myCanvasContainer.style.width = "100%";
  myCanvasContainer.style.height = "100%";
  myCanvasContainer.style.zIndex = "1000";

  myCanvas = document.createElement('canvas');
  myCanvas.style.width = myCanvasContainer.scrollWidth + "px";
  myCanvas.style.height = myCanvasContainer.scrollHeight + "px";
  myCanvas.width = myCanvasContainer.scrollWidth;
  myCanvas.height = myCanvasContainer.scrollHeight;
  myCanvas.style.overflow = "visible";
  myCanvas.style.position = "absolute";
  myCanvas.style.backgroundColor = "#171717";
  // myCanvas.style.backgroundColor = "gray";
  myCanvasContainer.appendChild(myCanvas);

  myContext = myCanvas.getContext('2d');

  updateDimensions();
}

var updateCanvasSize = function () {
  myCanvasContainer.scrollWidth = window.innerWidth;
  myCanvasContainer.scrollHeight = window.innerHeight;
  myCanvas.style.width = window.innerWidth + "px";
  myCanvas.style.height = window.innerHeight + "px";
  myCanvas.width = window.innerWidth;
  myCanvas.height = window.innerHeight;

  updateDimensions();
}

var updateDimensions = function () {
  myCardPanel.setHeight(myCanvas.height - (myPanelFromEdge * 2));
  myCardPanel.setPosition(myCanvas.width - myCardPanel.myWidth - myPanelFromEdge, myPanelFromEdge)
  myDeckBoard.setDimensions(myCardPanel.myXpos - (myPanelFromEdge * 2), myCanvas.height - (myPanelFromEdge * 2));
  myDeckBoard.setPosition(myPanelFromEdge, myPanelFromEdge);
  myDeckBoard.setCardScale(myCardScale);
  myDeckBoard.setCanvasSize(myCanvas);
}

var draw = function () {
  myContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
  myDeckBoard.draw(myContext);
  myCardPanel.draw(myContext);
  myLogger.draw(myContext);
  drawDraggedOutCard();
  drawLegal();
}

var tick = function (){
  myCardPanel.update();
  myDeckBoard.update();
  draw();
}

var drawLegal = function () {
  myContext.font = "15px Arial";
  myContext.fillStyle = "white";
  var xPos = 50;
  var yPos = myCanvas.height - 30;
  myContext.fillText("Icons & card images \u00A9 2016 Activision Blizzard.", xPos, yPos);
}

var cardIsInsideBoard = function () {
  if(myCurrentDraggedOutCard != null) {
    var width = myCurrentDraggedOutCard.myWidth;
    var height = myCurrentDraggedOutCard.myHeight;
    var xPos = myCurMouseX - myCurrentDraggedOutCard.myClickedXOffset;
    var yPos = myCurMouseY - myCurrentDraggedOutCard.myClickedYOffset;
    if(xPos >= myDeckBoard.myXPos && (xPos + width) <= (myDeckBoard.myXPos + myDeckBoard.myWidth)) {
      if(yPos >= myDeckBoard.myYPos && (yPos + height) <= (myDeckBoard.myYPos + myDeckBoard.myHeight)) {
        return true;
      }
    }
  }
  return false;
}

var drawDraggedOutCard = function () {
  if(myCurrentDraggedOutCard == null) {
    return;
  }
  var width = myCurrentDraggedOutCard.myWidth;
  var height = myCurrentDraggedOutCard.myHeight;
  var xPos = myCurMouseX - myCurrentDraggedOutCard.myClickedXOffset;
  var yPos = myCurMouseY - myCurrentDraggedOutCard.myClickedYOffset;
  myCurrentDraggedOutCard.myXPos = xPos;
  myCurrentDraggedOutCard.myYPos = yPos;
  myDeckBoard.drawOutline(myCurrentDraggedOutCard, myContext, true);
  myContext.drawImage(myCurrentDraggedOutCard.myCard.myImage, xPos, yPos, width, height);
}

var handleMouseMoved = function (event) {
  myCardPanel.handleMouseMoved(event);
  myDeckBoard.handleMouseMoved(event);
  myCurMouseX = event.x;
  myCurMouseY = event.y;
}

var handleMoueWheel = function (event) {
  myCardPanel.handleMouseWheel(event);
}

var handleResize = function (event) {
  updateCanvasSize();
}

var handleMouseDown = function (event) {
  myCardPanel.handleMouseDown(event);
  myDeckBoard.handleMouseDown(event);
}

var handleMouseUp = function (event) {
  myCardPanel.handleMouseUp(event);
  myDeckBoard.handleMouseUp(event);

  if(cardIsInsideBoard()) {
    myDeckBoard.addCard(myCurMouseX, myCurMouseY, myCurrentDraggedOutCard);
  } else {
    if(myCurrentDraggedOutCard != null) {
      myCardPanel.addCard(myCurrentDraggedOutCard.myCard);
    }
  }

  myCurrentDraggedOutCard = null;
  myDeckBoard.enableSelection();
}

var handleMouseClicked = function (event) {
}

var onCardDraggedOut = function (card) {
  myCurrentDraggedOutCard = new CardRep(myCardScale, 0, 0, card);
  myCurrentDraggedOutCard.myClickedXOffset = (card.myImage.width * myCardScale) * 0.5;
  myCurrentDraggedOutCard.myClickedYOffset = (card.myImage.height * myCardScale) * 0.5;
  myDeckBoard.disableSelection();
}

var onCardSelected = function (cardRep) {
  myCurrentDraggedOutCard = cardRep;
  myDeckBoard.disableSelection();
}

initializeCards();
initializeCanvas();
// myLogger.logToScreen("Loading card data...");
// myLogger.draw(myContext);

myCardPanel.setTooltipScale(myCardTooltipScale);
myDeckBoard.setTooltipScale(myCardTooltipScale);
myDeckBoard.eventOnCardSelected = onCardSelected;
myCardPanel.eventOnCardDraggedOut = onCardDraggedOut;
document.onclick = handleMouseClicked;
document.onmousemove = handleMouseMoved;
document.onwheel = handleMoueWheel;
document.onmousedown = handleMouseDown;
document.onmouseup = handleMouseUp;
window.onresize = handleResize;