CardPanel = function (width, height){
  this.myListElements = new Array();
  this.myNumElements = 0;
  this.myWidth = width;
  this.myHeight = height;
  this.myImageOffscreenCanvas = document.createElement('canvas'); // detached from DOM
  this.myImageOffscreenContext = this.myImageOffscreenCanvas.getContext('2d');
  this.myXpos = 0;
  this.myYpos = 0;

  //element sizing
  this.myElementScale = 1.0;
  this.myElementHeight = 25;
  this.myElementSpacing = 2;
  this.myScaledElementHeight = this.myElementHeight * this.myElementScale;
  //offset to hide background after card image
  this.myScaledBackgroundOffset = 5 * this.myElementScale;

  this.myScaledSpacingHeight = this.myElementSpacing * this.myElementScale;

  //vars for selecting partial image from original
  this.myPartialX = 80;
  this.myPartialY = 42;
  this.myPartialWidth = 185;
  this.myPartialHeight = 50;
  this.myScaledCardImageSize = 90 * this.myElementScale;

  // Scrollbar
  this.myScrollbarWidth = 5;
  this.myAllowScrolling = false;
  this.myScrollbarMinHeight = (this.myScaledSpacingHeight + this.myScaledElementHeight) * 2;
  this.myScrollbarX = 0;
  this.myScrollbarY = 0;
  this.myScrollbarHeight = 0;
  this.myScrollbarClicked = -1;

  //Mana cost render data
  this.myManaCostImage = new Image(34, 34);
  this.myManaCostImage.src = "./img/manaCost.png";
  this.myScaledManaCostImageWidth = this.myManaCostImage.width * this.myElementScale;
  //Added small tweak to make image fit better
  this.myScaledManaCostImageHeight = 1 + this.myManaCostImage.height * this.myElementScale;
  this.myScaledModifiedImageHeight = 1 * this.myElementScale;
  this.myScaledManaCostWidth = 25 * this.myElementScale;
  this.myScaledXOffset = -6 * this.myElementScale;
  this.myScaledYOffset = -6 * this.myElementScale;
  this.myManaCostFontSize = 20 * this.myElementScale;
  this.myScaledFontOneDigitPosX = 8 * this.myElementScale;
  this.myScaledFontOneDigitPosY = 20 * this.myElementScale;
  this.myScaledFontTwoDigitsPosX = 1 * this.myElementScale;
  this.myScaledFontTwoDigitsPosY = 20 * this.myElementScale;
  this.myManaCostOutlineOffset = 1 * this.myElementScale;

  // Draw card amount
  this.myScaledCardAmountWidth = 15 * this.myElementScale;
  this.myScaledAmountPosY = 19 * this.myElementScale;
  this.myAmountCardsFontSize = 15 * this.myElementScale;
  this.myScaledAmountTextXOffset = 4 * this.myElementScale;

  // Card name
  this.myScaledNameXPos = 30 * this.myElementScale;
  this.myScaledNameYPos = 17 * this.myElementScale;
  this.myScaledNameFontSize = 13 * this.myElementScale;
  this.myCardNameOutlineOffset = 1 * this.myElementScale;

  // Selecting cards
  this.myCurrentSelected = -1;
  this.myLastSelected = -1;
  this.mySelectionChangedTimestamp = -1;
  this.myTimeToDisplaySelectedCard = 0.5;
  this.myShouldDisplaySelectedCard = false;
  this.mySelectedCardScaling = 0.8;
  // Used for selection line 
  this.myScaledManaIconStart = 7 * this.myElementScale;
  this.myIsDraggingCard = false;
  this.mySelectedAlpha = 0.5;
  this.mySelectedLineWidth = 1.0;
  this.mySelectedAlphaFadeSpeed = 0.1;
  this.mySelectedLineWidthFadeSpeed = 0.2;

  //mouse events
  this.myMouseIsOverList = false;
  this.myMousePosX = -1;
  this.myMousePosY = -1;

  // Scroll features
  this.myScrollOffset = 0;
  this.myScrollSpeed = 0.5;
  this.myMaxScroll = 0;
  this.myPercVisiblElements = 0;
  this.myNeedRecalsScrollbar = true;
};

CardElement = function (panel, card) {
  this.myCard = card;
  this.myNumCards = 1;
  this.myOffscreenCanvas = document.createElement('canvas'); // detached from DOM
  this.myOffscreenContext = this.myOffscreenCanvas.getContext('2d');
  this.myNeedRedraw = true;
};

CardPanel.prototype.setTooltipScale = function (scale) {
  this.mySelectedCardScaling = scale;
}

