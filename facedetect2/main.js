var originalCanvas = document.getElementById('original_image');
var oriCtx = originalCanvas.getContext('2d');
var canvas = document.getElementById('image');
var cc = canvas.getContext('2d');
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
var converg = false;


$("document").ready(function() {
  $("#canvas").click(function(e) {
    var parentOffset = $(this).parent().offset();
    //or $(this).offset(); if you really just want the current element's offset
    var relX = e.pageX - parentOffset.left;
    var relY = e.pageY - parentOffset.top;
    console.log(relX + " " + relY);
  });
});

var img = new Image();
img.onload = function() {
  cc.drawImage(img, 0, 0, 625, 500);
};

var ctrack = new clm.tracker({
  stopOnConvergence: true
});
ctrack.init(pModel);


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
  console.log("Converged" + converg);
  if (!converg) {
    overlay.style.display = "none";
    Caman('#image', function() {
      this.reloadCanvasData();
      this.exposure(-5);
      this.contrast(5);
      this.saturation(15);
      this.render(function() {
        maskMapping(0, 14, 33, 7, function(){
          noseMapping(33, 62, 0.02, "oil3_left_eye.png");
          noseMapping(53, 7, 0.3, "oil3_left_eye.png");
          eyeMapping(23, 25, "oil3_left_eye.png");
          eyeMapping(30, 28, "oil3_right_eye.png");
          setTimeout(function(){
            // $('img[alt="before"]').attr("src", originalCanvas.toDataURL("image/jpeg", 1.0));
            // $('img[alt="after"]').attr("src", canvas.toDataURL("image/jpeg", 1.0));
            //
            // $('img[alt="before"]').attr("width", originalCanvas.width);
            // $('img[alt="before"]').attr("height", originalCanvas.height);
            //
            // $('img[alt="after"]').attr("width", canvas.width);
            // $('img[alt="after"]').attr("height", canvas.height);
            //
            // $("#previewContainer").attr("width", canvas.width);
            // $("#previewContainer").attr("height", canvas.height);
            var beforeAfterPanel =
              '<div><img alt="before" src="'+originalCanvas.toDataURL("image/jpeg", 1.0)+'" width="'+originalCanvas.width+'" height="'+originalCanvas.height+'"/></div>'+
              '<div><img alt="before" src="'+canvas.toDataURL("image/jpeg", 1.0)+'" width="'+canvas.width+'" height="'+canvas.height+'"/></div>';

            console.log(beforeAfterPanel);
            $("#previewContainer").append(beforeAfterPanel);

            $('#previewContainer').beforeAfter({
              showFullLinks: false
            });

            $("#previewContainer").css("display","block");

            // $("#before").attr("crossOrigin", 'anonymous');
            //$("#after").attr("src", canvas.toDataURL());
            //$("#after").attr("crossOrigin", 'anonymous');
          }, 1000);
        });


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
  //stats.update();
}, false);


// function to start showing images
function loadImageToCanvas() {
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
            var rel = img.height / img.width;
            var neww = 700;
            var newh = neww * rel;
            if (newh > 500) {
              newh = 500;
              neww = newh / rel;
            }
            drawImageToCanvasWrapper(img, neww, newh, rotateImage);
          } else {
            drawImageToCanvasWrapper(img, img.width, img.height, rotateImage);
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
var fileList, fileIndex, rotateImage;
if (window.File && window.FileReader && window.FileList) {
  function handleFileSelect(evt) {
    $("#previewContainer").html("");
    rotateImage = null;

    files = evt.target.files;
    fileList = [];
    for (var i = 0; i < files.length; i++) {
      if (!files[i].type.match('image.*')) {
        continue;
      }
      fileList.push(files[i]);
    }
    if (files.length > 0) {
      fileIndex = 0;
    }

    loadImage.parseMetaData(
      files[0],
      function(data) {
        if (!data.imageHead) {
            return;
        }
        if(data.exif){
          console.log(data.exif);
          var orientation = data.exif.get('Orientation');
          if(orientation == 6){
            rotateImage = "Left";
          }else if (orientation == 8) {
            rotateImage = "Right";
          }
        }
      }, {
        disableImageHead: false
      }
    );

    loadImageToCanvas();
  }
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
} else {
  $('#files').addClass("hide");
  $('#loadimagetext').addClass("hide");
}
