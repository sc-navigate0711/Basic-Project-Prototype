// modules/emailPreview.js

let currentMarketFilter = 'all';

function setupPreviewEmailsButton() {
  let previewButton = document.getElementById('previewEmailsButton');
  if (!previewButton) {
    previewButton = document.createElement('button');
    previewButton.id = 'previewEmailsButton';
    previewButton.textContent = 'Preview Emails';
    previewButton.style.marginBottom = '20px';
    const container = document.getElementById('emailDraftingTabContainer');
    container.appendChild(previewButton);
  }
  previewButton.addEventListener('click', generateEmailPreviews);
}

function createMarketFilterDropdown(container, uniqueMarkets) {
  let marketFilter = document.getElementById('marketFilterSelect');
  if (!marketFilter) {
    marketFilter = document.createElement('select');
    marketFilter.id = 'marketFilterSelect';
    marketFilter.style.width = '200px';
    marketFilter.style.padding = '5px';
    marketFilter.style.marginBottom = '10px';
    container.appendChild(marketFilter);
  }

  marketFilter.innerHTML = '';
  const defaultOpt = document.createElement('option');
  defaultOpt.value = 'all';
  defaultOpt.textContent = 'All Markets';
  marketFilter.appendChild(defaultOpt);

  uniqueMarkets.forEach(market => {
    const opt = document.createElement('option');
    opt.value = market;
    opt.textContent = market;
    marketFilter.appendChild(opt);
  });

  marketFilter.value = currentMarketFilter;

  marketFilter.addEventListener('change', (e) => {
    currentMarketFilter = e.target.value;
    generateEmailPreviews();
  });
}

