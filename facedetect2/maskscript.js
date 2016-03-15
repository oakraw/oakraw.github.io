var faceTiltDegree;
var faceWidth;

function maskMapping(positionA, positionB, positionC, positionD, callback){
  console.log("maskMapping");
  var img = new Image();
  img.onload = function(){
    var py = new Pythagoras(coor[positionA], coor[positionB]);
    faceWidth = py.getDistanceBetween2Coor();
    var startHeightPoint = py.getCenterPointBetween2Coor();

    var pyh = new Pythagoras(coor[positionC], coor[positionD]);
    var height = pyh.getDistanceBetween2Coor();
    faceTiltDegree = py.getDegreeFromX();
    drawRectCanvas(img, coor[positionA][0], coor[positionA][1], faceWidth , height, py.getDegreeFromX());
    if(callback){
      callback();
    }
  };

  img.src = "oil1.png";
}

function eyeMapping(positionA, positionB, mask_src){
  var img = new Image();
  img.onload = function(){
    var py = new Pythagoras(coor[positionA], coor[positionB]);
    var width = py.getDistanceBetween2Coor();

    drawRectCanvas(img, coor[positionA][0], coor[positionA][1], width , width, py.getDegreeFromX());
  };

  img.src = mask_src;
}

function noseMapping(positionA, positionB, widthFaceRatio, mask_src){
  var img = new Image();
  img.onload = function(){
    var width = widthFaceRatio * faceWidth;
    var widthDestinationPoint = [ coor[positionA][0] + width, coor[positionA][1] ];
    var py = new Pythagoras(coor[positionA], widthDestinationPoint);
    var height = Pythagoras.getDistanceBetween2Coor(coor[positionA], coor[positionB]);
    console.log("Face tile degree: "+faceTiltDegree);
    drawRectCanvas(img, coor[positionA][0] - width/2, coor[positionA][1], width , height, faceTiltDegree);
  };
  img.src = mask_src;
}

function drawRectCanvas(img, x, y, width, height, rotate){
  cc.setTransform(1, 0, 0, 1, 0, 0);
  cc.translate(x, y);
  cc.rotate(rotate);
  cc.translate(-x, -y);
  cc.drawImage(img, x, y, width , height);
}
