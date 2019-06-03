"use strict";

const app = require("./server")();

// listen for incoming requests
const server = app.listen(process.env.PORT || 3000, () => {
  const { address, port } = server.address();
  console.log(`Listening for incoming connections on ${address}:${port}`);
});
