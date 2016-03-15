class Pythagoras {
  constructor(coor1, coor2) {
    this.coor1 = coor1;
    this.coor2 = coor2;
  }

  getDegreeFromX() {
    var isTiltLeft = this.coor2[1] < this.coor1[1];
    var a = (isTiltLeft) ? this.coor2[1] - this.coor1[1] : this.coor1[1] - this.coor2[1];
    var b = this.coor2[0] - this.coor1[0];
    console.log(a);
    console.log(isTiltLeft);
    console.log(Math.atan2(a, b));

    return ((isTiltLeft) ? 1 : -1) * Math.atan2(a, b);
  }

  getDistanceBetween2Coor() {
    var x = this.coor2[1] - this.coor1[1];
    var y = this.coor2[0] - this.coor1[0];
    return Math.sqrt(x * x + y * y);
  }

  static getDistanceBetween2Coor(a, b) {
    var x = a[1] - b[1];
    var y = a[0] - b[0];
    return Math.sqrt(x * x + y * y);
  }

  getCenterPointBetween2Coor() {
    var a = Math.round((this.coor2[1] + this.coor1[1]) / 2);
    var b = Math.round((this.coor2[0] + this.coor1[0]) / 2);
    return [a, b];
  }

}

function drawImageToCanvasWrapper(img, w, h, rotate){
  var width = (rotate) ? h : w;
  var height = (rotate) ? w : h;
  drawImageToCanvas(img, canvas, width, height, rotate);
  drawImageToCanvas(img, overlay, width, height, rotate);
  drawImageToCanvas(img, originalCanvas, width, height, rotate);
}

function drawImageToCanvas(img, targetCanvas, w, h, rotate){
  targetCanvas.width = w;
  targetCanvas.height = h;
  var context = targetCanvas.getContext("2d");

  if(rotate){
    if(rotate == "Left"){
      context.translate(targetCanvas.width/2,targetCanvas.height/2);
      context.rotate(Math.PI/2);
      context.translate(-targetCanvas.height/2,-targetCanvas.width/2);
    }else{
      context.translate(targetCanvas.width/2,targetCanvas.height/2);
      context.rotate(-Math.PI/2);
      context.translate(-targetCanvas.height/2,-targetCanvas.width/2);
    }
    context.drawImage(img, 0, 0, h, w);
  }else{
    context.drawImage(img, 0, 0, w, h);
  }
}
