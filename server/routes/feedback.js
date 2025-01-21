import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all feedback
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("feedback");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving feedback");
  }
});

// Get a single feedback by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("feedback");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving feedback");
  }
});

// Create a new feedback
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      userId: req.body.userId,
      createAt: req.body.createAt || new Date().toISOString(),
      problemFeedback: req.body.problemFeedback,
      detailFeedback: req.body.detailFeedback,
      rating: req.body.rating,
      support: req.body.support
    };
    let collection = await db.collection("feedback");
    let result = await collection.insertOne(newDocument);

    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding feedback");
  }
});

// Update a feedback by id
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        problemFeedback: req.body.problemFeedback,
        detailFeedback: req.body.detailFeedback,
        rating: req.body.rating,
        support: req.body.support
      },
    };

    let collection = await db.collection("feedback");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating feedback");
  }
});

// Delete a feedback
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("feedback");
    let result = await collection.deleteOne(query);

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting feedback");
  }
});

export default router; 