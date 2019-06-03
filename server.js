"use strict";

const express = require("express");

module.exports = () => {
  const app = express();

  app.get("/", (req, res) => {
    res.json();
  });

  return app;
};