function generateEmailPreviews() {
  let previewContainer = document.getElementById('emailPreviewContainer');
  if (!previewContainer) {
    previewContainer = document.createElement('div');
    previewContainer.id = 'emailPreviewContainer';
    const emailTab = document.getElementById('emailDraftingTabContainer');
    emailTab.appendChild(previewContainer);
  }
  previewContainer.innerHTML = '';

  const containerWrapper = document.createElement('div');
  containerWrapper.style.display = 'flex';
  containerWrapper.style.justifyContent = 'space-between';
  containerWrapper.style.alignItems = 'flex-start';
  containerWrapper.style.marginBottom = '10px';
  containerWrapper.style.width = '80%';

  const leftControl = document.createElement('div');
  leftControl.textContent = 'Email Previews:';
  leftControl.style.fontWeight = 'bold';

  const rightControls = document.createElement('div');
  rightControls.style.display = 'flex';
  rightControls.style.flexDirection = 'column';
  rightControls.style.alignItems = 'flex-end';

  const sendBtn = document.createElement('button');
  sendBtn.id = 'sendSelectedEmailsButton';
  sendBtn.textContent = 'Send Selected Emails';
  sendBtn.style.marginBottom = '10px';
  rightControls.appendChild(sendBtn);

  const uniqueMarkets = new Set();
  const tbody = document.getElementById('marketSheetTableBody');
  const rows = Array.from(tbody?.getElementsByTagName('tr')).filter(row => row.id !== 'totalRow');

  rows.forEach(row => {
    const checkbox = row.querySelector("input[type='checkbox'].rowSelect");
    if (!checkbox || !checkbox.checked) return;
    const marketName = row.cells[2]?.querySelector('input')?.value.trim();
    if (marketName) uniqueMarkets.add(marketName);
  });

  createMarketFilterDropdown(rightControls, uniqueMarkets);
  containerWrapper.appendChild(leftControl);
  containerWrapper.appendChild(rightControls);
  previewContainer.appendChild(containerWrapper);

  const headerDiv = document.createElement('div');
  headerDiv.style.display = 'flex';
  headerDiv.style.justifyContent = 'space-between';
  headerDiv.style.alignItems = 'center';
  headerDiv.style.marginBottom = '10px';
  headerDiv.style.width = '80%';

  const selectAllLabel = document.createElement('label');
  selectAllLabel.textContent = 'Select All: ';
  const selectAllCheckbox = document.createElement('input');
  selectAllCheckbox.type = 'checkbox';
  selectAllCheckbox.style.marginRight = '5px';
  selectAllLabel.prepend(selectAllCheckbox);
  headerDiv.appendChild(selectAllLabel);
  previewContainer.appendChild(headerDiv);

  selectAllCheckbox.addEventListener('change', function () {
    const allPreviewCheckboxes = previewContainer.querySelectorAll('.preview-checkbox');
    allPreviewCheckboxes.forEach(cb => {
      cb.checked = this.checked;
    });
  });

  // 🔄 New Email Content TextArea (single input with placeholders)
  const emailTitle = document.getElementById('emailTitle').value.trim();
  const unifiedContent = document.getElementById('unifiedEmailContent')?.value.trim() || '';

  const attachmentAll = document.querySelector("#smallTable tr:nth-child(1) td:nth-child(2) input")?.value.trim() || '';
  const ccAll = document.querySelector("#smallTable tr:nth-child(2) td:nth-child(2) input")?.value.trim() || '';

  const layerTitles = Array.from(document.querySelectorAll('#layerTableBody tr')).map(row => row.cells[1]?.querySelector('input')?.value.trim());

  rows.forEach((row, rowIndex) => {
    const checkbox = row.querySelector("input[type='checkbox'].rowSelect");
    if (!checkbox || !checkbox.checked) return;

    const marketName = row.cells[2]?.querySelector('input')?.value.trim();
    if (currentMarketFilter !== 'all' && currentMarketFilter !== marketName) return;

    const underwriter = row.cells[3]?.querySelector('input')?.value.trim();
    const toEmail = row.cells[4]?.querySelector('input')?.value.trim();
    const ccEmail = row.cells[5]?.querySelector('input')?.value.trim();
    const attachZone = row.cells[6]?.querySelector('div.drop-zone');
    const rowAttachments = attachZone ? attachZone.textContent.trim() : '';

    const subject = emailTitle ? `${emailTitle} - ${marketName}` : marketName;
    const combinedCC = ccAll ? (ccEmail ? `${ccEmail}, ${ccAll}` : ccAll) : ccEmail;
    let combinedAttachments = attachmentAll ? (rowAttachments ? `${rowAttachments}, ${attachmentAll}` : attachmentAll) : rowAttachments;

    // 🔁 Build Signed Line List for this market
    const signedLineList = [];
    for (let i = 0; i < layerTitles.length; i++) {
      const cell = row.cells[9 + i];
      const input = cell?.querySelector('input');
      const value = input?.value.trim();
      if (value && value !== '0' && value !== '0.00%' && value !== '$0.00') {
        const title = layerTitles[i] || `Layer ${i + 1}`;
        signedLineList.push(`${title}: ${value}`);
        const layerAttach = document.querySelector(`#layerTableBody tr:nth-child(${i + 1}) td:nth-child(3) input`)?.value.trim();
        if (layerAttach) {
          combinedAttachments += combinedAttachments ? `, ${layerAttach}` : layerAttach;
        }
      }
    }
    const signedLineText = signedLineList.length > 0 ? signedLineList.join('\n') : '';

    // 🔄 Replace placeholders
    const body = unifiedContent
      .replace(/\[Name\]/gi, underwriter)
      .replace(/\[Signed Lines\]/gi, signedLineText)
      .replace(/\[Market\]/gi, marketName); // Added Market placeholder

    const card = document.createElement('div');
    card.className = 'email-preview-card';
    card.style.border = '1px solid #ccc';
    card.style.padding = '10px';
    card.style.marginBottom = '10px';
    card.style.width = '80%';
    card.style.borderRadius = '4px';
    card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    card.style.marginLeft = '0';

    const previewCheckbox = document.createElement('input');
    previewCheckbox.type = 'checkbox';
    previewCheckbox.className = 'preview-checkbox';
    card.appendChild(previewCheckbox);

    const subjectInput = document.createElement('input');
    subjectInput.type = 'text';
    subjectInput.value = subject;
    subjectInput.style.width = '100%';
    subjectInput.style.fontSize = '18px';
    subjectInput.style.margin = '5px 0';
    subjectInput.style.padding = '5px';
    card.appendChild(subjectInput);

    const toInput = document.createElement('input');
    toInput.type = 'text';
    toInput.value = toEmail;
    toInput.placeholder = 'To:';
    toInput.style.width = '100%';
    toInput.style.margin = '5px 0';
    toInput.style.padding = '5px';
    card.appendChild(toInput);

    const ccInput = document.createElement('input');
    ccInput.type = 'text';
    ccInput.value = combinedCC;
    ccInput.placeholder = 'CC:';
    ccInput.style.width = '100%';
    ccInput.style.margin = '5px 0';
    ccInput.style.padding = '5px';
    card.appendChild(ccInput);

    const contentTextarea = document.createElement('textarea');
    contentTextarea.value = body;
    contentTextarea.placeholder = 'Email Content';
    contentTextarea.style.width = '100%';
    contentTextarea.style.height = '150px';
    contentTextarea.style.margin = '5px 0';
    contentTextarea.style.padding = '5px';
    card.appendChild(contentTextarea);

    const attachmentsDiv = document.createElement('div');
    attachmentsDiv.textContent = 'Attachments: ' + combinedAttachments;
    attachmentsDiv.style.fontSize = '14px';
    attachmentsDiv.style.margin = '5px 0';
    card.appendChild(attachmentsDiv);

    previewContainer.appendChild(card);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupPreviewEmailsButton);
} else {
  setupPreviewEmailsButton();
}
