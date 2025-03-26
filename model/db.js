var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'irlelection2024',
  multipleStatements: true
});

connection.connect(function(err){
	if(err) throw err;
	console.log(`Successfully connected to MySQL database irlelection2024...`);
});

exports.getSummary = function(req,res){

    connection.query("SELECT * FROM nationalsummary", function(err, rows, fields) {
        if (err) throw err;
        res.send(JSON.stringify(rows));        
    });
	
}
