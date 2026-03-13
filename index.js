import express from "express";
import cors from "cors";
const app = express();
const port = 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Coffee Server");
});

app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`);
});
