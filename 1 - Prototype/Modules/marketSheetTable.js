// modules/marketSheetTable.js

// Define a constant for the number of fixed columns
// (No., Select, Market, Underwriter, To Email, CC Email, Attach, Notes, Complete)
const FIXED_COL_COUNT = 9;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMarketSheetTable);
} else {
  initMarketSheetTable();
}

function initMarketSheetTable() {
  console.log('Initializing Market Sheet Table...');
  const container = document.getElementById('marketSheetContainer');
  if (!container) {
    console.error('marketSheetContainer not found!');
    return;
  }

  // Append a separator so the Market Sheet Table appears below the Layer Table
  const separator = document.createElement('hr');
  container.appendChild(separator);

  // ===== Format Mode Control =====
  const formatDiv = document.createElement('div');
  formatDiv.style.marginBottom = '10px';
  const formatLabel = document.createElement('label');
  formatLabel.textContent = 'Format Mode: ';
  const formatSelect = document.createElement('select');
  formatSelect.id = 'formatModeSelect'; // fixed dropdown for format mode
  const optMonetary = document.createElement('option');
  optMonetary.value = 'Monetary';
  optMonetary.textContent = 'Monetary';
  const optPercentage = document.createElement('option');
  optPercentage.value = 'Percentage';
  optPercentage.textContent = 'Percentage';
  formatSelect.appendChild(optMonetary);
  formatSelect.appendChild(optPercentage);
  formatLabel.appendChild(formatSelect);
  const currencyInput = document.createElement('input');
  currencyInput.type = 'text';
  currencyInput.placeholder = '$/£';
  currencyInput.style.width = '50px';
  currencyInput.style.marginLeft = '5px';
  formatLabel.appendChild(currencyInput);
  formatDiv.appendChild(formatLabel);
  container.appendChild(formatDiv);

  window.formatMode = formatSelect.value; // default "Monetary"
  window.currencySymbol = currencyInput.value || '$';

  formatSelect.addEventListener('change', function() {
    window.formatMode = this.value;
    if (window.formatMode === 'Monetary') {
      currencyInput.style.display = 'inline-block';
    } else {
      currencyInput.style.display = 'none';
    }
    reformatAllLayerInputs();
  });
  currencyInput.addEventListener('input', function() {
    window.currencySymbol = this.value;
  });

  // ===== Filter Layer Dropdown Row =====
  const filterDiv = document.createElement('div');
  filterDiv.style.marginBottom = '10px';
  const filterLabel = document.createElement('label');
  filterLabel.textContent = 'Filter Layer: ';
  const filterDropdown = document.createElement('select');
  filterDropdown.id = 'filterLayerSelect'; // separate ID for filter
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Layers';
  filterDropdown.appendChild(allOption);
  filterLabel.appendChild(filterDropdown);
  filterDiv.appendChild(filterLabel);
  container.appendChild(filterDiv);

  // ===== Filter Completion Dropdown Row =====
  const filterCompletionDiv = document.createElement('div');
  filterCompletionDiv.style.marginBottom = '10px';
  const filterCompletionLabel = document.createElement('label');
  filterCompletionLabel.textContent = 'Filter Completion: ';
  const filterCompletionSelect = document.createElement('select');
  filterCompletionSelect.id = 'filterCompletionSelect';
  const compOptAll = document.createElement('option');
  compOptAll.value = 'all';
  compOptAll.textContent = 'All';
  const compOptCompleted = document.createElement('option');
  compOptCompleted.value = 'completed';
  compOptCompleted.textContent = 'Completed';
  const compOptNonCompleted = document.createElement('option');
  compOptNonCompleted.value = 'non-completed';
  compOptNonCompleted.textContent = 'Non-Completed';
  filterCompletionSelect.appendChild(compOptAll);
  filterCompletionSelect.appendChild(compOptCompleted);
  filterCompletionSelect.appendChild(compOptNonCompleted);
  filterCompletionLabel.appendChild(filterCompletionSelect);
  filterCompletionDiv.appendChild(filterCompletionLabel);
  container.appendChild(filterCompletionDiv);

  // Use the unified filter function for both filters.
  filterDropdown.addEventListener('change', applyFilters);
  filterCompletionSelect.addEventListener('change', applyFilters);

  // ===== Controls Row Above Table (Select All + Draft Emails) =====
  const controlsDiv = document.createElement('div');
  controlsDiv.style.display = 'flex';
  controlsDiv.style.justifyContent = 'space-between';
  controlsDiv.style.alignItems = 'center';
  controlsDiv.style.marginBottom = '10px';

  // Left Group: Select All
  const leftGroup = document.createElement('div');
  const selectAllLabel = document.createElement('label');
  selectAllLabel.textContent = 'Select All';
  const selectAllCheckbox = document.createElement('input');
  selectAllCheckbox.type = 'checkbox';
  selectAllCheckbox.checked = true;
  selectAllCheckbox.style.marginRight = '5px';
  selectAllLabel.prepend(selectAllCheckbox);
  leftGroup.appendChild(selectAllLabel);

  // Right Group: Draft Emails button (correct one)
  const rightGroup = document.createElement('div');
  const draftEmailsButton = document.createElement('button');
  draftEmailsButton.textContent = 'Draft Selected Emails';
  draftEmailsButton.id = 'draftEmailsButton';
  rightGroup.appendChild(draftEmailsButton);

  controlsDiv.appendChild(leftGroup);
  controlsDiv.appendChild(rightGroup);
  container.appendChild(controlsDiv);

  // ===== Create the Market Sheet Table =====
  const table = document.createElement('table');
  table.id = 'marketSheetTable';
  table.style.borderCollapse = 'collapse';
  table.style.tableLayout = 'fixed';
  table.style.width = '100%';
  table.style.marginBottom = '10px';

  // ----- Build Header -----
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const fixedHeaders = [
    { title: 'No.', width: '40px' },
    { title: 'Select', width: '60px' },
    { title: 'Market', width: '200px' },
    { title: 'Underwriter', width: '150px' },
    { title: 'To Email', width: '200px' },
    { title: 'CC Email', width: '200px' },
    { title: 'Attach', width: '100px' }
  ];
  fixedHeaders.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header.title;
    th.style.backgroundColor = '#001f3f';
    th.style.color = '#fff';
    th.style.padding = '8px';
    th.style.width = header.width;
    th.style.border = '1px solid #ddd';
    headerRow.appendChild(th);
  });
  // ---- Add the two new fixed header columns ----
  // Notes Column: fixed width same as "To Email" (200px)
  const notesTh = document.createElement('th');
  notesTh.textContent = 'Notes';
  notesTh.style.backgroundColor = '#001f3f';
  notesTh.style.color = '#fff';
  notesTh.style.padding = '8px';
  notesTh.style.width = '200px';
  notesTh.style.border = '1px solid #ddd';
  headerRow.appendChild(notesTh);
  // Complete Column: fixed width to accommodate header title (80px)
  const completeTh = document.createElement('th');
  completeTh.textContent = 'Complete';
  completeTh.style.backgroundColor = '#001f3f';
  completeTh.style.color = '#fff';
  completeTh.style.padding = '8px';
  completeTh.style.width = '80px';
  completeTh.style.border = '1px solid #ddd';
  headerRow.appendChild(completeTh);

  // Dynamic header columns: one per layer
  const numLayers = getNumberOfLayers();
  for (let i = 1; i <= numLayers; i++) {
    const th = document.createElement('th');
    th.textContent = 'L' + i;
    th.style.backgroundColor = '#001f3f';
    th.style.color = '#fff';
    th.style.padding = '8px';
    th.style.width = '80px';
    th.style.border = '1px solid #ddd';
    headerRow.appendChild(th);
  }
  // Final header column: Delete
  const deleteTh = document.createElement('th');
  deleteTh.textContent = 'Delete';
  deleteTh.style.backgroundColor = '#001f3f';
  deleteTh.style.color = '#fff';
  deleteTh.style.padding = '8px';
  deleteTh.style.width = '60px';
  deleteTh.style.border = '1px solid #ddd';
  headerRow.appendChild(deleteTh);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // ----- Build Table Body -----
  const tbody = document.createElement('tbody');
  tbody.id = 'marketSheetTableBody';
  table.appendChild(tbody);
  container.appendChild(table);

  // ===== Add Market Button Below the Table =====
  const addMarketButton = document.createElement('button');
  addMarketButton.textContent = 'Add Market';
  addMarketButton.id = 'addMarketButton';
  addMarketButton.style.marginTop = '10px';
  container.appendChild(addMarketButton);

  // Automatically spawn 8 Market rows
  for (let i = 0; i < 8; i++) {
    addMarketRow();
  }

  // Create the initial Total Row
  addTotalRow();

  selectAllCheckbox.addEventListener('change', () => {
    const checkboxes = tbody.querySelectorAll("input[type='checkbox'].rowSelect");
    checkboxes.forEach(cb => (cb.checked = selectAllCheckbox.checked));
  });

  addMarketButton.addEventListener('click', () => {
    addMarketRow();
    applyFilters();
  });

  document.addEventListener('layerTableUpdated', () => {
    updateMarketSheetDynamicColumns();
    applyFilters();
  });

  updateLayerDropdown(filterDropdown);

  // Remove any duplicate Draft Emails buttons by keeping only the first instance.
  const draftButtons = document.querySelectorAll('#draftEmailsButton');
  if (draftButtons.length > 1) {
    for (let i = 1; i < draftButtons.length; i++) {
      draftButtons[i].remove();
    }
  }

  console.log('Market Sheet Table initialized.');
}

