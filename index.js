const app = require('express')();
var express = require('express');

const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs=require('fs');
const path=require('path');

const port = process.env.PORT || 3000;
const imageToBase64 = require('image-to-base64');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname));


io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
  socket.on('upload-image', function (message) {

    var writer = fs.createWriteStream(path.resolve(__dirname, './tmp/' + message.name), {
    encoding: 'base64'
            });
    
    
    writer.write(message.data);
    writer.end();
    
    writer.on('finish', function () {
    
        io.emit('image-uploaded', {
    name: '/tmp/' + message.name
                });
    
            });
});
})

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});