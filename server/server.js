import express from "express";
import cors from "cors";
import axios from "axios";

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/api/get_upload_url", async (req, res, next) => {
  try {
    const API_KEY = "2d4d6aa22dcd4f39193614689a9b41eac89fd4e7bf42a007ffa4b0b01655f9075855336acaf8af5d5188b7d707641cf7d8dfa19557719645d9dc647491bf08bd";
    const url = "https://api.tor.app/developer/transcription/local_file/get_upload_url";

    const response = await axios.post(
      url,
      req.body, // Pass the request body directly
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          Accept: "application/json",
        },
      }
    );
    res.json(response.data); // Send API response to the client
  } catch (error) {
    next(error); // Pass errors to the error handling middleware
  }
});

app.post("/api/initiate_transcription", async (req, res, next) => {
  try {
    const API_KEY = "2d4d6aa22dcd4f39193614689a9b41eac89fd4e7bf42a007ffa4b0b01655f9075855336acaf8af5d5188b7d707641cf7d8dfa19557719645d9dc647491bf08bd";
    const url = "https://api.tor.app/developer/transcription/local_file/initiate_transcription";

    const response = await axios.post(
      url,
      req.body, // Pass the request body directly
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          Accept: "application/json",
        },
      }
    );
    res.json(response.data); // Send API response to the client
  } catch (error) {
    next(error); // Pass errors to the error handling middleware
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
