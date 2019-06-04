"use strict";

const low = require("lowdb");
const Memory = require("lowdb/adapters/Memory");

const db = low(new Memory());

// Set defaults
db.defaults({
  purchases: [
    // {
    //   date: "2016-01-01",
    //   unitCost: 10,
    //   unitCount: 200,
    //   unitsSoldCount: 0,
    //   unitsSoldValue: 0,
    // },
    // {
    //   date: "2016-01-05",
    //   unitCost: 15,
    //   unitCount: 250,
    //   unitsSoldCount: 0,
    //   unitsSoldValue: 0,
    // },
    // {
    //   date: "2016-01-10",
    //   unitCost: 12.5,
    //   unitCount: 150,
    //   unitsSoldCount: 0,
    //   unitsSoldValue: 0,
    // },
  ],
}).write();

module.exports = db;
