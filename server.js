"use strict";

const express = require("express");
const morgan = require("morgan");
const boom = require("@hapi/boom");

// A wrapper for asynchronous route handlers to ensure errors are caught and normalized
// This allows us to use async-await handlers in which we simply throw instead of calling next()
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err.isBoom ? err : boom.badImplementation(err)));
};

module.exports = () => {
  const app = express();

  app.set("case sensitive routing", true);
  app.set("strict routing", true);

  // Log incoming requests to stdout
  app.use(morgan(app.get("env") === "development" ? "dev" : "tiny"));

  // Use a middleware for parsing JSON requests
  app.use(express.json());

  // Error handling middleware for Express should be loaded after all route handlers are loaded
  app.use((err, req, res, next) => {
    if (err.isServer) {
      // We'll want to log server errors to stdout
      console.error(err);
    }
    return res.status(err.output.statusCode).json(err.output.payload);
  });

  return app;
};