CardPanel.prototype.setPosition = function (xPos, yPos) {
  this.myXpos = xPos;
  this.myYpos = yPos;
}

CardPanel.prototype.setHeight = function (height) {
  this.myHeight = height;
  this.myNeedRecalsScrollbar = true;
}

var consumeEvent = function (event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

var mouseOvarlapsList = function (event, panel) {
  if (event.x <= panel.myXpos || event.x > (panel.myXpos + panel.myWidth)) {
    return false;
  }

  if (event.y <= panel.myYpos || event.y > panel.myYpos + panel.myHeight) {
    return false;
  }

  return true;
}

CardPanel.prototype.handleMouseMoved = function (event) {
  if(this.myScrollbarClicked != -1) {
    dragScroll(this, event.y - this.myScrollbarClicked);
  } else {
    handleSelection(this);
  }

  this.myMousePosX = event.x;
  this.myMousePosY = event.y;

  consumeEvent(event);
}

var resetSelection = function (panel) {
  selectionChanged(panel, panel.myLastSelected, -1)
  panel.myCurrentSelected = -1;
  panel.myLastSelected = -1;
}

var handleSelection = function (panel) {
  if(!mouseOvarlapsList(event, panel)) {
    if(panel.myMouseIsOverList) {
      panel.myMouseIsOverList = false;
      onMouseLeftList(panel);
    }
    return;
  }

  if(!panel.myMouseIsOverList) {
    panel.myMouseIsOverList = true;
    onMouseEnteredList(panel);
  }

  if(!panel.myIsDraggingCard) {
    panel.myCurrentSelected = parseInt((event.y - (panel.myYpos + panel.myScrollOffset)) / (panel.myScaledElementHeight + panel.myScaledSpacingHeight));
    if(panel.myLastSelected != panel.myCurrentSelected) {
      selectionChanged(panel, panel.myLastSelected, panel.myCurrentSelected);
      panel.myLastSelected = panel.myCurrentSelected;
    }
  }
}

CardPanel.prototype.eventOnCardDraggedOut = function (card) {
}

var onMouseLeftList = function (panel) {
  if(panel.myIsDraggingCard) {
    card = panel.myListElements[panel.myCurrentSelected].myCard;
    card.myLastIndex = panel.myCurrentSelected;
    panel.eventOnCardDraggedOut(card);
    panel.removeCard(panel.myCurrentSelected);
    stopDraggingCard(panel);
  }
  resetSelection(panel);
}

var onMouseEnteredList = function (panel) {
  //set timestamp so we get delay after re-entering list
  panel.mySelectionChangedTimestamp = new Date().getTime() / 1000;
}

CardPanel.prototype.handleMouseWheel = function (event) {
  if(!mouseOvarlapsList(event, this)) {
    return;
  }
  performScrolling(this, event.deltaY)
  consumeEvent(event);
}

var dragScroll = function (panel, mouseY) {
  if(!panel.myAllowScrolling) {
    return;
  }

  resetSelection(panel);
  setScrollbarPos(panel, mouseY);
}

var performScrolling = function (panel, deltaY) {
  if(!panel.myAllowScrolling) {
    return;
  }

  resetSelection(panel);

  panel.myScrollOffset = clamp(panel.myScrollOffset + (-deltaY * panel.myScrollSpeed), panel.myMaxScroll, 0);
  updateScrollbarPos(panel);
}

var clamp = function(value, min, max) {
  value = value < min ? min : value;
  value = value > max ? max : value;
  return value;
}

var overlapsScrollbar = function (panel) {
  var mouseX = panel.myMousePosX;
  var mouseY = panel.myMousePosY;
  if(mouseX >= panel.myScrollbarX && mouseX <= panel.myScrollbarX + panel.myScrollbarWidth) {
    if(mouseY >= panel.myScrollbarY && mouseY <= panel.myScrollbarY + panel.myScrollbarHeight) {
      return true;
    }
  }
  return false;
}

CardPanel.prototype.handleMouseDown = function (event) {
  if(overlapsScrollbar(this)) {
    this.myScrollbarClicked = event.y - this.myScrollbarY;
    consumeEvent(event);
  }

  if(this.myCurrentSelected != -1) {
    this.myIsDraggingCard = true;
    consumeEvent(event);
  }
}

CardPanel.prototype.handleMouseUp = function (event) {
  if(this.myScrollbarClicked != -1) {
    this.myScrollbarClicked = -1;
  }
  if(this.myIsDraggingCard) {
    stopDraggingCard(this);
  }
  consumeEvent(event);
}

var stopDraggingCard = function (panel) {
  panel.myIsDraggingCard = false;
  panel.mySelectedAlpha = 0.5;
  panel.mySelectedLineWidth = 1.0;
  panel.myListElements[panel.myCurrentSelected].myNeedRedraw = true;
}

var selectionChanged = function (panel, oldIndex, newIndex) {
  panel.mySelectionChangedTimestamp = new Date().getTime() / 1000;
  if(oldIndex != -1 && panel.myListElements[oldIndex] != null) {
    panel.myListElements[oldIndex].myNeedRedraw = true;
  }
  if(newIndex != -1 && panel.myListElements[newIndex] != null) {
    panel.myListElements[newIndex].myNeedRedraw = true;
  }
}

CardPanel.prototype.update = function () {
  if(this.myCurrentSelected != -1) {
    var curTime = new Date().getTime() / 1000;
    if (curTime >= this.mySelectionChangedTimestamp + this.myTimeToDisplaySelectedCard) {
      this.myShouldDisplaySelectedCard = true;
    } else {
      this.myShouldDisplaySelectedCard = false;
    }
  }

  if(this.myNeedRecalsScrollbar) {
    recalcScrollbar(this);
    this.myNeedRecalsScrollbar = false;
  }

  if(this.myIsDraggingCard) {
    this.mySelectedAlpha = clamp(this.mySelectedAlpha + this.mySelectedAlphaFadeSpeed, 0.5, 1);
    this.mySelectedLineWidth = clamp(this.mySelectedLineWidth + this.mySelectedLineWidthFadeSpeed, 1, 2);
    this.myListElements[this.myCurrentSelected].myNeedRedraw = true;
  }
}

var findElement = function (panel, cardName) {
  for (index = 0; index < panel.myNumElements; index++) {
    if(panel.myListElements[index].myCard.myName == cardName) {
      return index;
    }
  }
  return -1;
}

CardPanel.prototype.addCard = function(card) {
  var elementIndex = findElement(this, card.myName);
  if (elementIndex == -1) {
    var newElement = new CardElement(this, card);
    if(card.myLastIndex != -1) {
      this.myListElements.splice(card.myLastIndex, 0, newElement);
      this.myListElements.push(newElement);
    } else {
      this.myListElements.push(newElement);
    }
    this.myNumElements++;
    this.myNeedRecalsScrollbar = true;
  } else {
    this.myListElements[elementIndex].myNumCards++;
    this.myListElements[elementIndex].myNeedRedraw = true;
  }
};

CardPanel.prototype.removeCard = function (elementIndex) {
  if (elementIndex != -1) {
    if (this.myListElements[elementIndex].myNumCards > 1) {
      this.myListElements[elementIndex].myNumCards--;
      this.myListElements[elementIndex].myNeedRedraw = true;
    } else {
      deleteElement(this, elementIndex)
    }
  }
}

var deleteElement = function (panel, elementIndex) {
  panel.myListElements.splice(elementIndex, 1);
  panel.myNumElements--;
  panel.myNeedRecalsScrollbar = true;
}

var recalcScrollbar = function (panel) {
  var totalElementSize = (panel.myElementHeight * panel.myNumElements) * panel.myElementScale;
  var totalSpacing = (panel.myElementSpacing * panel.myNumElements) * panel.myElementScale;
  var totalSize = totalElementSize + totalSpacing;
  if(totalSize - panel.myHeight > 0) {
    panel.myAllowScrolling = true;
    panel.myMaxScroll = -(totalSize - panel.myHeight);
    panel.myScrollOffset = clamp(panel.myScrollOffset, panel.myMaxScroll, 0);
  } else {
    panel.myAllowScrolling = false;
  }

  updateScrollbarPos(panel);
}

CardPanel.prototype.draw = function (context) {
  var curY = this.myYpos + this.myScrollOffset;

  for(index = 0; index < this.myNumElements; index++) {
    var le = this.myListElements[index];
    if (le != null) {
      currentSelected = (this.myCurrentSelected == index);
      if(le.myNeedRedraw ) {
        drawToElementCanvas(this, le.myOffscreenContext, le, currentSelected, le.myOffscreenCanvas);
        le.myNeedRedraw = false;
      }
      if(isElementInsidePanel(this, curY)) {
        drawOffscreenCanvasToContext(this, le.myOffscreenCanvas, curY, context);
        if (currentSelected) {
          drawSelectedCardToContext(this, le.myCard, curY, context);
        }
      }
      curY += (this.myScaledElementHeight + this.myScaledSpacingHeight);
    }
  }
  renderScrollbar(this, context);
};

var drawToElementCanvas = function(panel, context, le, selected, canvas) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(panel, context, le);
  drawManaCost(panel, context, le.myCard);
  drawName(panel, context, le.myCard);
  drawCardToOffScreen(panel, le.myCard);
  drawCard(panel, context, le);
  drawNumCards(panel, context, le);

  if (selected) {
    drawSelectedFrame(panel, context);
  }
}

