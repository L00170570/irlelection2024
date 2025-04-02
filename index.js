var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("./model/db.js");

var app = express();

app.use(cors());
app.use(express.static('public'));  //

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));


app.get("/summary", function(req,res){   
    db.getSummary(req,res);
});

app.get("/parties", function(req,res){   
  db.getParties(req,res);
});

app.get("/candidates", function(req,res){   
  db.getCandidates(req,res);
});

app.get("/constituencies", (req, res) => {
  db.getConstituencies(req, res);
});

app.get("/counts", function(req, res) {
  db.getCounts(req, res);
});



app.get("/candidates/party/:party", function(req, res) {
  db.getCandidatesByParty(req, res);
});

app.get("/candidates/constituency/:constituency", function(req, res) {
  db.getCandidatesByConstituency(req, res);
});




var myServer = app.listen(3000, function() {
  console.log("IRLElection2024 Server listening on port 3000...");
});
