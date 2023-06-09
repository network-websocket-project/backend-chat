const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notiRoutes = require("./routes/notiRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require('path');

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type,Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/noti", notiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 30555;

const server = app.listen(PORT, console.log(`server started on port ${PORT}`));

// const io = require("./socket").init(server);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    // credentials: true,
  },
});
let users = {};
io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected", users);
    // console.log("Server respond handshaking");
    for (const [key, value] of Object.entries(users)) {
      // console.log(key, value)
      socket.in(value._id).emit("online", userData);
    }
    users[socket.id] = userData;
    // console.log("alluser:", users);
  });

  socket.on("disconnect", () => {
    for (const [key, value] of Object.entries(users)) {
      if (key != socket.id) socket.in(value._id).emit("offline", users[socket.id]);
    }
    delete users[socket.id];
  })

  socket.on("custom disconnect", () => {
    for (const [key, value] of Object.entries(users)) {
      if (key != socket.id) socket.in(value._id).emit("offline", users[socket.id]);
    }
    delete users[socket.id];
  })

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("leave chat", (room) => {
    socket.leave(room);
    console.log("User Leaved Room: " + room);
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    console.log(newMessageReceived, 'dasdasdsada');
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
    // socket.leave(userData._id);
  });
});
