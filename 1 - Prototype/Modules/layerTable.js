// modules/layerTable.js

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLayerTable);
} else {
  initLayerTable();
}

function initLayerTable() {
  console.log('Initializing Layer Table...');
  const container = document.getElementById('marketSheetContainer');
  if (!container) {
    console.error('marketSheetContainer not found!');
    return;
  }

  // Clear Market Sheet Tab content
  container.innerHTML = '';

  // Create the table element for the Layer Table
  const table = document.createElement('table');
  table.id = 'layerTable';
  table.style.borderCollapse = 'collapse';
  table.style.tableLayout = 'fixed'; // Prevent resizing based on content

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Define header titles and fixed widths for the Layer Table
  // New columns: "Layer No.", "Layer Title", "Attachment", "Delete"
  const headers = [
    { title: 'Layer No.', width: '120px' }, // expanded from 80px
    { title: 'Layer Title', width: '320px' },
    { title: 'Attachment', width: '150px' },
    { title: 'Delete', width: '60px' },
  ];

  headers.forEach(({ title, width }) => {
    const th = document.createElement('th');
    th.textContent = title;
    th.style.backgroundColor = '#001f3f'; // Dark navy blue
    th.style.color = '#fff';
    th.style.padding = '8px';
    th.style.width = width;
    th.style.border = '1px solid #ddd';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  tbody.id = 'layerTableBody';
  table.appendChild(tbody);

  container.appendChild(table);

  // Create the Add Layer Button
  const addLayerButton = document.createElement('button');
  addLayerButton.textContent = 'Add Layer';
  addLayerButton.id = 'addLayerButton';
  addLayerButton.style.marginTop = '10px';
  container.appendChild(addLayerButton);

  // Add a gap (40px tall) below the Add Layer Button
  const gapDiv = document.createElement('div');
  gapDiv.style.height = '40px';
  container.appendChild(gapDiv);

  // Create the additional small table (2 rows x 2 columns)
  // Total width should match the Layer Table width: 120 + 320 + 150 + 60 = 650px
  const smallTable = document.createElement('table');
  smallTable.id = 'smallTable';
  smallTable.style.borderCollapse = 'collapse';
  smallTable.style.tableLayout = 'fixed';
  smallTable.style.width = '650px';
  smallTable.style.marginBottom = '20px';

  // Row 1: "Attachment All" with a drop zone in column 2
  const row1 = document.createElement('tr');
  const cell1a = document.createElement('td');
  cell1a.textContent = 'Attachment All';
  cell1a.style.border = '1px solid #ddd';
  cell1a.style.padding = '8px';
  cell1a.style.width = '150px'; // fixed width for title column
  const cell1b = document.createElement('td');
  cell1b.style.border = '1px solid #ddd';
  cell1b.style.padding = '8px';
  cell1b.style.width = '500px'; // remaining width (650 - 150)
  // Create a drop zone for attachments (similar to the Market Sheet Attach column)
  const dropZone1 = document.createElement('div');
  dropZone1.className = 'drop-zone';
  dropZone1.style.width = '100%';
  dropZone1.style.height = '30px';
  dropZone1.style.border = '2px dashed #ccc';
  dropZone1.style.display = 'flex';
  dropZone1.style.alignItems = 'center';
  dropZone1.style.justifyContent = 'center';
  dropZone1.textContent = 'Drag & drop files here';
  // Hide a file input inside dropZone1 (if needed)
  const inputZone1 = document.createElement('input');
  inputZone1.type = 'file';
  inputZone1.multiple = true;
  inputZone1.style.display = 'none';
  dropZone1.appendChild(inputZone1);
  cell1b.appendChild(dropZone1);
  row1.appendChild(cell1a);
  row1.appendChild(cell1b);
  smallTable.appendChild(row1);

  // Row 2: "CC All" with a text input (unchanged)
  const row2 = document.createElement('tr');
  const cell2a = document.createElement('td');
  cell2a.textContent = 'CC All';
  cell2a.style.border = '1px solid #ddd';
  cell2a.style.padding = '8px';
  cell2a.style.width = '150px';
  const cell2b = document.createElement('td');
  cell2b.style.border = '1px solid #ddd';
  cell2b.style.padding = '8px';
  cell2b.style.width = '500px';
  const input2 = document.createElement('input');
  input2.type = 'text';
  input2.placeholder = ''; // no prompt text
  input2.style.width = '100%';
  cell2b.appendChild(input2);
  row2.appendChild(cell2a);
  row2.appendChild(cell2b);
  smallTable.appendChild(row2);

  // Append the small table under the gap
  container.appendChild(smallTable);

  // Initialize table with 3 rows in the Layer Table
  for (let i = 1; i <= 3; i++) {
    addLayerRow(i);
  }

  addLayerButton.addEventListener('click', () => {
    const newRowNum = tbody.rows.length + 1;
    addLayerRow(newRowNum);
  });
}

function addLayerRow(layerNumber) {
  const tbody = document.getElementById('layerTableBody');
  const row = document.createElement('tr');

  // --- Column 1: Layer No. ---
  const cellLayerNo = document.createElement('td');
  cellLayerNo.textContent = 'L' + layerNumber;
  cellLayerNo.style.textAlign = 'center';
  cellLayerNo.style.border = '1px solid #ddd';
  cellLayerNo.style.padding = '8px';
  row.appendChild(cellLayerNo);

  // --- Column 2: Layer Title (editable) ---
  const cellLayerTitle = document.createElement('td');
  cellLayerTitle.style.border = '1px solid #ddd';
  cellLayerTitle.style.padding = '8px';
  const inputTitle = document.createElement('input');
  inputTitle.type = 'text';
  inputTitle.value = ''; // Start empty
  inputTitle.style.width = '100%';
  inputTitle.style.border = 'none';
  inputTitle.style.outline = 'none';
  inputTitle.style.fontSize = '14px';
  cellLayerTitle.appendChild(inputTitle);
  row.appendChild(cellLayerTitle);

  // --- Column 3: Attachment (drop zone) ---
  const cellAttachment = document.createElement('td');
  cellAttachment.style.border = '1px solid #ddd';
  cellAttachment.style.padding = '8px';
  const dropZone = document.createElement('div');
  dropZone.className = 'drop-zone';
  dropZone.style.width = '100%';
  dropZone.style.height = '30px';
  dropZone.style.border = '2px dashed #ccc';
  dropZone.style.display = 'flex';
  dropZone.style.alignItems = 'center';
  dropZone.style.justifyContent = 'center';
  dropZone.textContent = 'Drag & drop files here';
  // Hidden file input inside drop zone
  const inputAttachment = document.createElement('input');
  inputAttachment.type = 'file';
  inputAttachment.multiple = true;
  inputAttachment.style.display = 'none';
  dropZone.appendChild(inputAttachment);
  cellAttachment.appendChild(dropZone);
  row.appendChild(cellAttachment);

  // --- Column 4: Delete icon ---
  const cellDelete = document.createElement('td');
  cellDelete.style.textAlign = 'center';
  cellDelete.style.border = '1px solid #ddd';
  cellDelete.style.padding = '8px';
  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '&#128465;'; // Unicode trash can icon
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.background = 'none';
  deleteBtn.style.border = 'none';
  deleteBtn.style.fontSize = '16px';
  deleteBtn.addEventListener('click', () => {
    row.remove();
    renumberLayerRows();
    document.dispatchEvent(new CustomEvent('layerTableUpdated'));
  });
  cellDelete.appendChild(deleteBtn);
  row.appendChild(cellDelete);

  tbody.appendChild(row);
  document.dispatchEvent(new CustomEvent('layerTableUpdated'));

  // Keyboard navigation for the Layer Title input
  inputTitle.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextRow = row.nextElementSibling;
      if (nextRow) {
        const nextInput = nextRow.querySelector('input');
        if (nextInput) nextInput.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevRow = row.previousElementSibling;
      if (prevRow) {
        const prevInput = prevRow.querySelector('input');
        if (prevInput) prevInput.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const nextRow = row.nextElementSibling;
      if (nextRow) {
        const nextInput = nextRow.querySelector('input');
        if (nextInput) nextInput.focus();
      }
    }
  });
}

function renumberLayerRows() {
  const tbody = document.getElementById('layerTableBody');
  const rows = tbody.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
    rows[i].cells[0].textContent = 'L' + (i + 1);
  }
  document.dispatchEvent(new CustomEvent('layerTableUpdated'));
}
