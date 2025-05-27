import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { dirname } from "dirname-filename-esm";

// import usersRouter from "./routers/users.js";
import registerRouter from "./routers/register.js";

// app
const app = express();

// view engine setup
app.set("views", path.join(dirname(import.meta), "views"));
app.set("view engine", "ejs");

// plugins
app.use(logger(process.env.NODE_ENV === "production" ? "common" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(dirname(import.meta), "../", "public")));

// routers
app.get("/api", (req, res) => {
  res.render("index", { title: "Daemin Express", name: "yimnayeon" });
});
app.use("/api/users", usersRouter);
app.use("/api/register", registerRouter);

export default app;

// api용 구조 만들어둔거 ()
// try {

// } catch (err) {
//   const errMsg = `${err.message} 암튼 이래서 에러임.`;
//   res.status(500).json({ message: " 에러임 ", error: errMsg });
// }
