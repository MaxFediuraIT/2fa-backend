import { app } from "../app.js";
import { connectDB } from "./db.js";
import { createServer } from "http";

const port = process.env.PORT || 3000;

const server = createServer(app);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });


