import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all tickets
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("tickets");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving tickets");
  }
});

// Get a single ticket by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("tickets");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving ticket");
  }
});

// Create a new ticket
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      userId: req.body.userId,
      tags: req.body.tags,
      content: req.body.content,
      summary: req.body.summary,
      creationTime: req.body.creationTime || new Date().toISOString(),
      status: req.body.status,
      priority: req.body.priority,
      responsibleTeam: req.body.responsibleTeam || null,
      adminNotes: req.body.adminNotes || null
    };
    let collection = await db.collection("tickets");
    let result = await collection.insertOne(newDocument);

    if (req.body.userId) {
      const userCollection = await db.collection("users");
      await userCollection.updateOne(
        { _id: new ObjectId(req.body.userId) },
        { $push: { ticketIds: result.insertedId.toString() } }
      );
    }

    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding ticket");
  }
});

// Update a ticket by id
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        tags: req.body.tags,
        content: req.body.content,
        summary: req.body.summary,
        status: req.body.status,
        priority: req.body.priority,
        responsibleTeam: req.body.responsibleTeam,
        adminNotes: req.body.adminNotes
      },
    };

    let collection = await db.collection("tickets");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating ticket");
  }
});

// Delete a ticket
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("tickets");
    let result = await collection.deleteOne(query);

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting ticket");
  }
});

export default router; 