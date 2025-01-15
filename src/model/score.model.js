import mongoose from "mongoose";

const ScoreSchema  = mongoose.Schema({
   matchId :String,
   over:Number,
   runs:Number,
   extras: Number,
   batsman: String,
   batsmanScore:String,
   NonstickerBatsman:String,
   NonstickerBatsmanScore:String,
   bowler: String,
   wicket:String,
   firstBall:String,
   SecondBall:String,
   ThirdBall:String,
   fourthBall:String,
   fifthBall:String,
   sixthBall:String,
})

export const Score = mongoose.model("Score",ScoreSchema)