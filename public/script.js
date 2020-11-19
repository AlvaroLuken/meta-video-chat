const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');

ethereum.enable().then(() => {
  const id = ethereum.selectedAddress + Date.now();

  const peer = new Peer(id, {
    host: window.location.hostname,
    port: window.location.port,
    path: '/peerjs/myapp'
  });

  peer.on('connection', function(conn) {
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    getUserMedia({video: true, audio: true}, function(stream) {
      const call = peer.call(conn.peer, stream);
      call.on('stream', function(stream) {
        const video = document.createElement("video");
        addVideoStream(video, stream)
      });
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
  });

  peer.on('call', function(call) {
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    getUserMedia({video: true, audio: true}, function(stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      call.on('stream', function(stream) {
        const video = document.createElement("video");
        addVideoStream(video, stream)
      });
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
  });

  peer.on('open', function(){
    axios.get("/friends").then((friends) => {
      friends.forEach((friend) => {
        if(friend !== id) {
          peer.connect(friend);
        }
      });
    });
  });
});

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video);
}
