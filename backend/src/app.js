import express from "express";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
import userRouter from "./routes/user.routes.js";
import assetRouter from "./routes/asset.routes.js";
// import fileRouter from "./routes/file.routes.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/assets", assetRouter);
// app.use("/api/v1/files", fileRouter);
export default app;
