Card = function (cardData) {
  this.myImage = new Image(286, 395);
  this.myImage.src = "./img/cards/" + cardData.name + ".png";
  this.myCardClass = cardData.class;
  this.myClassColor = setClassColorRGBA(this.myCardClass);
  this.myName = cardData.name;
  this.myCost = cardData.cost;
  this.myType = cardData.type;
  this.myRarity = cardData.rarity;
  this.myLastIndex = -1;
};

var setClassColorRGBA = function (cardClass) {
  var alpha = 0.8;
  var neutral = "#171717"
  switch(cardClass) {
    case "Shaman": return "rgba(11, 71, 212, " + alpha + ")";
    case "Druid": return "rgba(140, 99, 41, " + alpha + ")";
    case "Neutral": return neutral;
    case "Warlock": return "rgba(131, 74, 168, " + alpha + ")";
    case "Paladin": return "rgba(161, 133, 19, " + alpha + ")";
    case "Warrior": return "rgba(148, 69, 44, " + alpha + ")";
    case "Mage": return "rgba(72, 174, 247, " + alpha + ")";
    case "Hunter": return "rgba(76, 135, 53, " + alpha + ")";
    case "Rogue": return "rgba(74, 76, 74, " + alpha + ")";
    case "Priest": return "rgba(199, 201, 199, " + alpha + ")";

    default: return neutral;
  } 
}

var setClassColor = function (cardClass) {
  var neutral = "#171717"
  switch(cardClass) {
    case "Shaman": return "#0B47D4";
    case "Druid": return "#8C6329";
    case "Neutral": return neutral;
    case "Warlock": return "#834AA8";
    case "Paladin": return "#A18513";
    case "Warrior": return "#94452C";
    case "Mage": return "#48AEF7";
    case "Hunter": return "#4C8735";
    case "Rogue": return "#2C2E2C";
    case "Priest": return "#C7C9C7";

    default: return neutral;
  } 
}