// Load navbar
fetch('components/navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbar').innerHTML = html;
  });

// Fetch and render parties
fetch('/parties')
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById('partyTable');
    data.sort(function(a, b) {
        return a.PARTY_MNEMONIC.localeCompare(b.PARTY_MNEMONIC);
      });
      
    data.forEach(party => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${party.PARTY_MNEMONIC}</td>
        <td>${party.PARTYNAME}</td>
      `;
      table.appendChild(row);
    });
  })
  .catch(err => {
    console.error("Error loading party data:", err);
  });
