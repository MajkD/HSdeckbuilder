CardRep = function (scale, mouseX, mouseY, card) {
  this.myCard = card;
  this.myWidth = card.myImage.width * scale;
  this.myHeight = card.myImage.height * scale;
  this.myXPos = mouseX;
  this.myYPos = mouseY;
  this.myClickedXOffset = -1;
  this.myClickedYOffset = -1;
};

DeckBoard = function (width, height, xPos, yPos){
  this.myWidth = width;
  this.myHeight = height;
  this.myXPos = xPos;
  this.myYPos = yPos;
  this.myCurMouseX = -1;
  this.myCurMouseY = -1;
  this.myBackground = new Image(885, 638);
  this.myBackground.src = "./img/test/background_test.png";
  this.myDeck = new Array();
  this.myNumCards = 0;
  this.myCardScale = 1.0;
  this.myCanvasWidth = 0;
  this.myCanvasHeight = 0;

  //Selection
  this.myShouldRenderSelection = true;
  this.myShouldRenderSelectedCard = true;
  this.mySelectionChangedTimestamp = -1;
  this.myTimeToDisplaySelectedCard = 0.5;
  this.myLastSelected = -1;
  this.myCurrentSelected = -1;
  this.myCardTooltipScale = 1.0;
  this.myTooltipOffset = 20;

  InitializeSelectionImages(this);


  //TEST IMAGE FUN
  this.myArrowImage = new Image(100, 130);
  this.myArrowImage.src = "./img/test/leftArrow.png";
  this.myArrowImageCanvas = document.createElement('canvas');
  this.myArrowImageContext = this.myArrowImageCanvas.getContext('2d');
}

OutlineImageData = function (imageSource, alpha) {
  this.myCanvas = document.createElement('canvas');
  this.myContext = this.myCanvas.getContext('2d');
  this.myImage = new Image(286, 395);
  this.myImage.src = imageSource;
  this.myNeedRedraw = true;
  this.myAlphaValue = alpha;
};

var InitializeSelectionImages = function (board) {
  board.myOutlineImageData = new Array();

  //0 Minion
  //1 weapon
  //2 spell
  //3 legend

  minionBackground = new OutlineImageData("./img/test/minion.png", 150);
  board.myOutlineImageData.push(minionBackground);
  weaponBackground = new OutlineImageData("./img/test/weapon.png", 150);
  board.myOutlineImageData.push(weaponBackground);
  spellBackground = new OutlineImageData("./img/test/spell.png", 150);
  board.myOutlineImageData.push(spellBackground);
  legendBackground = new OutlineImageData("./img/test/legend.png", 150);
  board.myOutlineImageData.push(legendBackground);

  minionBackground = new OutlineImageData("./img/test/minion.png", 255);
  board.myOutlineImageData.push(minionBackground);
  weaponBackground = new OutlineImageData("./img/test/weapon.png", 255);
  board.myOutlineImageData.push(weaponBackground);
  spellBackground = new OutlineImageData("./img/test/spell.png", 255);
  board.myOutlineImageData.push(spellBackground);
  legendBackground = new OutlineImageData("./img/test/legend.png", 255);
  board.myOutlineImageData.push(legendBackground);

  board.mySelectionOutlineScale = 1.03;
}

var redrawSelectionImages = function (board) {
  for(selectionIndex = 0; selectionIndex < board.myOutlineImageData.length; selectionIndex++) {
    board.myOutlineImageData[selectionIndex].myNeedRedraw = true;
  }
}

var renderOutlineImages = function (board) {
  for(selIndex = 0; selIndex < board.myOutlineImageData.length; selIndex++){
    var curImageData = board.myOutlineImageData[selIndex];
    if(curImageData.myNeedRedraw) {
      renderOutlineImagesForCardType(board, curImageData);
      curImageData.myNeedRedraw = false;
    }
  }
}

DeckBoard.prototype.eventOnCardSelected = function (card) {
}