function getNumberOfLayers() {
  const layerTableBody = document.getElementById('layerTableBody');
  return layerTableBody ? layerTableBody.rows.length : 0;
}

function formatValue(input) {
  let raw = input.value;
  raw = raw.replace(/[,$%]/g, '');
  let val = parseFloat(raw);
  if (isNaN(val)) return;
  if (window.formatMode === 'Monetary') {
    const currency = window.currencySymbol || '$';
    input.value = currency + Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else if (window.formatMode === 'Percentage') {
    input.value = val.toFixed(4) + '%';
  }
}

function addNavigationPasteListeners(input) {
  input.addEventListener('keydown', function(e) {
    const cell = this.parentElement;
    const row = cell.parentElement;
    const cellIndex = Array.from(row.cells).indexOf(cell);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      let nextRow = row.nextElementSibling;
      while (nextRow && nextRow.id === 'totalRow') {
        nextRow = nextRow.nextElementSibling;
      }
      if (nextRow) {
        const targetCell = nextRow.cells[cellIndex];
        if (targetCell) {
          const targetInput = targetCell.querySelector('input');
          if (targetInput) targetInput.focus();
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevRow = row.previousElementSibling;
      if (prevRow) {
        const targetCell = prevRow.cells[cellIndex];
        if (targetCell) {
          const targetInput = targetCell.querySelector('input');
          if (targetInput) targetInput.focus();
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (cellIndex > 0) {
        const targetCell = row.cells[cellIndex - 1];
        if (targetCell) {
          const targetInput = targetCell.querySelector('input');
          if (targetInput) targetInput.focus();
        }
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (cellIndex < row.cells.length - 1) {
        const targetCell = row.cells[cellIndex + 1];
        if (targetCell) {
          const targetInput = targetCell.querySelector('input');
          if (targetInput) targetInput.focus();
        }
      }
    }
  });

  input.addEventListener('paste', function(e) {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData('text/plain');
    const values = clipboardData.split(/\r?\n/).filter(line => line.trim() !== '');
    const cell = this.parentElement;
    const row = cell.parentElement;
    const cellIndex = Array.from(row.cells).indexOf(cell);
    let currentRow = row;
    for (let i = 0; i < values.length; i++) {
      if (!currentRow || currentRow.id === 'totalRow') break;
      const targetCell = currentRow.cells[cellIndex];
      if (targetCell) {
        const targetInput = targetCell.querySelector('input');
        if (targetInput) {
          targetInput.value = values[i];
          targetInput.dispatchEvent(new Event('input'));
        }
      }
      currentRow = currentRow.nextElementSibling;
    }
  });

  input.addEventListener('blur', function() {
    formatValue(this);
  });
}

function addMarketRow() {
  const tbody = document.getElementById('marketSheetTableBody');
  const totalRow = document.getElementById('totalRow');
  if (totalRow) totalRow.remove();
  const row = document.createElement('tr');

  // Fixed Columns
  // 1) No.
  const cellNo = document.createElement('td');
  cellNo.textContent = tbody.rows.length + 1;
  cellNo.style.textAlign = 'center';
  cellNo.style.border = '1px solid #ddd';
  cellNo.style.padding = '8px';
  row.appendChild(cellNo);
  // 2) Select
  const cellSelect = document.createElement('td');
  cellSelect.style.textAlign = 'center';
  cellSelect.style.border = '1px solid #ddd';
  cellSelect.style.padding = '8px';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'rowSelect';
  checkbox.checked = true;
  cellSelect.appendChild(checkbox);
  addNavigationPasteListeners(checkbox);
  row.appendChild(cellSelect);
  // 3) Market
  const cellMarket = document.createElement('td');
  cellMarket.style.border = '1px solid #ddd';
  cellMarket.style.padding = '8px';
  const inputMarket = document.createElement('input');
  inputMarket.type = 'text';
  inputMarket.placeholder = 'Insurer Name';
  inputMarket.style.width = '100%';
  inputMarket.style.border = 'none';
  inputMarket.style.outline = 'none';
  addNavigationPasteListeners(inputMarket);
  cellMarket.appendChild(inputMarket);
  row.appendChild(cellMarket);
  // 4) Underwriter
  const cellUnderwriter = document.createElement('td');
  cellUnderwriter.style.border = '1px solid #ddd';
  cellUnderwriter.style.padding = '8px';
  const inputUnderwriter = document.createElement('input');
  inputUnderwriter.type = 'text';
  inputUnderwriter.placeholder = 'Recipient First Name';
  inputUnderwriter.style.width = '100%';
  inputUnderwriter.style.border = 'none';
  inputUnderwriter.style.outline = 'none';
  addNavigationPasteListeners(inputUnderwriter);
  cellUnderwriter.appendChild(inputUnderwriter);
  row.appendChild(cellUnderwriter);
  // 5) To Email
  const cellToEmail = document.createElement('td');
  cellToEmail.style.border = '1px solid #ddd';
  cellToEmail.style.padding = '8px';
  const inputToEmail = document.createElement('input');
  inputToEmail.type = 'text';
  inputToEmail.placeholder = 'Email Address';
  inputToEmail.style.width = '100%';
  inputToEmail.style.border = 'none';
  inputToEmail.style.outline = 'none';
  addNavigationPasteListeners(inputToEmail);
  cellToEmail.appendChild(inputToEmail);
  row.appendChild(cellToEmail);
  // 6) CC Email
  const cellCcEmail = document.createElement('td');
  cellCcEmail.style.border = '1px solid #ddd';
  cellCcEmail.style.padding = '8px';
  const inputCcEmail = document.createElement('input');
  inputCcEmail.type = 'text';
  inputCcEmail.placeholder = 'CC Email Addresses';
  inputCcEmail.style.width = '100%';
  inputCcEmail.style.border = 'none';
  inputCcEmail.style.outline = 'none';
  addNavigationPasteListeners(inputCcEmail);
  cellCcEmail.appendChild(inputCcEmail);
  row.appendChild(cellCcEmail);
  // 7) Attach
  const cellAttach = document.createElement('td');
  cellAttach.style.border = '1px solid #ddd';
  cellAttach.style.padding = '8px';
  // Create a redesigned drop zone for files
  const dropZone = document.createElement('div');
  dropZone.className = 'drop-zone';
  dropZone.style.width = '100%';
  dropZone.style.height = '40px';
  dropZone.style.border = '2px dashed #aaa';
  dropZone.style.borderRadius = '4px';
  dropZone.style.padding = '4px';
  dropZone.style.display = 'flex';
  dropZone.style.alignItems = 'center';
  dropZone.style.justifyContent = 'center';
  dropZone.style.backgroundColor = '#f9f9f9';
  dropZone.style.fontSize = '12px';
  dropZone.style.color = '#666';
  dropZone.textContent = 'Drag & drop files here';
  const inputAttach = document.createElement('input');
  inputAttach.type = 'file';
  inputAttach.multiple = true;
  inputAttach.style.display = 'none';
  dropZone.appendChild(inputAttach);
  // Add drag & drop events to dropZone
  dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropZone.style.borderColor = '#333';
  });
  dropZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    dropZone.style.borderColor = '#aaa';
  });
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    dropZone.style.borderColor = '#aaa';
    const files = e.dataTransfer.files;
    let fileNames = [];
    for (let i = 0; i < files.length; i++) {
      fileNames.push(files[i].name);
    }
    dropZone.textContent = fileNames.join(', ');
    // Optionally dispatch event with file list for further processing
  });
  cellAttach.appendChild(dropZone);
  addNavigationPasteListeners(dropZone);
  row.appendChild(cellAttach);
  // --- New Fixed Column: Notes ---
  const cellNotes = document.createElement('td');
  cellNotes.style.border = '1px solid #ddd';
  cellNotes.style.padding = '8px';
  const inputNotes = document.createElement('input');
  inputNotes.type = 'text';
  inputNotes.placeholder = 'Notes';
  inputNotes.style.width = '100%';
  inputNotes.style.border = 'none';
  inputNotes.style.outline = 'none';
  addNavigationPasteListeners(inputNotes);
  cellNotes.appendChild(inputNotes);
  row.appendChild(cellNotes);
  // --- New Fixed Column: Complete ---
  const cellComplete = document.createElement('td');
  cellComplete.style.border = '1px solid #ddd';
  cellComplete.style.padding = '8px';
  cellComplete.style.textAlign = 'center'; // Center the checkbox
  // Create a checkbox for completion.
  const checkboxComplete = document.createElement('input');
  checkboxComplete.type = 'checkbox';
  // When checked, tint the entire row and its input boxes light green.
  checkboxComplete.addEventListener('change', function() {
    if (this.checked) {
      row.style.backgroundColor = 'lightgreen';
      Array.from(row.querySelectorAll('input')).forEach(input => {
        input.style.backgroundColor = 'lightgreen';
      });
    } else {
      row.style.backgroundColor = '';
      Array.from(row.querySelectorAll('input')).forEach(input => {
        input.style.backgroundColor = '';
      });
    }
    // Reapply filters in case the completion filter is active.
    applyFilters();
  });
  cellComplete.appendChild(checkboxComplete);
  row.appendChild(cellComplete);

  // Dynamic Layer Columns
  const numLayers = getNumberOfLayers();
  for (let i = 1; i <= numLayers; i++) {
    const cellLayer = document.createElement('td');
    cellLayer.style.border = '1px solid #ddd';
    cellLayer.style.padding = '8px';
    const inputLayer = document.createElement('input');
    inputLayer.type = 'text';
    inputLayer.value = '';
    inputLayer.style.width = '100%';
    inputLayer.style.border = 'none';
    inputLayer.style.outline = 'none';
    inputLayer.addEventListener('input', updateTotalRow);
    addNavigationPasteListeners(inputLayer);
    cellLayer.appendChild(inputLayer);
    row.appendChild(cellLayer);
  }
  // Final Column: Delete button
  const cellDelete = document.createElement('td');
  cellDelete.style.textAlign = 'center';
  cellDelete.style.border = '1px solid #ddd';
  cellDelete.style.padding = '8px';
  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '&#128465;';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.background = 'none';
  deleteBtn.style.border = 'none';
  deleteBtn.style.fontSize = '16px';
  deleteBtn.addEventListener('click', () => {
    row.remove();
    renumberMarketRows();
    addTotalRow();
  });
  cellDelete.appendChild(deleteBtn);
  row.appendChild(cellDelete);
  tbody.appendChild(row);
  renumberMarketRows();
  addTotalRow();
  applyFilters();
}

