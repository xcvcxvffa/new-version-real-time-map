const express = require("express");
const app = express();

const http = require("http");
const path = require("path");

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  console.log("connected");
  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });
  socket.on("disconnection", function () {
    io.emit("user-disconnection", socket.id);
  });
});

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(1011, () => {
  console.log("server is running...");
});
