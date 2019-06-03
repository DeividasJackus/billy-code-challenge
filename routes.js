"use strict";

const boom = require("@hapi/boom");

// A wrapper for asynchronous route handlers to ensure errors are caught and normalized
// This allows us to use async-await handlers in which we simply throw instead of calling next()
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err.isBoom ? err : boom.badImplementation(err)));
};

module.exports = {
  setup(app) {
    app.get(
      "/inventory/availability",
      asyncHandler(async (req, res) => {
        res.json("Retrieve information about existing inventory.");
      }),
    );

    app.post(
      "/inventory/purchases",
      asyncHandler(async (req, res) => {
        res.json("Add a new purchase to the database.");
      }),
    );

    app.get(
      "/inventory/purchases/:date",
      asyncHandler(async (req, res) => {
        res.json("Retrieve information about a recorded purchase.");
      }),
    );

    app.patch(
      "/inventory/purchases/:date",
      asyncHandler(async (req, res) => {
        res.json("Update the number of available units for a given batch.");
      }),
    );

    app.post(
      "/inventory/sales",
      asyncHandler(async (req, res) => {
        res.json("Add a new sale to the database.");
      }),
    );

    app.get(
      "/inventory/sales",
      asyncHandler(async (req, res) => {
        res.json("Retrieve information about recorded sales.");
      }),
    );
  },
};
