"use strict";

const debug = require("debug")("challenge");
const app = require("./server")();

debug(`Starting up in ${process.env.NODE_ENV || "development"} mode`);

// listen for incoming requests
const server = app.listen(process.env.PORT || 3000, () => {
  const { address, port } = server.address();
  console.log(`Listening for incoming connections on ${address}:${port}`);
});
