const express = require("express");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
var cors = require("cors");
var path = require("path");

const app = express();

const connectDb = require("./config/db");

connectDb();

app.use(express.json());

app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/message", messageRoute);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log("server started in the port 5000");
});

// --------------------------deployment------------------------------

app.use(express.static(path.join(__dirname, "/frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build", "index.html"));
});
// --------------------------deployment------------------------------

const io = require("socket.io")(server, {
  pingTimeout: 60000, // after 6 s it will be disconnected when there is no action
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newmessageReceived) => {
    let chat = newmessageReceived.chat;

    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id !== newmessageReceived.sender._id) {
        socket.in(user._id).emit("new message", newmessageReceived);
      }
      return;
    });
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  });
});
