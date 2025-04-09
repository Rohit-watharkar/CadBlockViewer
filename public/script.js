async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
  
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const result = await response.json();
    alert(result.message);
    loadBlocks();
  }
  
  async function loadBlocks() {
    const response = await fetch('/api/blocks');
    const { data } = await response.json();
    const blockList = document.getElementById('blockList');
    blockList.innerHTML = '<h2>Blocks</h2><table><tr><th>ID</th><th>Name</th><th>Action</th></tr>' +
      data.map(block => `<tr><td>${block.id}</td><td>${block.name}</td><td><button onclick="showDetails(${block.id})">Details</button></td></tr>`).join('') +
      '</table>';
  }
  
  async function showDetails(id) {
    const response = await fetch(`/api/blocks/${id}`);
    const block = await response.json();
    document.getElementById('blockDetails').innerHTML = `<h2>Block Details</h2><p>ID: ${block.id}</p><p>Name: ${block.name}</p><p>X: ${block.x}</p><p>Y: ${block.y}</p><p>Type: ${block.type}</p>`;
  }
  
  async function searchBlocks() {
    const query = document.getElementById('searchInput').value;
    const response = await fetch(`/api/search?name=${query}`);
    const blocks = await response.json();
    const blockList = document.getElementById('blockList');
    blockList.innerHTML = '<h2>Search Results</h2><table><tr><th>ID</th><th>Name</th><th>Action</th></tr>' +
      blocks.map(block => `<tr><td>${block.id}</td><td>${block.name}</td><td><button onclick="showDetails(${block.id})">Details</button></td></tr>`).join('') +
      '</table>';
  }
  
  window.onload = loadBlocks;