import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// auth routes
//
app.get("/test", (req, res) => {
  console.log("test done");
  res.send("test done");
});
app.post("/login", (req, res) => {
  res.send("working");
  console.log(req);
});
app.post("/signup", (req, res) => {
  console.log(req.body);
  res.send("signup working");
});

export default app;