var drawSelectedCardToContext = function (panel, card, curY, context) {
  if(panel.myShouldDisplaySelectedCard && !panel.myIsDraggingCard) {
    var width = card.myImage.width * panel.mySelectedCardScaling;
    var height = card.myImage.height * panel.mySelectedCardScaling;
    var maxY = panel.myYpos + panel.myHeight - height;
    curY = clamp(curY - (height * 0.5), panel.myYpos, maxY);
  }
  context.drawImage(card.myImage, panel.myXpos - width, curY, width, height);
}

var drawSelectedFrame = function (panel, context) {
  context.beginPath();
  context.lineWidth = panel.mySelectedLineWidth;
  context.strokeStyle = "rgba(255, 255, 255, " + panel.mySelectedAlpha + ")";
  context.moveTo(panel.myScaledManaIconStart, 1);
  context.lineTo(panel.myWidth - 1, 1);
  context.lineTo(panel.myWidth - 1, panel.myScaledElementHeight - 1);
  context.lineTo(panel.myScaledManaIconStart, panel.myScaledElementHeight - 1);
  context.lineTo(1, (panel.myScaledElementHeight - 1) * 0.5);
  context.lineTo(panel.myScaledManaIconStart, 1);
  context.stroke();
};

var drawOffscreenCanvasToContext = function (panel, elOffCanvas, curY, context) {
  width = elOffCanvas.width;
  height = elOffCanvas.height;
  var elementTopOffset = panel.myYpos - curY;
  var elementBottomOffset =  (panel.myYpos + panel.myHeight) - (curY + panel.myScaledElementHeight + panel.myScaledSpacingHeight);
  if(elementTopOffset > 0) {
    context.drawImage(elOffCanvas, 0, elementTopOffset, width, height, panel.myXpos, curY + elementTopOffset, width, height);
  } else if (elementBottomOffset < 0) {
    height = panel.myScaledElementHeight + panel.myScaledSpacingHeight;
    context.drawImage(elOffCanvas, 0, elementBottomOffset, width, height, panel.myXpos, curY + elementBottomOffset, width, height);
  } else {
    context.drawImage(elOffCanvas, 0, 0, width, height, panel.myXpos, curY, width, height);
  }
}

