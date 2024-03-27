const mysql = require('mysql');
const connection = mysql.createConnection({
  host: '185.229.118.45',
  user: 'u1575315_root',
  password: '.l,lTf+Qdlv0',
  database: 'u1575315_db_laundry',
  port:3306
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();