DeckBoard.prototype.disableSelection = function () {
  this.myShouldRenderSelection = false;
}

DeckBoard.prototype.enableSelection = function () {
  this.myShouldRenderSelection = true;
}

DeckBoard.prototype.handleMouseDown = function(event) {
  if(this.myCurrentSelected != -1) {
    onCardClicked(this, this.myCurrentSelected, event);
  }
}

DeckBoard.prototype.handleMouseUp = function(event) {
}

var onCardClicked = function (board, clickedCardIndex, event) {
  var selectedCard = board.myDeck[clickedCardIndex];
  selectedCard.myClickedXOffset = event.x - selectedCard.myXPos;
  selectedCard.myClickedYOffset = event.y - selectedCard.myYPos;
  board.eventOnCardSelected(selectedCard);
  removeCard(board, clickedCardIndex);
}

var renderOutlineImagesForCardType = function (board, outlineImageData) {
  var width = (outlineImageData.myImage.width * board.myCardScale) * board.mySelectionOutlineScale;
  var height = (outlineImageData.myImage.height * board.myCardScale) * board.mySelectionOutlineScale;
  outlineImageData.myCanvas.width = width;
  outlineImageData.myCanvas.height = height;
  outlineImageData.myContext.clearRect(0, 0, width, height);
  outlineImageData.myContext.drawImage(outlineImageData.myImage, 0, 0, width, height);

  var imageData = outlineImageData.myContext.getImageData(0, 0, width, height);
  for(index = 0; index < imageData.data.length; index+=4){
    if(imageData.data[index+3] > 0) {
      imageData.data[index] = 255;
      imageData.data[index+1] = 255;
      imageData.data[index+2] = 255;
      imageData.data[index+3] = outlineImageData.myAlphaValue;
    } else {
      imageData.data[index] = 0;
      imageData.data[index+1] = 0;
      imageData.data[index+2] = 0;
    }
  }
  outlineImageData.myContext.putImageData(imageData, 0, 0);
}

DeckBoard.prototype.setTooltipScale = function (scale) {
  this.myCardTooltipScale = scale;
}

DeckBoard.prototype.setCardScale = function (scale) {
  this.myCardScale = scale;
  redrawSelectionImages(this);
  adjustCardPositions(this);
}

DeckBoard.prototype.setDimensions = function (width, height) {
  this.myWidth = width;
  this.myHeight = height;
  adjustCardPositions(this);
}

var adjustCardPositions = function (board) {
  for (index = 0; index < board.myNumCards; index++){
    var currentCard = board.myDeck[index];
    var cardRight = currentCard.myXPos + currentCard.myWidth;
    var boardRight = board.myXPos + board.myWidth;
    var cardBottom = currentCard.myYPos + currentCard.myHeight;
    var boardBottom = board.myYPos + board.myHeight;
    if(cardRight > boardRight) {
      currentCard.myXPos -= (cardRight - boardRight);
    }
    if(cardBottom > boardBottom) {
      currentCard.myYPos -= (cardBottom - boardBottom);
    }
    //remove if ended up outside
    if(currentCard.myXPos < board.myXPos || currentCard.myYPos < board.myYPos) {
      removeCard(board, index);
    }
  }
}

DeckBoard.prototype.setCanvasSize = function (canvas) {
  this.myCanvasWidth = canvas.width;
  this.myCanvasHeight = canvas.height;
}

DeckBoard.prototype.setPosition = function (xPos, yPos) {
  this.myXPos = xPos;
  this.myYPos = yPos;
}

DeckBoard.prototype.addCard = function (xPos, yPos, cardRep) {
  newCard = new CardRep(this.myCardScale, xPos - cardRep.myClickedXOffset, yPos - cardRep.myClickedYOffset, cardRep.myCard);
  this.myDeck.push(newCard);
  this.myNumCards++;
}

var removeCard = function (board, cardIndex) {
  board.myDeck.splice(cardIndex, 1);
  board.myNumCards--;
  if(board.myCurrentSelected == cardIndex) {
    board.myCurrentSelected = -1;
  }
}

