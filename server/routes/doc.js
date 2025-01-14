import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all docs
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("docs");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving docs");
  }
});

// Get a single doc by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("docs");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).json({ error: "Document not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving document" });
  }
});

// Create a new doc
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      content: req.body.content,
      dateUpdated: req.body.dateUpdated || new Date().toISOString(),
    };
    let collection = await db.collection("docs");
    let result = await collection.insertOne(newDocument);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding doc");
  }
});

// Update a doc by id
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        content: req.body.content,
        dateUpdated: req.body.dateUpdated,
      },
    };

    let collection = await db.collection("docs");
    let result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      res.status(404).json({ error: "Document not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating document" });
  }
});

// Delete a doc
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("docs");
    let result = await collection.deleteOne(query);

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting doc");
  }
});

export default router; 