function addTotalRow() {
  const tbody = document.getElementById('marketSheetTableBody');
  const existingTotal = document.getElementById('totalRow');
  if (existingTotal) existingTotal.remove();
  const row = document.createElement('tr');
  row.id = 'totalRow';
  // Set the first cell to span the fixed columns (now 9)
  const totalLabelCell = document.createElement('td');
  totalLabelCell.colSpan = FIXED_COL_COUNT;
  totalLabelCell.textContent = 'Total';
  totalLabelCell.style.textAlign = 'center';
  totalLabelCell.style.fontWeight = 'bold';
  totalLabelCell.style.border = '1px solid #ddd';
  totalLabelCell.style.padding = '8px';
  row.appendChild(totalLabelCell);
  const numLayers = getNumberOfLayers();
  for (let i = 1; i <= numLayers; i++) {
    const totalCell = document.createElement('td');
    totalCell.textContent = '0';
    totalCell.style.textAlign = 'center';
    totalCell.style.border = '1px solid #ddd';
    totalCell.style.padding = '8px';
    row.appendChild(totalCell);
  }
  const emptyCell = document.createElement('td');
  emptyCell.style.border = '1px solid #ddd';
  emptyCell.style.padding = '8px';
  row.appendChild(emptyCell);
  tbody.appendChild(row);
}

