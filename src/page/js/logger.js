Logger = function () {
  this.myXPos = 50;
  this.myYPos = 50;
  this.myMessage = "";
  this.myFont = "30px Arial";
  this.myFillStyle = "white";
};

Logger.prototype.clearLog = function() {
  this.myMessage = "";
}

Logger.prototype.logToScreen = function (message) {
  this.myMessage = message;
}

Logger.prototype.draw = function (context) {
  context.font = this.myFont;
  context.fillStyle = this.myFillStyle;
  context.fillText(this.myMessage, this.myXPos, this.myYPos);
}