
var app = require("../app");
var http = require("http");
var server = http.createServer(app);

const socketIo = require("socket.io");
const io = socketIo(server);


let interval;

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on('joinRoom',({room})=>{
        socket.join(room);
        io.to('22').emit('render',"finally")
        io.to('33').emit('render',"Wrong room")
    })
    socket.on('move',({data})=>{
        io.to('22').emit('moved',data)
        console.log(data)
    })
    

});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};





server.listen(9000);


