// Load navbar
fetch('components/navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbar').innerHTML = html;
  });

// Cached data
let allCandidates = [];
let constituencies = {};
let allParties = [];

// First fetch candidates
fetch('/candidates')
  .then(function(res) {
    return res.json();
  })
  .then(function(candidatesData) {
    allCandidates = candidatesData;

    // Then fetch constituencies
    fetch('/constituencies')
      .then(function(res) {
        return res.json();
      })
      .then(function(constituenciesData) {
        for (var i = 0; i < constituenciesData.length; i++) {
          var c = constituenciesData[i];
          constituencies[c.CONSTITUENCY] = c.NAME;
        }

        // Then fetch parties
        fetch('/parties')
          .then(function(res) {
            return res.json();
          })
          .then(function(partiesData) {
            allParties = partiesData;

            // Now that all data is loaded, render filters and table
            populateFilters(allCandidates);
            renderTable(allCandidates);
          });
      });
  });


// Populate filter dropdowns
function populateFilters(data) {
    var partyFilter = document.getElementById('partyFilter');
    var consFilter = document.getElementById('constituencyFilter');
  
    var partyAdded = {};  // to avoid duplicates
    var consAdded = {};
  
    // Add party options (name shown, mnemonic is value)
    for (var i = 0; i < allParties.length; i++) {
      var p = allParties[i];
      if (!partyAdded[p.PARTY_MNEMONIC]) {
        var option = document.createElement('option');
        option.value = p.PARTY_MNEMONIC;
        option.textContent = p.PARTYNAME;
        partyFilter.appendChild(option);
        partyAdded[p.PARTY_MNEMONIC] = true;
      }
    }
  
    // Add constituency options
    for (var j = 0; j < data.length; j++) {
      var c = data[j].CONSTITUENCY;
      if (!consAdded[c]) {
        var opt = document.createElement('option');
        opt.value = c;
        opt.textContent = constituencies[c] || c;
        consFilter.appendChild(opt);
        consAdded[c] = true;
      }
    }
  
    // Listeners
    partyFilter.addEventListener('change', filterAndRender);
    consFilter.addEventListener('change', filterAndRender);
  }
  
  

function filterAndRender() {
    const selectedParty = document.getElementById('partyFilter').value;
    const selectedCon = document.getElementById('constituencyFilter').value;
  
    let filtered = allCandidates;
  
    if (selectedParty !== 'All') {
      filtered = allCandidates.filter(c => c.PARTY_MNEMONIC === selectedParty);
      document.getElementById('constituencyFilter').value = 'All'; // reset other
    } else if (selectedCon !== 'All') {
      filtered = allCandidates.filter(c => c.CONSTITUENCY === selectedCon);
      document.getElementById('partyFilter').value = 'All'; // reset other
    }
  
    renderTable(filtered);
  }
  
  
  
// Render table
function renderTable(data) {
  const table = document.getElementById('candidateTable');
  table.innerHTML = '';
  data.sort(function(a, b) {
    var nameA = a.SURNAME.toLowerCase() + a.FIRSTNAME.toLowerCase();
    var nameB = b.SURNAME.toLowerCase() + b.FIRSTNAME.toLowerCase();
    return nameA.localeCompare(nameB);
  });
  
  data.forEach((c, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${c.SURNAME}, ${c.FIRSTNAME}</td>
      <td>${c.PARTY_MNEMONIC}</td>
      <td>${constituencies[c.CONSTITUENCY] || c.CONSTITUENCY}</td>
    `;
    table.appendChild(row);
  });
}
