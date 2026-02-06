import { connectDB } from "./db/index.js";
import app from "./app.js";

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(
      `the server is running at port https://localhost:${process.env.PORT}`
    );
  });
});
