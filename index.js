const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))

clients = {};
io.sockets.on('connection', function (socket) {
    socket.on('username', function (username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat  </i>');
    });

    socket.on('disconnect', function (username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat  </i>');
    });

    socket.on('chat_message', function (message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

    //Someone is typing
    socket.on("typing", data => {
        socket.broadcast.emit("notifyTyping", { user: data.user, message: data.message });
    });

    //when soemone stops typing
    socket.on("stopTyping", () => {
        socket.broadcast.emit("notifyStopTyping");
    });

    clients.push(socket.username);
    socket.on('add-user', function (data) {
        clients[data.username] = {
            "socket": socket.username
        };
    });

    socket.on('private-message', function (data) {
        console.log("Sending: " + data.content + " to " + data.username);
        if (clients[data.username]) {
            io.sockets.connected[clients[data.username].socket].emit("add-message", data);
        } else {
            console.log("User does not exist: " + data.username);
        }
    });

    //Removing the socket on disconnect
    socket.on('disconnect', function () {
        for (var name in clients) {
            if (clients[name].socket === socket.username) {
                delete clients[name];
                break;
            }
        }
    })
});

// app.listen(process.env.PORT);
http.listen(3000, function () {
    console.log('listening on *: 3000');
});