DeckBoard.prototype.handleMouseMoved = function (event) {
  this.myCurMouseX = event.x;
  this.myCurMouseY = event.y;
  updateSelection(this);
}

var updateSelection = function(board) {
  board.myLastSelected = board.myCurrentSelected;
  board.myCurrentSelected = getTopMouseOveredCardIndex(board);
  if(board.myLastSelected != board.myCurrentSelected) {
    board.mySelectionChangedTimestamp = new Date().getTime() / 1000;
  }
}

DeckBoard.prototype.update = function () {
  // console.log(this.myDeck);
}

DeckBoard.prototype.draw = function (context) {
  renderOutlineImages(this);
  context.drawImage(this.myBackground, this.myXPos, this.myYPos, this.myWidth, this.myHeight);
  // drawDimensions(this, context);

  for(index = 0; index < this.myNumCards; index++) {
    var cardRep = this.myDeck[index];
    if((this.myCurrentSelected == index) && this.myShouldRenderSelection) {
      this.drawOutline(cardRep, context, false);
    }
    context.drawImage(cardRep.myCard.myImage, cardRep.myXPos, cardRep.myYPos, cardRep.myWidth, cardRep.myHeight);
  }
  if(this.myShouldRenderSelectedCard && this.myCurrentSelected != -1) {
    drawSelectedCard(this, context, this.myDeck[this.myCurrentSelected]);
  }

  //TEST
  this.myArrowImageContext.clearRect(0, 0, this.myArrowImageCanvas.width, this.myArrowImageCanvas.height);
  this.myArrowImageContext.drawImage(this.myArrowImage, 0, 0, this.myArrowImage.width, this.myArrowImage.height);
  var originalData = this.myArrowImageContext.getImageData(0, 0, this.myArrowImage.width, this.myArrowImage.height);
  var brighter = brightness(this.myArrowImageContext.getImageData(0, 0, this.myArrowImage.width, this.myArrowImage.height), 50);
  var evenBrighter = brightness(this.myArrowImageContext.getImageData(0, 0, this.myArrowImage.width, this.myArrowImage.height), 70);
  var flipped = flipHorizontally(this.myArrowImageContext.getImageData(0, 0, this.myArrowImage.width, this.myArrowImage.height), this.myArrowImage.width, this.myArrowImage.height);

  this.myArrowImageContext.putImageData(originalData, 0, 0);
  context.drawImage(this.myArrowImageCanvas, 100, 100, this.myArrowImageCanvas.width, this.myArrowImageCanvas.height);

  this.myArrowImageContext.putImageData(brighter, 0, 0);
  context.drawImage(this.myArrowImageCanvas, 250, 100, this.myArrowImageCanvas.width, this.myArrowImageCanvas.height);

  this.myArrowImageContext.putImageData(evenBrighter, 0, 0);
  context.drawImage(this.myArrowImageCanvas, 400, 100, this.myArrowImageCanvas.width, this.myArrowImageCanvas.height);

  this.myArrowImageContext.putImageData(flipped, 0, 0);
  context.drawImage(this.myArrowImageCanvas, 550, 100, this.myArrowImageCanvas.width, this.myArrowImageCanvas.height);
}

var flipHorizontally = function (data, width, height) {
  var origData = []
  var length = data.data.length
  for(index = 0; index < length; index++) {
    origData[index] = data.data[index];
  }
  for(index = 0; index < length; index += 4){
    ycord = parseInt(index / (width * 4));
    xcord = (index % (width * 4)) / 4
    reverseX = width - xcord;
    reverseY  = height - ycord;
    reverseIndex = (reverseX * 4) + ((width * 4) * ycord);
    setPixelValue(data, reverseIndex, origData[index], origData[index+1], origData[index+2], origData[index+3])
  }
  return data;
}

var setPixelValue = function (data, index, r, g, b, a) {
  data.data[index] = r;
  data.data[index+1] = g;
  data.data[index+2] = b;
  data.data[index+3] = a;
}

