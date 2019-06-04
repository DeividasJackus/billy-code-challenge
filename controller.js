"use strict";

const debug = require("debug")("challenge");
const boom = require("@hapi/boom");
const joiDate = require("@hapi/joi-date");
const joi = require("@hapi/joi").extend(joiDate);

const db = require("./db");

const schema = {
  date: joi.date().format("YYYY-MM-DD"),
  unitCost: joi.number().min(0),
  unitCount: joi
    .number()
    .integer()
    .min(0),
};

function validateInput(data, expectedSchema) {
  const results = joi.validate(data, joi.object().keys(expectedSchema));
  if (results.error) throw boom.badRequest(results.error);
}

function countUnitsAvailable(batches) {
  return batches.map(({ unitCount }) => unitCount).reduce((a, b) => a + b, 0);
}

function countBatchValue(batches) {
  return batches.map(({ unitCost, unitCount }) => unitCost * unitCount).reduce((p, c) => p + c, 0);
}

module.exports = {
  getAvailabilityInfo: async (req, res) => {
    // Retrieve all batches from the database having at least 1 unit available, sorted by date
    const batches = await db
      .get("purchases")
      .filter(({ unitCount }) => unitCount > 0)
      .sortBy("date")
      .value();

    res.json({
      total: {
        unitCount: countUnitsAvailable(batches), // total number of units in stock
        value: countBatchValue(batches), // aggregate value of units in stock
      },
      currentBatch: batches[0]
        ? {
            unitCost: batches[0].unitCost, // current unit price
            unitCount: batches[0].unitCount, // number of units available at given price
          }
        : null,
    });
  },

  addPurchase: async (req, res) => {
    validateInput(req.body, {
      date: schema.date.required(),
      unitCost: schema.unitCost.required(),
      unitCount: schema.unitCount.required(),
    });

    const { date, unitCost, unitCount } = req.body;

    // Ensure no record exists for given date
    const existingDoc = await db
      .get("purchases")
      .find({ date })
      .value();
    if (existingDoc) throw boom.conflict(`Record for date ${date} already exists`);

    const newDoc = {
      date,
      unitCost,
      unitCount,
      unitsSoldCount: 0,
      unitsSoldValue: 0,
    };

    // Add record to the database
    await db
      .get("purchases")
      .push(newDoc)
      .write();

    // Return the added record
    res.status(201).json(newDoc);
  },
  getPurchase: async (req, res) => {
    validateInput(req.params, {
      date: schema.date.required(),
    });

    const { date } = req.params;

    // Retrieve record from the database
    const existingDoc = await db
      .get("purchases")
      .find({ date })
      .value();
    if (!existingDoc) throw boom.notFound(`No record found for date ${date}`);

    res.json(existingDoc);
  },
  updatePurchase: async (req, res) => {
    validateInput(req.params, {
      date: schema.date.required(),
    });
    validateInput(req.body, {
      unitCount: schema.unitCount.required(),
    });

    const { date } = req.params;
    const { unitCount } = req.body;

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
    validateInput(req.body, {
      date: schema.date.required(),
      unitCount: schema.unitCount.required(),
    });

    const { date } = req.body;
    let { unitCount: unitsToSell } = req.body;

    // Retrieve all batches from the database having at least 1 unit available, sorted by date
    // Make sure to limit the selection to batches with purchase date <= sale date
    const batches = await db
      .get("purchases")
      .filter((r) => r.unitCount > 0 && r.date <= date)
      .sortBy("date")
      .value();

    // Check if we have enough units in stock leading to the sale date
    const unitsAvailable = countUnitsAvailable(batches);
    debug(
      `Trying to sell ${unitsToSell} unit(s) with ${unitsAvailable} unit(s) available in ${
        batches.length
      } applicable batch(es)`,
    );

    if (unitsAvailable < unitsToSell) {
      throw boom.badRequest(`Can't sell ${unitsToSell} unit(s) with ${unitsAvailable} unit(s) available!`);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const batch of batches) {
      // Check how many units we should sell from the current batch
      const batchUnitsBeingSold = Math.min(unitsToSell, batch.unitCount);

      debug(`${unitsToSell} unit(s) left to sell, picking ${batchUnitsBeingSold} unit(s) out of batch`);

      // Adjust numbers for given batch batch
      batch.unitCount -= batchUnitsBeingSold;
      batch.unitsSoldCount += batchUnitsBeingSold;
      batch.unitsSoldValue += batch.unitCost * batchUnitsBeingSold;

      unitsToSell -= batchUnitsBeingSold;

      if (!unitsToSell) break;
    }

    res.status(204).send();
  },
  getSalesInfo: async (req, res) => {
    // Retrieve all batches from the database
    const batches = await db.get("purchases").value();

    res.json({
      unitsSoldCount: batches.map((r) => r.unitsSoldCount).reduce((a, b) => a + b, 0), // total number of units sold
      unitsSoldValue: batches.map((r) => r.unitsSoldValue).reduce((a, b) => a + b, 0), // total value of units sold
    });
  },
};
