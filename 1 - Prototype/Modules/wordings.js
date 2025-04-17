// modules/wordings.js

// Standalone wordings page script

document.addEventListener('DOMContentLoaded', () => {
    // Element references
    const tableBody      = document.querySelector('#wordingsTable tbody');
    const titleInput     = document.getElementById('wordingTitle');
    const contentInput   = document.getElementById('wordingContent');
    const phNameBtn      = document.getElementById('phName');
    const phSignedBtn    = document.getElementById('phSigned');
    const phMarketBtn    = document.getElementById('phMarket');
    const phCustomBtn    = document.getElementById('phCustom');
    const saveBtn        = document.getElementById('saveWording');
    let editIndex        = null;
  
    // Utility: load and save
    const STORAGE_KEY = 'wordings';
    function loadList() {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }
    function saveList(list) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  
    // Insert placeholder at cursor position
    function insertPlaceholder(text) {
      const ta = contentInput;
      const start = ta.selectionStart;
      ta.setRangeText(text, start, ta.selectionEnd, 'end');
      ta.focus();
    }
  
    // Refresh table display
    function refreshTable() {
      const list = loadList();
      tableBody.innerHTML = '';
      list.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.title}</td>
          <td><button onclick="editWording(${idx})">Edit</button></td>
          <td><span class="delete-icon" onclick="deleteWording(${idx})">&#128465;</span></td>
        `;
        tableBody.appendChild(tr);
      });
    }
  
    // Clear form inputs
    function clearForm() {
      titleInput.value = '';
      contentInput.value = '';
      contentInput.value = '';
      editIndex = null;
    }
  
    // Expose global edit and delete handlers
    window.editWording = function(idx) {
      const list = loadList();
      const w = list[idx];
      titleInput.value   = w.title;
      contentInput.value = w.content;
      editIndex = idx;
    };
  
    window.deleteWording = function(idx) {
      if (!confirm('Delete this wording?')) return;
      const list = loadList();
      list.splice(idx, 1);
      saveList(list);
      refreshTable();
      clearForm();
    };
  
    // Save button behavior
    saveBtn.addEventListener('click', () => {
      const title   = titleInput.value.trim();
      const content = contentInput.value.trim();
      if (!title || !content) {
        alert('Please fill in both a title and content.');
        return;
      }
      const list = loadList();
      if (editIndex !== null) {
        list[editIndex] = { title, content };
      } else {
        list.push({ title, content });
      }
      saveList(list);
      refreshTable();
      clearForm();
    });
  
    // Placeholder buttons
    phNameBtn.onclick   = () => insertPlaceholder('[Name]');
    phSignedBtn.onclick = () => insertPlaceholder('[Signed Lines]');
    phMarketBtn.onclick = () => insertPlaceholder('[Market]');
    phCustomBtn.onclick = () => insertPlaceholder('[Custom]');
  
    // Initial render
    refreshTable();
  });
  