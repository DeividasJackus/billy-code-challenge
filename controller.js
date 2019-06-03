"use strict";

const boom = require("@hapi/boom");

const db = require("./db");

module.exports = {
  getAvailabilityInfo: async (req, res) => {
    res.json("Retrieve information about existing inventory.");
  },

  addPurchase: async (req, res) => {
    const { date, unitCost, unitCount } = req.body;

    // TODO: input validation?

    // Ensure no record exists for given date
    const existingDoc = await db
      .get("purchases")
      .find({ date })
      .value();
    if (existingDoc) throw boom.conflict(`Record for date ${date} already exists`);

    const newDoc = { date, unitCost, unitCount };

    // Add record to the database
    await db
      .get("purchases")
      .push(newDoc)
      .write();

    // Return the added record
    res.json(newDoc);
  },
  getPurchase: async (req, res) => {
    const { date } = req.params;

    // TODO: input validation?

    // Retrieve record from the database
    const existingDoc = await db
      .get("purchases")
      .find({ date })
      .value();
    if (!existingDoc) throw boom.notFound(`No record found for date ${date}`);

    res.json(existingDoc);
  },
  updatePurchase: async (req, res) => {
    const { date } = req.params;
    const { unitCount } = req.body;

    // TODO: input validation?

    // Retrieve record from the database
    const existingDoc = await db
      .get("purchases")
      .find({ date })
      .value();
    if (!existingDoc) throw boom.notFound(`No record found for date ${date}`);

    const newDoc = await db
      .get("purchases")
      .find({ date })
      .assign({ unitCount })
      .write();

    res.json(newDoc);
  },

  addSale: async (req, res) => {
    // TODO: input validation

    res.json("Add a new sale to the database.");
  },
  getSalesInfo: async (req, res) => {
    // TODO: input validation

    res.json("Retrieve information about recorded sales.");
  },
};
