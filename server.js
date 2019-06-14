const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
users = [];
connections = [];
server.listen(process.env.PORT || 3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// Connect
io.sockets.on("connection", function (socket) {
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);
    console.log('Socket ID: ', socket.id);
    
    // Disconnect
    socket.on("disconnect", function (data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disonnected: %s sockets connected", connections.length);
        console.log('Socket ID: ', socket.id);
        // console.log(socket.username.value + ' has left the game',);
    });

    // Send message
    socket.on("send message", function (data) {
        console.log(data);
        io.sockets.emit("new message", { msg: data, user: socket.username })
    });

    // New user
    socket.on("new user", function (data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    // Update usernames
    function updateUsernames(){
        io.sockets.emit("get users", users);
    };
});
// const client = require('socket.io').listen(4000).sockets;
// const mongo = require('mongodb').MongoClient;

// // Connect to mongo
// mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
//     if(err){
//         throw err;
//     }

//     console.log('MongoDB connected...');

//     // Connect to Socket.io
//     client.on('connection', function(socket){
//         let chat = db.collection('chats');

//         // Create function to send status
//         sendStatus = function(s){
//             socket.emit('status', s);
//         }

//         // Get chats from mongo collection
//         chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
//             if(err){
//                 throw err;
//             }

//             // Emit the messages
//             socket.emit('output', res);
//         });

//         // Handle input events
//         socket.on('input', function(data){
//             let name = data.name;
//             let message = data.message;

//             // Check for name and message
//             if(name == '' || message == ''){
//                 // Send error status
//                 sendStatus('Please enter a name and message');
//             } else {
//                 // Insert message
//                 chat.insert({name: name, message: message}, function(){
//                     client.emit('output', [data]);

//                     // Send status object
//                     sendStatus({
//                         message: 'Message sent',
//                         clear: true
//                     });
//                 });
//             }
//         });

//         // Handle clear
//         socket.on('clear', function(data){
//             // Remove all chats from collection
//             chat.remove({}, function(){
//                 // Emit cleared
//                 socket.emit('cleared');
//             });
//         });
//     });
// });