function updateMarketSheetDynamicColumns() {
  const table = document.getElementById('marketSheetTable');
  const thead = table.querySelector('thead');
  const headerRow = thead.rows[0];
  // Remove previous dynamic columns.
  // Fixed columns now include FIXED_COL_COUNT (9) + Delete = 10 cells.
  while (headerRow.cells.length > (FIXED_COL_COUNT + 1)) {
    headerRow.deleteCell(FIXED_COL_COUNT);
  }
  const deleteCell = headerRow.cells[headerRow.cells.length - 1];
  const numLayers = getNumberOfLayers();
  for (let i = 1; i <= numLayers; i++) {
    const th = document.createElement('th');
    th.textContent = 'L' + i;
    th.style.backgroundColor = '#001f3f';
    th.style.color = '#fff';
    th.style.padding = '8px';
    th.style.width = '80px';
    th.style.border = '1px solid #ddd';
    headerRow.insertBefore(th, deleteCell);
  }
  const tbody = document.getElementById('marketSheetTableBody');
  for (let i = 0; i < tbody.rows.length; i++) {
    const row = tbody.rows[i];
    if (row.id === 'totalRow') continue;
    while (row.cells.length > (FIXED_COL_COUNT + 1)) {
      row.deleteCell(FIXED_COL_COUNT);
    }
    const deleteCellInRow = row.cells[row.cells.length - 1];
    for (let j = 1; j <= numLayers; j++) {
      const td = document.createElement('td');
      td.style.border = '1px solid #ddd';
      td.style.padding = '8px';
      const input = document.createElement('input');
      input.type = 'text';
      input.value = '';
      input.style.width = '100%';
      input.style.border = 'none';
      input.style.outline = 'none';
      input.addEventListener('input', updateTotalRow);
      addNavigationPasteListeners(input);
      td.appendChild(input);
      row.insertBefore(td, deleteCellInRow);
    }
  }
  addTotalRow();
  const filterDropdown = document.getElementById('filterLayerSelect');
  if (filterDropdown) {
    updateLayerDropdown(filterDropdown);
  }
  applyFilters();
}

