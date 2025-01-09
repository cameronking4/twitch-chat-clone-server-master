import { Profanity } from "@2toad/profanity";
import * as dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import ChatBot from "./ChatBot";
import { generateMessage, generateUser } from "./helpers";
import { User } from "./models";
import cors from "express";

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });
const port = process.env.PORT || 4000;
const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
});

const users = new Map<string, User>();
const profanity = new Profanity({
  grawlixChar: "*",
  wholeWord: true,
  grawlix: "****",
});

io.on("connection", (socket) => {
  const id = socket.id;
  console.log("a user connected: ", id);

  const user = users.get(id) ?? generateUser();
  users.set(id, user);

  socket.on("disconnect", () => {
    console.log("user disconnected: ", id);
    users.delete(id);
  });

  socket.on("update-context", (context: string) => {
    console.log(`Updating context to: ${context}`);
    chatBot.setContext(context);
  });

  socket.on("message", (message: string) => {
    console.log(`Received message ${message} from ${user.username}`);
    const filteredMessage = profanity.censor(message);
    io.emit(
      "new-message",
      generateMessage({ 
        content: filteredMessage, 
        author: user,
        context: chatBot.getCurrentContext() 
      })
    );
  });
});

const chatBot = new ChatBot(io);
chatBot.start();

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
