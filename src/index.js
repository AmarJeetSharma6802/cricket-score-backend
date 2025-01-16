import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import connectDb from './Db/Dbconnet.score.js';
import {Score} from './model/score.model.js';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
dotenv.config();
app.use(express.json()); 
app.use(cors({
  origin: ["http://localhost:5173","https://cricket-score-backend-lac.vercel.app"], 
  credentials: true, 
}));
connectDb(); 
 
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"], 
    credentials: true, 
  },
  transports: ['polling'],
}); 

app.post("/updateScore", async (req, res) => {
  const { matchId, over, runs, batsman,batsmanScore,NonstickerBatsman,NonstickerBatsmanScore, bowler, extras,wicket,firstBall,SecondBall,ThirdBall,fourthBall,fifthBall,sixthBall } = req.body;
  console.log("Request received:", req.body);

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
      balls: [firstBall, SecondBall, ThirdBall, fourthBall, fifthBall, sixthBall],

    });      

    res.status(201).json({ message: "Score updated successfully",newScore });
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}); 
  
app.get("/getScores",async(req,res)=>{
  const scores = await Score.find()
  // .populate("matchId")
  // .populate("batsman")
  // .populate("bowler")
  // .populate("extras")
  // .populate("wicket");

  res.status(201).json(scores);

})
io.on("connection", (socket)=>{
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  })

})

app.get("/getScores/:id",async(req,res)=>{
  const {id} = req.params
  const Getscores = await Score.find({matchId:id})
  res.status(201).json(Getscores);
}) 
   

app.delete("/getScoresDelete/:id",async(req,res)=>{
  const {id} = req.params
  const deleteScore = await Score.findOneAndDelete({matchId:id})
  console.log(deleteScore)
  if (!deleteScore) {
    return res.status(404).json({ message: "Score not found" });
  }
  res.status(200).json({ message: "Score deleted successfully" });

})

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
// server.listen(3000, () => {
//   console.log("App is listening on port 3000");
// });
  
export  {app}    

export default (req, res) => {
  server(req, res);  // Vercel handles requests this way for serverless functions
};