function updateTotalRow() {
  const tbody = document.getElementById('marketSheetTableBody');
  const totalRow = document.getElementById('totalRow');
  if (!totalRow) return;
  const numLayers = getNumberOfLayers();
  const totals = new Array(numLayers).fill(0);
  // For each market row, sum the dynamic layer column values.
  for (let i = 0; i < tbody.rows.length; i++) {
    const row = tbody.rows[i];
    if (row.id === 'totalRow') continue;
    for (let j = 0; j < numLayers; j++) {
      // Dynamic layer cells now begin at index FIXED_COL_COUNT
      const cellIndex = FIXED_COL_COUNT + j;
      const cell = row.cells[cellIndex];
      if (cell) {
        const input = cell.querySelector('input');
        if (input) {
          const raw = input.value.replace(/[,$%]/g, '');
          const val = parseFloat(raw);
          if (!isNaN(val)) {
            totals[j] += val;
          }
        }
      }
    }
  }
  for (let j = 0; j < numLayers; j++) {
    // total row cells: dynamic layer total cells start at index 1 (after the total label spanning FIXED_COL_COUNT).
    const cell = totalRow.cells[j + 1];
    if (window.formatMode === 'Monetary') {
      const currency = window.currencySymbol || '$';
      cell.textContent = currency + totals[j].toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      cell.textContent = totals[j].toFixed(4) + '%';
    }
  }
}

