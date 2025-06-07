import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { dirname } from "dirname-filename-esm";

import usersRouter from "./routers/users.js";
import registerRouter from "./routers/register.js";
import loginRouter from "./routers/login.js";
import postRouter from "./routers/post.js";
import likeRouter from "./routers/like.js"; // 좋아요 라우터 추가
import badgeRouter from "./routers/badge.js";

// app
const app = express();
const __dirname = dirname(import.meta);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// plugins
app.use(logger(process.env.NODE_ENV === "production" ? "common" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../", "public")));

// routers
app.get("/api", (req, res) => {
  res.render("index", { title: "CaFverse API Server", name: "cafverse" });
});
app.use("/api/users", usersRouter);
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/posts", postRouter);
app.use("/api", likeRouter); // 좋아요 라우터 추가
app.use("/api/badges", badgeRouter);
export default app;
