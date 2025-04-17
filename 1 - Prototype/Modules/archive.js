// modules/archive.js

document.addEventListener('DOMContentLoaded', () => {
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const searchIn  = document.getElementById('searchArchiveInput');
    const sortSel   = document.getElementById('sortArchiveSelect');
    const filterSel = document.getElementById('filterArchiveYearSelect');
    const tbody     = document.querySelector('#archiveTable tbody');
  
    function save() {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  
    function populateYearFilter() {
      const years = new Set(
        projects.filter(p => p.archived).map(p => p.year)
      );
      filterSel.innerHTML = '<option value="all">All</option>';
      Array.from(years).sort().forEach(y => {
        filterSel.appendChild(new Option(y, y));
      });
    }
  
    function render() {
      const st = searchIn.value.toLowerCase();
      const so = sortSel.value;
      const yf = filterSel.value;
      let list = projects.filter(p => p.archived);
      if (yf !== 'all') list = list.filter(p => String(p.year) === yf);
      list = list.filter(p => p.name.toLowerCase().includes(st));
      list.sort((a, b) =>
        so === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
  
      tbody.innerHTML = '';
      list.forEach(p => {
        const idx = projects.findIndex(proj => proj === p);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.name}</td>
          <td style="text-align:center">${p.unreadCount || 0}</td>
          <td><button onclick="openProj(${idx})">Open</button></td>
          <td><button onclick="unarchiveProj(${idx})">Unarchive</button></td>
          <td>
            <span class="delete-icon" onclick="deleteProj(${idx})" title="Delete">
              &#128465;
            </span>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  
    window.openProj = idx => {
      sessionStorage.setItem('currentProject', idx);
      location.href = 'index.html?skipRedirect=true#marketSheet';
    };
    window.unarchiveProj = idx => {
      projects[idx].archived = false;
      save();
      populateYearFilter();
      render();
    };
    window.deleteProj = idx => {
      if (confirm('Delete this project permanently?')) {
        projects.splice(idx, 1);
        save();
        populateYearFilter();
        render();
      }
    };
  
    const debounce = (fn, ms) => {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
      };
    };
  
    searchIn.addEventListener('input', debounce(render, 300));
    sortSel.addEventListener('change', render);
    filterSel.addEventListener('change', render);
  
    populateYearFilter();
    render();
  });
  