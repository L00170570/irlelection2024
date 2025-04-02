// Load navbar
fetch('components/navbar.html')
  .then(function(res) {
    return res.text();
  })
  .then(function(html) {
    document.getElementById('navbar').innerHTML = html;
  });

// Fetch and display constituency data
fetch('/constituencies')
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    renderTable(data);
  });

function renderTable(data) {
  var table = document.getElementById('constituencyTable');
  table.innerHTML = '';

  for (var i = 0; i < data.length; i++) {
    var c = data[i];

    // Format turnout as percentage
    var turnout = c.PERCENTTURNOUT + '%';

    var row = document.createElement('tr');
    row.innerHTML = `
      <td><a href="constituency-detail.html?id=${c.CONSTITUENCY}">${c.NAME}</a></td>
      <td>${c.NOSEATS}</td>
      <td>${c.NOCANDIDATES}</td>
      <td>${Number(c.ELECTORATE).toLocaleString()}</td>
      <td>${Number(c.QUOTA).toLocaleString()}</td>
      <td>${turnout}</td>
    `;
    table.appendChild(row);
  }
}
