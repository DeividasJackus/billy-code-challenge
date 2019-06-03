# Code challenge for Billy

Original challenge document can be found [here](https://github.com/deividasjackus/billy-code-challenge/blob/master/challenge.pdf).

Authored 2019-06-03 by [Deividas Jackus](https://github.com/deividasjackus).

## Assumptions & limitations

- We won't use a persistent database for the purpose of this challenge.
- We'll use purchase dates to uniquely identify inventory batches for the purpose of simplification.
- Transactions can be added in a random order (e.g. whenever a Purchase / Sale happens, or all Purchases first and Sales later, etc).

## Technologies used

- [Node.js](https://nodejs.org/).
- [Express](https://expressjs.com/) as the web framework to serve the REST API.
- [lowdb](https://github.com/typicode/lowdb) as a small JSON database.
- [Mocha](https://mochajs.org/) & [Chai](https://www.chaijs.com/) for testing.

## Installation

```bash
npm i
```

## Usage

Once run, the server will start on port 3000 unless specified otherwise using the environment variable `PORT`.

### Running in development mode

Auto-reload is enabled by default using [Nodemon](https://nodemon.io/).

```bash
npm run dev
```

### Running in development with debugging enabled

Debugging is achieved using [debug](https://www.npmjs.com/package/debug).

```bash
DEBUG=challenge npm run dev
```

### Running in production

```bash
NODE_ENV=production npm start
```

## API

The API is a simple CRUD interface centered around `purchases` and `sales`.
Additionally, there's a special `availability` resource.

All purchase/sale dates are strings in the format `YYYY-MM-dd`.

Unless specified otherwise, all handlers return a HTTP status code of 200 upon success and a 4xx error upon user input error.

### `GET /inventory/availability`

**Retrieve information about existing inventory availability.**

Response format:
```js
 {
   total: {
     unitCount, // total number of units in stock
     value, // aggregate value of units in stock
   },
   currentPrice: {
     unitCost, // current unit price
     unitCount, // number of units available at given price
   },
 }
```

### `POST /inventory/purchases`

**Add a new purchase to the database.**

Request body format:
```js
 {
   date: "2016-01-01", // purchase date
   unitCost: 10, // cost per unit
   unitCount: 200, // number of units
 }
```

Returns the new object back upon success.

### `GET /inventory/purchases/:date`

**Retrieve information about a recorded purchase.**

Response format:
```js
 {
   date, // purchase date
   unitCost, // cost per unit
   unitCount, // number of units available in stock
   unitsSoldCount, // total number of units sold from this batch
   unitsSoldValue, // total value of units sold from this batch
 }
```

### `PATCH /inventory/purchases/:date`

**Update the number of available units for a given batch.**

Request body format:
```js
 {
   unitCount, // number of units available in stock
 }
```

Returns the new object back upon success.

### `POST /inventory/sales`

**Add a new sale to the database.**

Request body format:
```js
 {
   date, // sale date
   unitCount, // number of units sold
 }
```

### `GET /inventory/sales`

**Retrieve information about recorded sales.**

Response format:
```js
 {
   unitsSoldCount, // total number of units sold
   unitsSoldValue, // total value of units sold
 }
```
