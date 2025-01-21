import express from "express";
import cors from "cors";
import ticketRouter from "./routes/ticket.js";
import userRouter from "./routes/user.js";
import docRouter from "./routes/doc.js";
import feedbackRouter from "./routes/feedback.js";


const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Add detailed error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Routes
app.use("/ticket", ticketRouter);
app.use("/user", userRouter);
app.use("/doc", docRouter);
app.use("/feedback", feedbackRouter);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
