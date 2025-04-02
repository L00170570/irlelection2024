// Load navbar
fetch('components/navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbar').innerHTML = html;
  });

// Fetch summary data
fetch('/summary')
  .then(res => res.json())
  .then(data => {
    // Sort by seats won in descending order
    data.sort((a, b) => b.SEATS_WON_2024 - a.SEATS_WON_2024);

    renderPartyBoxesD3(data);
    renderTable(data);
  })
  .catch(err => {
    console.error("Failed to load summary:", err);
  });


function renderPartyBoxesD3(data) {
  const container = d3.select('#partyBoxes');

  container
    .selectAll('div.party-box')
    .data(data)
    .enter()
    .append('div')
    .attr('class', 'party-box')
    .style('background-color', d => d.PARTYCOLOUR || '#ccc')
    .html(d => `${d.PARTY_MNEMONIC}<br>${d.SEATS_WON_2024} SEATS`);
}

function renderTable(data) {
  const table = document.getElementById('summaryTable');
  data.forEach(party => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${party.PARTY_MNEMONIC}</td>
      <td>${party.FIRST_PREFERENCE_VOTES_2024.toLocaleString()}</td>
      <td>${party.SEATS_WON_2024}</td>
    `;
    table.appendChild(row);
  });
}
