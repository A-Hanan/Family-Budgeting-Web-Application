const db = require("knex")({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "example", //maybe test
    database: "family_budget_db",
  },
});
//replace above given redentials with yours
module.exports = db;
