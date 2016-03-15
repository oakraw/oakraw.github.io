var originalCanvas = document.getElementById('original_image');
var oriCtx = originalCanvas.getContext('2d');
var canvas = document.getElementById('image');
var cc = canvas.getContext('2d');
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
var converg = false;


$("document").ready(function(){
  $("#canvas").click(function(e){
     var parentOffset = $(this).parent().offset(); 
     //or $(this).offset(); if you really just want the current element's offset
     var relX = e.pageX - parentOffset.left;
     var relY = e.pageY - parentOffset.top;
     console.log(relX+" "+relY);
  });
});

var img = new Image();
img.onload = function() {
  cc.drawImage(img,0,0,625, 500);
};

var ctrack = new clm.tracker({stopOnConvergence : true});
ctrack.init(pModel);

 stats = new Stats();
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.top = '0px';
// document.getElementById('container').appendChild( stats.domElement );

var drawRequest;

function animateClean() {
  overlay.style.display = "block";
  originalCanvas.style.display = "block";
  ctrack.start(document.getElementById('image'));
  drawLoop();
}

function drawLoop() {
  drawRequest = requestAnimFrame(drawLoop);
  overlayCC.clearRect(0, 0, 720, 576);
  if (ctrack.getCurrentPosition()) {
    coor = ctrack.getCurrentPosition();
    ctrack.draw(overlay);
  }
}

// detect if tracker fails to find a face
document.addEventListener("clmtrackrNotFound", function(event) {
  ctrack.stop();
  alert("The tracking had problems with finding a face in this image. Try selecting the face in the image manually.")
}, false);

// detect if tracker loses tracking of face
document.addEventListener("clmtrackrLost", function(event) {
  ctrack.stop();
  alert("The tracking had problems converging on a face in this image. Try selecting the face in the image manually.")
}, false);


document.addEventListener("clmtrackrConverged", function(event) {
					cancelRequestAnimFrame(drawRequest);
          console.log("Converged"+converg);
          if(!converg) {
            overlay.style.display = "none";
            Caman('#image', function() {
              this.reloadCanvasData();
              this.exposure(-5);
              this.contrast(5);
              this.saturation(15);
              this.render(function() {
                maskMapping(0,14,33,7);
                eyeMapping(23, 25, "oil3_left_eye.png");
                eyeMapping(30, 28, "oil3_right_eye.png");
              });
            });

            Caman('#original_image', function() {
              this.reloadCanvasData();
              this.exposure(15);
              this.contrast(3);
              this.saturation(-5); 
              this.vibrance(10); 
              this.render();  
            });

            
          }
          converg = true;
				}, false);

// update stats on iteration
document.addEventListener("clmtrackrIteration", function(event) {
  stats.update();
}, false);

function maskMapping(positionA, positionB, positionC, positionD){
  console.log("maskMapping");
  var img = new Image();
  img.onload = function(){
    var py = new Pythagoras(coor[positionA], coor[positionB]);
    var width = py.getDistanceBetween2Coor();
    var startHeightPoint = py.getCenterPointBetween2Coor();

    var pyh = new Pythagoras(coor[positionC], coor[positionD]);
    var height = pyh.getDistanceBetween2Coor();

    cc.setTransform(1, 0, 0, 1, 0, 0);
    cc.translate(coor[positionA][0], coor[positionA][1]);
    cc.rotate(py.getDegreeFromX());
    cc.translate(-coor[positionA][0], -coor[positionA][1]);
    cc.drawImage(img, coor[positionA][0], coor[positionA][1], width , height);

  };

  img.src = "oil1.png";
}

function eyeMapping(positionA, positionB, mask_src){
  var img = new Image();
  img.onload = function(){
    var py = new Pythagoras(coor[positionA], coor[positionB]);
    var width = py.getDistanceBetween2Coor();
    
    cc.setTransform(1, 0, 0, 1, 0, 0);
    cc.translate(coor[positionA][0], coor[positionA][1]);
    cc.rotate(py.getDegreeFromX());
    cc.translate(-coor[positionA][0], -coor[positionA][1]);
    cc.drawImage(img, coor[positionA][0], coor[positionA][1], width , width);

  };

  img.src = mask_src;
}


// function to start showing images
function loadImage() {
  if (fileList.indexOf(fileIndex) < 0) {
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        // check if positions already exist in storage

        // Render thumbnail.
        
        var cc = canvas.getContext('2d');
        var img = new Image();
        img.onload = function() {
          converg = false;

          if (img.height > 500 || img.width > 700) {
            var rel = img.height/img.width;
            var neww = 700;
            var newh = neww*rel;
            if (newh > 500) {
              newh = 500;
              neww = newh/rel;
            }
            canvas.setAttribute('width', neww);
            canvas.setAttribute('height', newh);

            overlay.setAttribute('width', neww);
            overlay.setAttribute('height', newh);

            original_image.setAttribute('width', neww);
            original_image.setAttribute('height', newh);

            oriCtx.drawImage(img,0,0,neww, newh);
            cc.drawImage(img,0,0,neww, newh);
          } else {
            canvas.setAttribute('width', img.width);
            canvas.setAttribute('height', img.height);

            overlay.setAttribute('width', img.width);
            overlay.setAttribute('height', img.height);

            original_image.setAttribute('width', img.width);
            original_image.setAttribute('height', img.height);

            oriCtx.drawImage(img,0,0,img.width, img.height);
            cc.drawImage(img,0,0,img.width, img.height);
          }

          animateClean();
        }
        img.src = e.target.result;
      };
    })(fileList[fileIndex]);
    reader.readAsDataURL(fileList[fileIndex]);
    overlayCC.clearRect(0, 0, 720, 576);
    ctrack.reset();
  }

}

// set up file selector and variables to hold selections
var fileList, fileIndex;
if (window.File && window.FileReader && window.FileList) {
  function handleFileSelect(evt) {
    var files = evt.target.files;
    fileList = [];
    for (var i = 0;i < files.length;i++) {
      if (!files[i].type.match('image.*')) {
        continue;
      }
      fileList.push(files[i]);
    }
    if (files.length > 0) {
      fileIndex = 0;
    }

    loadImage();
  }
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
} else {
  $('#files').addClass("hide");
  $('#loadimagetext').addClass("hide");
}


