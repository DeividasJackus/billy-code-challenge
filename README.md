# Code challenge for Billy

Original challenge document can be found [here](https://github.com/deividasjackus/billy-code-challenge/blob/master/challenge.pdf).

Authored 2019-06-03 by [Deividas Jackus](https://github.com/deividasjackus).

# Assumptions & limitations

- We won't use a persistent database for the purpose of this challenge.
- We'll use purchase dates to uniquely identify inventory batches for the purpose of simplification.
- Transactions can be added in a random order (e.g. whenever a Purchase / Sale happens, or all Purchases first and Sales later, etc).

# Technologies used

- [Node.js](https://nodejs.org/).
- [Express](https://expressjs.com/) as the web framework to serve the REST API.
- [lowdb](https://github.com/typicode/lowdb) as a small JSON database.
- [Mocha](https://mochajs.org/) & [Chai](https://www.chaijs.com/) for testing.
