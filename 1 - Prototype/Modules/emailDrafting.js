// modules/emailDrafting.js

function loadEmailDraftingTab() {
  const container = document.getElementById('emailDraftingTabContainer');
  if (!container) {
    console.error('Email Drafting Tab container not found!');
    return;
  }

  container.innerHTML = `
    <div id="emailDraftingContent">
      <div id="emailDraftingPart1">
        <div class="email-title-container">
          <input 
            type="text" 
            id="emailTitle" 
            placeholder="Enter Email Title Here" 
            style="width:500px; font-size:24px; padding:10px; border:1px solid #ccc; border-radius:4px;"
          />
        </div>

        <div class="gap" style="height:20px;"></div>

        <div style="display: flex; gap: 10px;">
          <button id="insertNamePlaceholder" style="padding: 5px 10px; font-size: 16px;">Name</button>
          <button id="insertSignedLinesPlaceholder" style="padding: 5px 10px; font-size: 16px;">Signed Lines</button>
          <button id="insertMarketPlaceholder" style="padding: 5px 10px; font-size: 16px;">Market</button>
        </div>

        <div class="gap" style="height:20px;"></div>

        <div>
          <label for="wordingSelect" style="font-size: 16px;">Select Wording:</label>
          <select id="wordingSelect" style="padding: 5px 10px; font-size: 16px;">
            <option value="">-- Select Wording --</option>
            <!-- Options will be populated dynamically -->
          </select>
        </div>

        <div class="gap" style="height:20px;"></div>

        <div class="email-content-container">
          <textarea 
            id="unifiedEmailContent" 
            placeholder="Type your email here. Use [Name], [Signed Lines], [Market] where applicable..." 
            style="width:1000px; height:250px; font-size:18px; padding:8px; border:1px solid #ccc; border-radius:4px;"
          ></textarea>
        </div>
      </div>
    </div>
  `;

  const nameButton = document.getElementById('insertNamePlaceholder');
  const signedLinesButton = document.getElementById('insertSignedLinesPlaceholder');
  const marketButton = document.getElementById('insertMarketPlaceholder');
  const emailTextarea = document.getElementById('unifiedEmailContent');
  const wordingSelect = document.getElementById('wordingSelect');

  // Insert at cursor position function
  const insertAtCursor = (textarea, text) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.setRangeText(text, start, end, 'end');
    textarea.focus();
  };

  nameButton.addEventListener('click', () => {
    insertAtCursor(emailTextarea, '[Name]');
  });

  signedLinesButton.addEventListener('click', () => {
    insertAtCursor(emailTextarea, '[Signed Lines]');
  });

  marketButton.addEventListener('click', () => {
    insertAtCursor(emailTextarea, '[Market]');
  });

  // Populate the Wording dropdown with saved wordings
  const populateWordingDropdown = () => {
    const savedWordings = loadSavedWordings();
    savedWordings.forEach(wording => {
      const option = document.createElement('option');
      option.value = wording.title;
      option.textContent = wording.title;
      wordingSelect.appendChild(option);
    });
  };

  // Load saved wordings from local storage
  const loadSavedWordings = () => {
    return JSON.parse(localStorage.getItem('wordings') || '[]');
  };

  // Update email content with selected wording
  wordingSelect.addEventListener('change', (e) => {
    const selectedWording = e.target.value;
    const wordings = loadSavedWordings();
    const selected = wordings.find(w => w.title === selectedWording);
    if (selected) {
      emailTextarea.value = selected.content;
    }
  });

  // Load wordings on initialization
  populateWordingDropdown();
}

function setupDraftEmailsButton() {
  const draftBtn = document.getElementById('draftEmailsButton');
  if (!draftBtn) {
    console.error('Draft Emails button not found!');
    return;
  }
  draftBtn.addEventListener('click', function() {
    const marketTab = document.getElementById('tabMarketSheet');
    const emailTab = document.getElementById('emailDraftingTabContainer');
    if (marketTab && emailTab) {
      marketTab.classList.remove('active');
      emailTab.classList.add('active');
      window.scrollTo(0, 0);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadEmailDraftingTab();
    setupDraftEmailsButton();
  });
} else {
  loadEmailDraftingTab();
  setupDraftEmailsButton();
}
