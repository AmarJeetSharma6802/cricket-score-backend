import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./Db/Dbconnet.score.js";  // Replace with your actual DB connection
import { Score } from "./model/score.model.js";   // Adjust the path if necessary
import http from "http";
import { Server } from "socket.io";

const app = express();
dotenv.config();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",  // Change this to your frontend URL
    credentials: true,
  })
);
connectDb();  // Ensure the DB connection works

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // Change to the URL where your app is hosted
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io",  // Make sure the path is correct
  transports: ["websocket", "polling"],  // Allow both websocket and polling
});

app.post("/updateScore", async (req, res) => {
  const {
    matchId,
    over,
    runs,
    batsman,
    batsmanScore,
    NonstickerBatsman,
    NonstickerBatsmanScore,
    bowler,
    extras,
    wicket,
    firstBall,
    SecondBall,
    ThirdBall,
    fourthBall,
    fifthBall,
    sixthBall,
  } = req.body;

  try {
    const newScore = new Score({
      matchId,
      over,
      runs,
      batsman,
      batsmanScore,
      NonstickerBatsman,
      NonstickerBatsmanScore,
      bowler,
      extras,
      wicket,
      firstBall,
      SecondBall,
      ThirdBall,
      fourthBall,
      fifthBall,
      sixthBall,
    });
    await newScore.save();

    io.emit("updateScore", {
      matchId,
      over,
      runs,
      batsman,
      batsmanScore,
      NonstickerBatsman,
      NonstickerBatsmanScore,
      bowler,
      extras,
      wicket,
      balls: [
        firstBall,
        SecondBall,
        ThirdBall,
        fourthBall,
        fifthBall,
        sixthBall,
      ],
    });

    res.status(201).json({ message: "Score updated successfully", newScore });
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getScores", async (req, res) => {
  try {
    const scores = await Score.find();
    res.status(201).json(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getScores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const Getscores = await Score.find({ matchId: id });
    res.status(201).json(Getscores);
  } catch (error) {
    console.error("Error fetching score by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/getScoresDelete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteScore = await Score.findOneAndDelete({ matchId: id });
    if (!deleteScore) {
      return res.status(404).json({ message: "Score not found" });
    }
    res.status(200).json({ message: "Score deleted successfully" });
  } catch (error) {
    console.error("Error deleting score:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("App is listening on port 3000");
});
