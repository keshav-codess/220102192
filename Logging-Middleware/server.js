import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const TEST_SERVER_URL = "http://20.244.56.144/evaluation-service/logs";
const TOKEN = "your-JWT-token-here"; // keep it safe

app.post("/log", async (req, res) => {
  try {
    const response = await axios.post(TEST_SERVER_URL, req.body, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Failed to send log:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to send log" });
  }
});

app.listen(4000, () => {
  console.log("Logging proxy running at http://localhost:4000/log");
});
