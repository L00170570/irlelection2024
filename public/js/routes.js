// Load the navbar from components/navbar.html
fetch('components/navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbar').innerHTML = html;
  })
  .catch(err => {
    document.getElementById('navbar').innerHTML = `<div class="alert alert-danger">Failed to load navbar</div>`;
  });

  const routes = [
    { path: '/summary', desc: 'GET summary' },
    { path: '/parties', desc: 'GET parties' },
    { path: '/candidates', desc: 'GET candidates' },
    { path: '/candidates/party/FF', desc: 'GET candidates by party (FF)' },
    { path: '/candidates/constituency/C09', desc: 'GET candidates by constituency (C09)' },
  ];
  
  const tableBody = document.getElementById('routeTable');
  
  routes.forEach(route => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${route.path}</td>
      <td>${route.desc}</td>
      <td><a href="${route.path}" target="_blank">${route.path}</a></td>
      <td><button class="btn btn-primary btn-sm" onclick="fetchData('${route.path}')">GET</button></td>
    `;
    tableBody.appendChild(row);
  });
  

// Fetch data when "GET" button clicked
function fetchData(path) {
  fetch(path)
    .then(res => {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      document.getElementById('output').textContent = JSON.stringify(data, null, 2);
    })
    .catch(err => {
      document.getElementById('output').textContent = `Error fetching ${path}:\n${err}`;
    });
}
