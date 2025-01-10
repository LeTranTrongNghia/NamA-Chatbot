import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Move the check endpoint BEFORE the /:id route
// Add new endpoint - Check for existing user by email or phone
router.get("/check", async (req, res) => {
  try {
    let collection = await db.collection("users");
    let query = {};
    
    // Build query based on provided parameters
    if (req.query.email) query.email = req.query.email;
    if (req.query.phone) query.phone = req.query.phone;
    
    // If no query parameters, return null
    if (Object.keys(query).length === 0) {
      return res.json(null);
    }
    
    let result = await collection.findOne(query);
    res.json(result); // Will be null if no user found
  } catch (err) {
    console.error(err);
    res.status(500).send("Error checking for existing user");
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("users");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users");
  }
});

// Get a single user by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("users");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving user");
  }
});

// Create a new user
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      fullname: req.body.fullName || null,
      phone: req.body.phone || null,
      email: req.body.email || null,
      ticketIds: [], // Initialize empty array of tickets
      createdAt: new Date().toISOString()
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding user");
  }
});

// Update a user
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        ...(req.body.fullname && { fullname: req.body.fullname }),
        ...(req.body.phone && { phone: req.body.phone }),
        ...(req.body.email && { email: req.body.email }),
        ...(req.body.ticketIds && { ticketIds: req.body.ticketIds }),
      }
    };

    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});

// Add ticket to user's ticketIds
router.patch("/:id/tickets", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $push: { ticketIds: req.body.ticketId }
    };

    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding ticket to user");
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("users");
    let result = await collection.deleteOne(query);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

// Modify existing PUT endpoint to handle updates
router.put("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        fullname: req.body.fullname || null,
        phone: req.body.phone || null,
        email: req.body.email || null
      }
    };

    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});

export default router; 