var setScrollbarPos = function (panel, mouseY) {
  panel.myScrollbarY = clamp(mouseY, panel.myYpos, panel.myYpos + panel.myHeight - panel.myScrollbarHeight);
  var scrollPerc = (panel.myScrollbarY - panel.myYpos) / (panel.myHeight - panel.myScrollbarHeight);
  panel.myScrollOffset = clamp(panel.myMaxScroll * scrollPerc, panel.myMaxScroll, 0);
}

var updateScrollbarPos = function (panel) {
  if(!panel.myAllowScrolling) {
    return;
  }
  var scaledSpacing = (panel.myElementSpacing * panel.myElementScale);
  panel.myScrollbarX = panel.myXpos + panel.myWidth + scaledSpacing;

  panel.myScrollbarHeight = (panel.myHeight + panel.myMaxScroll);
  if(panel.myScrollbarHeight < panel.myScrollbarMinHeight) {
    panel.myScrollbarHeight = panel.myScrollbarMinHeight;
  }

  var scrollPerc = -(panel.myScrollOffset) / (-panel.myMaxScroll);
  panel.myScrollbarY = panel.myYpos + (panel.myHeight - panel.myScrollbarHeight) * scrollPerc;
}

var renderScrollbar = function (panel, context, numVisibleElements) {
  if(!panel.myAllowScrolling) {
    return;
  }
  context.beginPath();
  context.lineWidth = "2";
  if(panel.myScrollbarClicked != -1) {
    context.fillStyle = "gray";
  } else {
    context.strokeStyle = "white";
  }
  if(overlapsScrollbar(panel) || panel.myScrollbarClicked != -1) {
    context.fillRect(panel.myScrollbarX - 1, panel.myScrollbarY - 1, (panel.myScrollbarWidth + 2) * panel.myElementScale, panel.myScrollbarHeight + 1);
  } else {
    context.rect(panel.myScrollbarX, panel.myScrollbarY, panel.myScrollbarWidth * panel.myElementScale, panel.myScrollbarHeight);
  }
  context.stroke();
}

