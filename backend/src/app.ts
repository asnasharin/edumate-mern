import express, { Express } from "express";
import userRouter from "./routes/userRoute"
import courseRouter from "./routes/courseRoute"
import tutorRouter from "./routes/tutorRoute"
import adminRouter from "./routes/adminRoute"
import cookieParser from "cookie-parser"
import morgan from "morgan"

const app: Express = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use("/api", userRouter, courseRouter, tutorRouter, adminRouter)

export default app;