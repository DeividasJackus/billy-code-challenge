"use strict";

module.exports = {
  getAvailabilityInfo: async (req, res) => {
    res.json("Retrieve information about existing inventory.");
  },

  addPurchase: async (req, res) => {
    res.json("Add a new purchase to the database.");
  },
  getPurchase: async (req, res) => {
    res.json("Retrieve information about a recorded purchase.");
  },
  updatePurchase: async (req, res) => {
    res.json("Update the number of available units for a given batch.");
  },

  addSale: async (req, res) => {
    res.json("Add a new sale to the database.");
  },
  getSalesInfo: async (req, res) => {
    res.json("Retrieve information about recorded sales.");
  },
};
