import express, { Express } from "express";
import userRouter from "./routes/userRoute"

const app: Express = express()

app.use("/api", userRouter)

export default app;