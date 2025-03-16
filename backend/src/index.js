import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config({
  path: "./.env",
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server running on port:", process.env.PORT);
    console.log("Working Fine");
  });
    console.log("Working Fine");
});