var brightness = function(data, brightness) {
  for(index = 0; index < data.data.length; index+=4){
      data.data[index] += brightness;
      data.data[index+1] += brightness;
      data.data[index+2] += brightness;
      // data.data[index+3] = 155;
  }
  return data;
}

var drawSelectedCard = function (board, context, cardRep) {
  var curTime = new Date().getTime() / 1000;
  if(curTime > board.mySelectionChangedTimestamp + board.myTimeToDisplaySelectedCard) {
    var width = cardRep.myCard.myImage.width * board.myCardTooltipScale;
    var height = cardRep.myCard.myImage.height * board.myCardTooltipScale;
    var xPos = findSelectedXPos(board, cardRep, width);
    var yPos = findSelectedYPos(board, cardRep, height);
    context.drawImage(cardRep.myCard.myImage, xPos, yPos, width, height);
  }
}

var findSelectedXPos = function (board, cardRep, displayWidth) {
  var cardMiddle = cardRep.myXPos + (cardRep.myWidth * 0.5);
  if(cardMiddle < board.myCanvasWidth * 0.5) {
    //Draw right side
    return cardRep.myXPos + cardRep.myWidth; 
  } else {
    return cardRep.myXPos - displayWidth;
  }
}

var findSelectedYPos = function (board, cardRep, displayHeight) {
  if((cardRep.myYPos + displayHeight) > board.myCanvasHeight) {
    return board.myCanvasHeight - displayHeight;
  }
  return cardRep.myYPos;
}

var getTopMouseOveredCardIndex = function (board) {
  var highestOverlapping = -1;
  for (cardIndex = 0; cardIndex < board.myNumCards; cardIndex++){
    if(isMouseOver(board, board.myDeck[cardIndex])) {
      highestOverlapping = cardIndex;
    }
  }
  return highestOverlapping;
}

var isMouseOver = function (board, cardRep) {
  var cardX = cardRep.myXPos;
  var cardY = cardRep.myYPos;
  var imageWidth = cardRep.myCard.myImage.width * board.myCardScale;
  var imageHeight = cardRep.myCard.myImage.height * board.myCardScale;
  if(board.myCurMouseX >= cardX && board.myCurMouseX <= cardX + imageWidth) {
    if(board.myCurMouseY >= cardY && board.myCurMouseY <= cardY + imageHeight) {
      return true;
    }
  }
  return false;
}

var getOutlineCanvas = function (board, card, thick) {
  //0 Minion
  //1 weapon
  //2 spell
  //3 legend
  //4 minion thick
  //5 weapon thick
  //6 spell thick
  //7 legend thick

  var outlineIndex = -1;

  if (card.myType == "Ability") {
    outlineIndex = 2;
  } else if(card.myType == "Weapon") {
    outlineIndex = 1;
  } else if(card.myType == "Minion") {
    if(card.myRarity == "legendary") {
      outlineIndex = 3;
    } else {
      outlineIndex = 0;
    }
  }

  outlineIndex = thick ? outlineIndex + 4 : outlineIndex; 
  return board.myOutlineImageData[outlineIndex].myCanvas;
}

DeckBoard.prototype.drawOutline = function (cardRep, context, thick) {
  var canvas = getOutlineCanvas(this, cardRep.myCard, thick);
  var width = canvas.width;
  var height = canvas.height;
  var widthDiff = width - cardRep.myWidth;
  var heightDiff = height - cardRep.myHeight;
  var xPos = cardRep.myXPos - (widthDiff * 0.5);
  var yPos = cardRep.myYPos - (heightDiff * 0.5);
  context.drawImage(canvas, xPos, yPos, width, height);
}

var drawDimensions = function (board, context) {
  context.beginPath();
  context.lineWidth = "2";
  context.strokeStyle = "yellow";
  context.rect(board.myXPos, board.myYPos, board.myWidth, board.myHeight);
  context.stroke();
}
