import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from './routes/routes.js'; 


dotenv.config(); 

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.use("/user/v1" , userRoutes)


const DATABASE_URL = process.env.Data_base;

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((error) => console.error("❌ MongoDB connection error:", error));


app.get("/", (req, res) => {
  res.send("🚀 Server is running and MongoDB is connected!");
});


app.listen(port, () => {
  console.log(`🌐 Server running at: http://localhost:${port}`);
});
