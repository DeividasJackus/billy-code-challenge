"use strict";

const low = require("lowdb");
const Memory = require("lowdb/adapters/Memory");

const db = low(new Memory());

// Set defaults
db.defaults({
  purchases: [],
  sales: [],
}).write();

module.exports = db;
