console.log("Script loaded");


// Load navbar
fetch('components/navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbar').innerHTML = html;
  });

// Get query param: ?id=C10
const params = new URLSearchParams(window.location.search);
const constituencyID = params.get('id');

// Global lookups
let constituencyName = '';
let totalVotes = 0;

Promise.all([
  fetch('/constituencies').then(res => res.json()),
  fetch('/candidates/constituency/' + constituencyID).then(res => res.json())
]).then(function([constituencies, candidates]) {
  // Get constituency name
  for (var i = 0; i < constituencies.length; i++) {
    if (constituencies[i].CONSTITUENCY === constituencyID) {
      constituencyName = constituencies[i].NAME;
      break;
    }
  }

  document.getElementById('constituencyName').textContent = constituencyName;

  // Group votes by party
  const voteMap = {};
  for (var i = 0; i < candidates.length; i++) {
    var c = candidates[i];
    if (!voteMap[c.PARTY_MNEMONIC]) {
      voteMap[c.PARTY_MNEMONIC] = 0;
    }
  }

  // Fetch counts (round 1 only)
  fetch('/counts')
  .then(res => res.json())
  .then(function(counts) {
    console.log("Loaded counts:", counts); // ✅ NEW

    counts.forEach(function(count) {
      if (count.CONSTITUENCY === constituencyID && count.COUNTNUMBER === 1) {
        console.log("Count found:", count); // ✅ NEW

        var candidate = candidates.find(c => c.CANDIDATE_ID === count.CANDIDATE_ID);
        console.log("Matching candidate:", candidate); // ✅ NEW

        if (candidate) {
          var party = candidate.PARTY_MNEMONIC;

          if (!voteMap[party]) {
            voteMap[party] = 0;
          }

          voteMap[party] += count.NOVOTES;
          totalVotes += count.NOVOTES;
        }
      }
    });

    console.log("voteMap", voteMap); // ✅ NEW
    console.log("totalVotes", totalVotes); // ✅ NEW

    renderVotesTable(voteMap);
    renderBarChart(voteMap);

  });

});

function renderVotesTable(voteMap) {
  var table = document.getElementById('voteBreakdown');
  var sorted = Object.keys(voteMap).sort(function(a, b) {
    return voteMap[b] - voteMap[a];
  });

  for (var i = 0; i < sorted.length; i++) {
    var party = sorted[i];
    var votes = voteMap[party];
    var percent = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : "0.0";
    var row = document.createElement('tr');
    row.innerHTML = `
      <td>${party}</td>
      <td>${votes.toLocaleString()}</td>
      <td>${percent}%</td>
    `;
    table.appendChild(row);
  }
}
