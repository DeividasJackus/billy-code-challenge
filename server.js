"use strict";

const express = require("express");
const morgan = require("morgan");

module.exports = () => {
  const app = express();

  // Log incoming requests to stdout
  app.use(morgan(app.settings.env === "development" ? "dev" : "tiny"));

  app.get("/", (req, res) => {
    res.json();
  });

  return app;
};