var isElementInsidePanel = function (panel, curY) {
  if(curY + this.myScaledElementHeight + this.myScaledSpacingHeight < panel.myYpos) {
    return false;
  }
  if(curY >= panel.myYpos + panel.myHeight) {
    return false;
  }
  return true;
}

var drawName = function (panel, context, card) {
  context.font = panel.myScaledNameFontSize + "px Arial";

  var xPos = panel.myScaledNameXPos;
  var yPos = panel.myScaledNameYPos;

  if(card.class != "Neutral") {
    context.fillStyle = "black";
    var offset = panel.myCardNameOutlineOffset;
    context.fillText(card.myName, xPos - offset, yPos - offset);
    context.fillText(card.myName, xPos + offset, yPos - offset);
    context.fillText(card.myName, xPos + offset, yPos + offset);
    context.fillText(card.myName, xPos - offset, yPos + offset);
  }
  context.fillStyle = "white";
  context.fillText(card.myName, xPos, yPos);
}

var drawCard = function (panel, context, cardElement) {
  var imgOffCanvas = panel.myImageOffscreenCanvas;
  var xPos = panel.myWidth - panel.myScaledCardImageSize;
  var xPos = cardElement.myNumCards > 1 ? (xPos - panel.myScaledCardAmountWidth) : xPos;
  context.drawImage(imgOffCanvas, xPos, 0, imgOffCanvas.width, imgOffCanvas.height);
}

var drawBackground = function (panel, context, cardElement) {
  context.fillStyle = cardElement.myCard.myClassColor;
  var width = panel.myWidth - panel.myScaledManaIconStart - panel.myScaledBackgroundOffset;
  var width = cardElement.myNumCards > 1 ? (width - panel.myScaledCardAmountWidth) : width;
  context.fillRect(panel.myScaledManaIconStart, 0, width, panel.myScaledElementHeight);
}

var drawNumCards = function (panel, context, cardElement) {
  if(cardElement.myNumCards > 1) {
    var xPos = panel.myWidth - (panel.myScaledCardAmountWidth - panel.myScaledAmountTextXOffset);
    var yPos = panel.myScaledAmountPosY;
    context.font = panel.myAmountCardsFontSize + "px Arial";
    context.fillStyle = "yellow";
    context.fillText(cardElement.myNumCards, xPos, yPos);
  }
}

var drawManaCost = function (panel, context, card) {
  context.drawImage(panel.myManaCostImage, 0, 0, panel.myManaCostImage.width, panel.myManaCostImage.height, 
    panel.myScaledXOffset, panel.myScaledYOffset, panel.myScaledManaCostImageWidth, panel.myScaledManaCostImageHeight);

  var xPos = card.myCost < 10 ? panel.myScaledFontOneDigitPosX : panel.myScaledFontTwoDigitsPosX;
  var yPos = card.myCost < 10 ? panel.myScaledFontOneDigitPosY : panel.myScaledFontTwoDigitsPosY;
  context.font = panel.myManaCostFontSize + "px Arial";
  context.fillStyle = "black";
  var offset = panel.myManaCostOutlineOffset;
  context.fillText(card.myCost, xPos - offset, yPos - offset);
  context.fillText(card.myCost, xPos + offset, yPos - offset);
  context.fillText(card.myCost, xPos + offset, yPos + offset);
  context.fillText(card.myCost, xPos - offset, yPos + offset);
  context.fillStyle = "white";
  context.fillText(card.myCost, xPos, yPos);
}

var drawCardToOffScreen = function (panel, card) {
  var cardOffCtx = panel.myImageOffscreenContext;
  var cardOffCanvas = panel.myImageOffscreenCanvas;
  cardOffCtx.clearRect(0, 0, cardOffCanvas.width, cardOffCanvas.height);
  var height = panel.myScaledElementHeight;
  cardOffCtx.drawImage(card.myImage, panel.myPartialX, panel.myPartialY, panel.myPartialWidth, panel.myPartialHeight, 
                   0, 0, panel.myScaledCardImageSize, height);
  var gradient = cardOffCtx.createLinearGradient(40 * panel.myElementScale, 0, 0, 0);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
  cardOffCtx.globalCompositeOperation = "xor";
  cardOffCtx.fillStyle = gradient;
  height = Math.round(height)
  cardOffCtx.fillRect(0, 0, panel.myScaledCardImageSize, height);
};