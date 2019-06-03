"use strict";

const low = require("lowdb");
const Memory = require("lowdb/adapters/Memory");

const db = low(new Memory());

module.exports = db;
