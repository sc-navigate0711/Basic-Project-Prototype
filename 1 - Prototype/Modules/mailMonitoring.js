// modules/mailMonitoring.js

function loadMailMonitoringTab() {
  const container = document.getElementById('tabMailMonitoring');
  container.innerHTML = '';

  // load or initialize groups
  let mailGroups = JSON.parse(localStorage.getItem('mailGroups') || 'null');
  if (!mailGroups) {
    mailGroups = [
      { title: 'Email Group 1', emails: [
          { market:'Market A', notes:'', inbox:'Email 1…', complete:false },
          { market:'Market B', notes:'', inbox:'Email 2…', complete:false }
        ]
      }
    ];
    localStorage.setItem('mailGroups', JSON.stringify(mailGroups));
  }

  mailGroups.forEach((group, gi) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'mail-table-container';

    // Title
    const h = document.createElement('div');
    h.className = 'mail-table-header';
    h.textContent = group.title;
    wrapper.appendChild(h);

    // Filters
    const filters = document.createElement('div');
    filters.className = 'filters-container';
    filters.innerHTML = `
      <select class="filter-market">
        <option value="all">All Markets</option>
        ${[...new Set(group.emails.map(e=>e.market))]
          .map(m=>`<option value="${m}">${m}</option>`).join('')}
      </select>
      <select class="filter-complete">
        <option value="all">All</option>
        <option value="complete">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>
      <select class="sort-select">
        <option value="az">A – Z</option>
        <option value="za">Z – A</option>
        <option value="recent">Recent</option>
      </select>
    `;
    wrapper.appendChild(filters);

    // Table
    const table = document.createElement('table');
    table.className = 'mail-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>No.</th><th>Select</th><th>Market</th><th>Notes</th><th>Inbox</th><th>Complete</th>
        </tr>
      </thead>
      <tbody>
        ${group.emails.map((em, idx) => `
          <tr data-g="${gi}" data-e="${idx}" style="${em.complete?'background:lightgreen':''}">
            <td class="center">${idx+1}</td>
            <td><input type="checkbox" class="select-email"></td>
            <td>${em.market}</td>
            <td><textarea class="notes-input">${em.notes}</textarea></td>
            <td><button class="expand-inbox">Expand</button></td>
            <td><input type="checkbox" class="complete-checkbox" ${em.complete?'checked':''}></td>
          </tr>
        `).join('')}
      </tbody>
    `;
    wrapper.appendChild(table);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'mail-table-actions';
    actions.innerHTML = `
      <button class="reply-selected">Reply Selected</button>
      <button class="archive-group">Archive</button>
    `;
    wrapper.appendChild(actions);

    container.appendChild(wrapper);

    // Listeners
    setupGroupListeners(wrapper, group);
  });
}

function setupGroupListeners(wrapper, group) {
  const gi = Array.from(document.querySelectorAll('.mail-table-container'))
    .indexOf(wrapper);

  // Complete tint
  wrapper.querySelectorAll('.complete-checkbox').forEach(cb => {
    cb.onchange = e => {
      const row = e.target.closest('tr');
      const shade = e.target.checked ? 'lightgreen' : '';
      row.style.background = shade;
      row.querySelector('textarea').style.background = shade;
      // save
      let mg = JSON.parse(localStorage.getItem('mailGroups'));
      mg[gi].emails[row.dataset.e].complete = e.target.checked;
      localStorage.setItem('mailGroups', JSON.stringify(mg));
    };
  });

  // Archive button
  wrapper.querySelector('.archive-group').onclick = () => {
    let mg = JSON.parse(localStorage.getItem('mailGroups'));
    let arc = JSON.parse(localStorage.getItem('archivedMailGroups')||'[]');
    arc.push(mg.splice(gi,1)[0]);
    localStorage.setItem('mailGroups', JSON.stringify(mg));
    localStorage.setItem('archivedMailGroups', JSON.stringify(arc));
    loadMailMonitoringTab();
  };

  // Reply Selected
  wrapper.querySelector('.reply-selected').onclick = () => {
    // gather selected indices…
    alert('Reply to selected');
  };

  // Filter / Sort
  const apply = () => {
    let rows = Array.from(wrapper.querySelectorAll('tbody tr'));
    const mf = wrapper.querySelector('.filter-market').value;
    const cf = wrapper.querySelector('.filter-complete').value;
    const sf = wrapper.querySelector('.sort-select').value;

    // filter
    rows.forEach(row => {
      const emarket = row.cells[2].textContent;
      const ecomplete = row.querySelector('.complete-checkbox').checked;
      let ok = true;
      if (mf!=='all' && emarket!==mf) ok=false;
      if (cf==='complete' && !ecomplete) ok=false;
      if (cf==='incomplete' && ecomplete) ok=false;
      row.style.display = ok?'':'none';
    });

    // sort simple A–Z / Z–A
    if (sf==='az'||sf==='za') {
      const tb = wrapper.querySelector('tbody');
      rows = rows.sort((a,b)=>{
        const tA=a.cells[2].textContent, tB=b.cells[2].textContent;
        return sf==='az' ? tA.localeCompare(tB) : tB.localeCompare(tA);
      });
      rows.forEach(r=>tb.appendChild(r));
    }
    // 'recent' no-op in this mock
  };
  wrapper.querySelectorAll('.filter-market, .filter-complete, .sort-select')
    .forEach(el=>el.onchange=apply);
}

if (document.readyState==='loading') {
  document.addEventListener('DOMContentLoaded', loadMailMonitoringTab);
} else {
  loadMailMonitoringTab();
}
