import express, { Express } from "express";
import userRouter from "./routes/userRoute"
import courseRouter from "./routes/courseRoute"
import cookieParser from "cookie-parser"
import morgan from "morgan"

const app: Express = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use("/api", userRouter, courseRouter)

export default app;