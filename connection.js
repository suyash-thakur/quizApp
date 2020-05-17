require("dotenv").config();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT,
    database : process.env.RDS_DATABASE
});

connection.connect((err) => {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
  
    console.log('Connected to mysql.');
    var sql = "select * from users;";
    connection.query(sql, function (err, result) {
    if (err) throw err;
      console.log(result);
    });
});