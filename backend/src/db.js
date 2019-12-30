//connct to remote prisma db
const { Prisma } = require("prisma-binding");
require("dotenv").config({ path: "variables.env" });

const db = new Prisma({
  typeDefs: __dirname + "/schema_prep.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false
});

module.exports = db;
