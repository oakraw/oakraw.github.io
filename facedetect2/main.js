  var video = document.querySelector('video');
  var canvas = document.querySelector('canvas');
  var image = document.querySelector('img');
  var scale = 1;
  var ctx;
  var localStream;

  window.onload = function() {
    var fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(e) {
      // Put the rest of the demo code here.
      var file = fileInput.files[0];
      console.log(file);
      console.log(file.width);
      console.log(file.height);
      var imageType = /image.*/;

      if (file != null) {
        if (file.type.match(imageType)) {
          var reader = new FileReader();

          reader.onload = function(e) {
            ctx = canvas.getContext('2d');
            image.src = reader.result;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = image.width * scale;
            canvas.height = image.height * scale;
            console.log(image.width + " " + image.height);
            canvas.style.display = "block";
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            canvas.onload = faceRecognize(ctx);
          }
          reader.readAsDataURL(file);
        }
      }
    });
  }

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  window.URL = window.URL || window.webkitURL;

  function snapshot() {

    var ctx = canvas.getContext('2d');

    var cw = video.clientWidth;
    var ch = video.clientHeight;

    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    video.style.display = 'none';
    image.style.display = 'none';
    canvas.style.display = 'block';
    if (localStream != null) {
      var track = localStream.getTracks()[0]; // if only one media track
      track.stop();
    }

    //tracking.Canvas.loadImage(canvas, video, 0, 0, canvas.width, canvas.height);
    console.log("width:"+image.width+" height:"+image.height);
    image.src = canvas.toDataURL();
    image.height = ch;
    image.width = cw;
    image.onload = faceRecognize(ctx);
  }

  function faceRecognize(ctx) {
    var ctracker = new clm.tracker();
    ctracker.init(pModel);
    var positions = ctracker.getCurrentPosition();
    ctracker.start(canvas);
    console.log(positions);
  }

  function openCamera() {
    video.style.display = 'block';
    canvas.style.display = 'none';

    video.addEventListener('click', snapshot, false);

    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        video: true
      }, function(stream) {
        localStream = stream;
        video.src = window.URL.createObjectURL(stream);
        video.onloadedmetadata = function(e) {
          video.play();
        };
      }, function(err) {
        console.log("The following error occured: " + err.name);
      });
    } else {
      console.log("getUserMedia not supported");
    }
  }

  function chooseFile() {
    video.style.display = 'none';
    image.style.display = 'none';
    canvas.style.display = 'none';
    //image.width = 0;
    //image.height = 0;
    $("#fileInput").click();
  }
