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
        </div>

        <div class="gap" style="height:20px;"></div>

        <div class="email-content-container">
          <textarea 
            id="unifiedEmailContent" 
            placeholder="Type your email here. Use [Name] and [Signed Lines] where applicable..." 
            style="width:1000px; height:250px; font-size:18px; padding:8px; border:1px solid #ccc; border-radius:4px;"
          ></textarea>
        </div>
      </div>
    </div>
  `;

  const nameButton = document.getElementById('insertNamePlaceholder');
  const signedLinesButton = document.getElementById('insertSignedLinesPlaceholder');
  const emailTextarea = document.getElementById('unifiedEmailContent');

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
