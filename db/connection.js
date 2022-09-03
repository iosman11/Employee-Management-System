require("dotenv").config();
const mysql = require("mysql2");

// db information for sql database
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employees_db",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("SQL connected");
}),
  (module.exports = db);