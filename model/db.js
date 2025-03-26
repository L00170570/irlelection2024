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

exports.getSummary = function(req, res) {
  const sql = `
    SELECT * FROM nationalsummary;
    SELECT PARTY_MNEMONIC, PARTYNAME, PARTYCOLOUR FROM parties;
  `;

  connection.query(sql, function(err, results) {
    if (err) throw err;

    const summary = results[0];
    const parties = results[1];

    for (let row of summary) {
      const party = parties.find(p => p.PARTY_MNEMONIC === row.PARTY_MNEMONIC);
      if (party) {
        row.PARTYNAME = party.PARTYNAME;
        row.PARTYCOLOUR = party.PARTYCOLOUR;
      }
    }

    res.json(summary);
  });
};



exports.getParties = function(req, res) {
  connection.query("SELECT * FROM parties", function(err, rows, fields) {
    if (err) throw err;
    res.send(JSON.stringify(rows));
  });
};

exports.getCandidates = function(req, res) {
  connection.query("SELECT * FROM candidates", function(err, rows, fields) {
    if (err) throw err;
    res.send(JSON.stringify(rows));
  });
};
