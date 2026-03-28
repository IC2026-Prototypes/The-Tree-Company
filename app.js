// App.js - TenderTree Interactive Functionality

// FILTER & SORT FUNCTIONS
function filterTenders() {
  const searchInput = document.getElementById('tenderSearch');
  const cards = document.querySelectorAll('.tender-card');
  const query = searchInput.value.toLowerCase();

  cards.forEach(card => {
    const title = card.querySelector('.tc-title').textContent.toLowerCase();
    const desc = card.querySelector('.tc-desc').textContent.toLowerCase();

    if (title.includes(query) || desc.includes(query)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

function setFilter(category, element) {
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
  element.classList.add('active');

  const cards = document.querySelectorAll('.tender-card');
  cards.forEach(card => {
    if (category === 'all') {
      card.style.display = '';
    } else {
      card.style.display = card.dataset.category === category ? '' : 'none';
    }
  });
}

function sortTenders(sortBy) {
  const grid = document.getElementById('tenderGrid');
  const cards = Array.from(grid.querySelectorAll('.tender-card'));

  cards.sort((a, b) => {
    switch(sortBy) {
      case 'value-high':
        return parseInt(b.dataset.value) - parseInt(a.dataset.value);
      case 'value-low':
        return parseInt(a.dataset.value) - parseInt(b.dataset.value);
      case 'closing':
        // Default order (closing soon first)
        return 0;
      default:
        return 0;
    }
  });

  cards.forEach(card => grid.appendChild(card));
}

// PROPOSAL GENERATION
function startGeneration() {
  const generateBtn = document.getElementById('generateBtn');
  const previewEmpty = document.getElementById('previewEmpty');
  const previewGenerating = document.getElementById('previewGenerating');
  const previewDoc = document.getElementById('previewDoc');
  const previewActions = document.getElementById('previewActions');
  const progressFill = document.getElementById('progressFill');
  const genStatusText = document.getElementById('genStatusText');

  if (!previewGenerating || !previewEmpty || !previewDoc) return;

  // Hide empty, show generating
  previewEmpty.style.display = 'none';
  previewGenerating.style.display = 'flex';
  previewDoc.style.display = 'none';
  generateBtn.disabled = true;

  // Simulate generation steps
  const steps = [
    { status: 'Analysing tender requirements…', progress: 15 },
    { status: 'Extracting key deliverables…', progress: 35 },
    { status: 'Matching company qualifications…', progress: 55 },
    { status: 'Generating executive summary…', progress: 75 },
    { status: 'Compiling pricing schedule…', progress: 90 },
    { status: 'Finalizing proposal…', progress: 100 }
  ];

  let stepIndex = 0;

  const stepInterval = setInterval(() => {
    if (stepIndex < steps.length) {
      genStatusText.textContent = steps[stepIndex].status;
      progressFill.style.width = steps[stepIndex].progress + '%';
      stepIndex++;
    } else {
      clearInterval(stepInterval);

      // Show completed preview
      setTimeout(() => {
        previewGenerating.style.display = 'none';
        previewDoc.style.display = 'block';
        previewActions.style.display = 'flex';
        generateBtn.disabled = false;
      }, 500);
    }
  }, 400);
}

function downloadProposal() {
  alert('Download functionality would generate a professional PDF in production. This is a prototype.');
}

// PROPOSALS PIPELINE
function setPTab(tab, element) {
  document.querySelectorAll('.p-tab').forEach(t => t.classList.remove('active'));
  element.classList.add('active');

  const rows = document.querySelectorAll('.prop-row');
  rows.forEach(row => {
    if (tab === 'all') {
      row.style.display = '';
    } else {
      row.style.display = row.dataset.status === tab ? '' : 'none';
    }
  });
}

function markSubmitted(button) {
  const row = button.closest('.prop-row');
  const statusCell = row.querySelector('.status-badge');

  statusCell.textContent = 'Submitted';
  statusCell.className = 'status-badge submitted';

  const actions = row.querySelector('.prop-actions');
  actions.innerHTML = `
    <button class="icon-btn" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
    <button class="icon-btn" title="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
  `;

  row.dataset.status = 'submitted';

  // Show success message
  const originalText = button.textContent;
  button.textContent = '✓ Submitted';
  setTimeout(() => {
    button.style.display = 'none';
  }, 1500);
}

// TEMPLATES PAGE
function toggleEditProfile() {
  const profileFields = document.getElementById('profileFields');
  const isEditing = profileFields.getAttribute('data-editing') === 'true';

  if (isEditing) {
    profileFields.setAttribute('data-editing', 'false');
    // In production, would save changes
  } else {
    profileFields.setAttribute('data-editing', 'true');
    // In production, would show form inputs
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Set active nav based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('active');
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Page-specific initialization
  if (currentPage === 'generate.html' || currentPage.includes('generate')) {
    // Pre-fill based on URL params
    const params = new URLSearchParams(window.location.search);
    const tenderId = params.get('id');

    if (tenderId) {
      // In production, would fetch tender details
      console.log('Initializing proposal for tender:', tenderId);
    }
  }
});

// Utility: Format currency
function formatCurrency(value) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(value);
}

// Utility: Format date
function formatDate(date) {
  return new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}
