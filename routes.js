"use strict";

const boom = require("@hapi/boom");

const controller = require("./controller");

// A wrapper for asynchronous route handlers to ensure errors are caught and normalized
// This allows us to use async-await handlers in which we simply throw instead of calling next()
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err.isBoom ? err : boom.badImplementation(err)));
};

module.exports = {
  setup(app) {
    app.get("/inventory/availability", asyncHandler(controller.getAvailabilityInfo));

    app.post("/inventory/purchases", asyncHandler(controller.addPurchase));
    app.get("/inventory/purchases/:date", asyncHandler(controller.getPurchase));
    app.patch("/inventory/purchases/:date", asyncHandler(controller.updatePurchase));

    app.post("/inventory/sales", asyncHandler(controller.addSale));
    app.get("/inventory/sales", asyncHandler(controller.getSalesInfo));
  },
};