function renumberMarketRows() {
  const tbody = document.getElementById('marketSheetTableBody');
  const rows = tbody.getElementsByTagName('tr');
  let counter = 1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].id === 'totalRow') continue;
    rows[i].cells[0].textContent = counter++;
  }
}

function updateLayerDropdown(dropdown) {
  while (dropdown.options.length > 1) {
    dropdown.remove(1);
  }
  const numLayers = getNumberOfLayers();
  for (let i = 1; i <= numLayers; i++) {
    const option = document.createElement('option');
    option.value = 'L' + i;
    option.textContent = 'L' + i;
    dropdown.appendChild(option);
  }
}

// New combined filter function for both Layer and Completion filters.
function applyFilters() {
  const filterLayerSelect = document.getElementById('filterLayerSelect');
  const filterCompletionSelect = document.getElementById('filterCompletionSelect');
  const selectedLayer = filterLayerSelect ? filterLayerSelect.value : 'all';
  const selectedCompletion = filterCompletionSelect ? filterCompletionSelect.value : 'all';
  const tbody = document.getElementById('marketSheetTableBody');
  Array.from(tbody.rows).forEach(row => {
    if (row.id === 'totalRow') return;
    let show = true;
    // Apply layer filter if not "all".
    if (selectedLayer !== 'all') {
      const layerNum = parseInt(selectedLayer.replace('L', ''));
      const colIndex = FIXED_COL_COUNT + (layerNum - 1);
      const cell = row.cells[colIndex];
      if (cell) {
        const input = cell.querySelector('input');
        let val = input ? parseFloat(input.value.replace(/[,$%]/g, '')) : 0;
        if (isNaN(val) || val <= 0) {
          show = false;
        }
      }
    }
    // Apply completion filter if not "all".
    if (selectedCompletion !== 'all') {
      // The complete checkbox is in the 9th cell (index 8)
      const completeCell = row.cells[8];
      let isComplete = false;
      if (completeCell) {
        const checkbox = completeCell.querySelector("input[type='checkbox']");
        if (checkbox) isComplete = checkbox.checked;
      }
      if (selectedCompletion === 'completed' && !isComplete) show = false;
      if (selectedCompletion === 'non-completed' && isComplete) show = false;
    }
    row.style.display = show ? '' : 'none';
  });
}

document.getElementById('draftEmailsButton').addEventListener('click', function() {
  // Hide the Market Sheet Tab
  document.getElementById('tabMarketSheet').classList.remove('active');
  // Show the Email Drafting Tab
  document.getElementById('emailDraftingTabContainer').classList.add('active');
});
