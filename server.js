"use strict";

const express = require("express");
const morgan = require("morgan");

const routes = require("./routes");

module.exports = () => {
  const app = express();

  app.set("case sensitive routing", true);
  app.set("strict routing", true);

  // Log incoming requests to stdout (unless we're running tests)
  if (typeof global.it !== "function") {
    app.use(morgan(app.get("env") === "development" ? "dev" : "tiny"));
  }

  // Use a middleware for parsing JSON requests
  app.use(express.json());

  routes.setup(app);

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
