const express = require('express')
const app = express()
var ExpressPeerServer = require('peer').ExpressPeerServer;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const friends = [];

app.get('/friends', (req, res) => {
  res.send(friends);
});

app.get('/:room', (req, res) => {
    res.render('room', {
        roomId: req.params.room
    })
});

const server = app.listen(process.env.PORT || 4050);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/myapp"
});

peerServer.on('connection', ({ id }) => {
  friends.push(id);
});

app.use('/peerjs', peerServer);
