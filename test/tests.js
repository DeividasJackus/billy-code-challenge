"use strict";

/* eslint-disable no-unused-expressions, func-names, import/no-extraneous-dependencies */

const chai = require("chai");
const chaiHttp = require("chai-http");

const app = require("../server")();

chai.use(chaiHttp);
const { expect } = chai;

describe("getSalesInfo()", function() {
  it("should return correctly shaped data", async function() {
    const res = await chai.request(app).get("/inventory/sales");

    expect(res).to.have.status(200).and.to.be.json;
    expect(res.body).to.be.a("object");

    expect(res.body)
      .to.have.own.property("unitsSoldCount")
      .that.is.a("number")
      .that.is.at.least(0);

    expect(res.body)
      .to.have.own.property("unitsSoldValue")
      .that.is.a("number")
      .that.is.at.least(0);
  });
});

describe("Integration tests", function() {
  it("should handle the example from the original challenge description", async function() {
    // Register purchases

    expect(
      await chai
        .request(app)
        .post("/inventory/purchases")
        .send({
          date: "2016-01-01",
          unitCost: 10,
          unitCount: 200,
        }),
    ).to.have.status(201);

    expect(
      await chai
        .request(app)
        .post("/inventory/purchases")
        .send({
          date: "2016-01-05",
          unitCost: 15,
          unitCount: 250,
        }),
    ).to.have.status(201);

    expect(
      await chai
        .request(app)
        .post("/inventory/purchases")
        .send({
          date: "2016-01-10",
          unitCost: 12.5,
          unitCount: 150,
        }),
    ).to.have.status(201);

    // Register sales

    expect(
      await chai
        .request(app)
        .post("/inventory/sales")
        .send({
          date: "2016-01-03",
          unitCount: 50,
        }),
    ).to.have.status(204);

    expect(
      await chai
        .request(app)
        .post("/inventory/sales")
        .send({
          date: "2016-01-08",
          unitCount: 225,
        }),
    ).to.have.status(204);

    expect(
      await chai
        .request(app)
        .post("/inventory/sales")
        .send({
          date: "2016-01-11",
          unitCount: 50,
        }),
    ).to.have.status(204);

    let res;

    // Our inventory should now consist of:
    // - 125 units, cost of 15 per unit (purchased on 2016-01-05)
    // - 150 units, cost of 12.5 per unit (purchased on 2016-01-10)
    // Total value of 125 * 15 + 150 * 12.5 = 3750

    res = await chai.request(app).get("/inventory/availability");
    expect(res)
      .to.have.status(200)
      .and.to.be.json.and.to.have.own.property("body")
      .that.is.a("object");
    expect(res.body.total.unitCount).to.equal(275);
    expect(res.body.total.value).to.equal(3750);
    expect(res.body.currentBatch.unitCost).to.equal(15);
    expect(res.body.currentBatch.unitCount).to.equal(125);

    // We also sold a total of 325 units for a total price value of 3875

    res = await chai.request(app).get("/inventory/sales");
    expect(res)
      .to.have.status(200)
      .and.to.be.json.and.to.have.own.property("body")
      .that.is.a("object");
    expect(res.body).to.have.property("unitsSoldCount", 325);
    expect(res.body).to.have.property("unitsSoldValue", 3875);
  });
});
