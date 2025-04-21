// modules/emailArchive.js

function loadEmailArchiveTab() {
    const container = document.getElementById('tabEmailArchive');
    container.innerHTML = '';
    const archive = JSON.parse(localStorage.getItem('archivedMailGroups') || '[]');
    
    archive.forEach((g,i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'mail-table-container';
  
      const h = document.createElement('div');
      h.className = 'mail-table-header';
      h.textContent = g.title;
      h.style.marginBottom = '20px';
      wrapper.appendChild(h);
  
      // no need for filters if you don’t want them here,
      // or clone filter UI from mailMonitoring…
  
      const table = document.createElement('table');
      table.className = 'mail-table';
      table.innerHTML = `
        <thead>
          <tr>
            <th>No.</th><th>Select</th><th>Market</th><th>Notes</th><th>Inbox</th><th>Complete</th>
          </tr>
        </thead>
        <tbody>
          ${g.emails.map((em,idx) => `
            <tr data-arch="${i}" style="${em.complete?'background:lightgreen':''}">
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
  
      const act = document.createElement('div');
      act.className = 'mail-table-actions';
      const unarchiveBtn = document.createElement('button');
      unarchiveBtn.textContent = 'Unarchive';
      unarchiveBtn.onclick = () => {
        let archive = JSON.parse(localStorage.getItem('archivedMailGroups'));
        let mail = JSON.parse(localStorage.getItem('mailGroups')||'[]');
        mail.push(archive.splice(i,1)[0]);
        localStorage.setItem('archivedMailGroups', JSON.stringify(archive));
        localStorage.setItem('mailGroups', JSON.stringify(mail));
        loadEmailArchiveTab();
      };
      act.appendChild(unarchiveBtn);
      wrapper.appendChild(act);
  
      // tint on complete
      wrapper.querySelectorAll('.complete-checkbox').forEach(cb => {
        cb.onchange = e => {
          const row = e.target.closest('tr');
          const shade = e.target.checked?'lightgreen':'';
          row.style.background = shade;
          row.querySelectorAll('textarea').forEach(ta=>ta.style.background=shade);
          // update storage
          const ai = +row.dataset.arch;
          let arc = JSON.parse(localStorage.getItem('archivedMailGroups'));
          arc[ai].emails[+row.dataset.email].complete = e.target.checked;
          localStorage.setItem('archivedMailGroups', JSON.stringify(arc));
        };
      });
  
      container.appendChild(wrapper);
    });
  }
  
  if (document.readyState==='loading') {
    document.addEventListener('DOMContentLoaded', loadEmailArchiveTab);
  } else {
    loadEmailArchiveTab();
  }
  