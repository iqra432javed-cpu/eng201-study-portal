/* ============================================================
   ENG-201 Study Portal — Main JavaScript
   ============================================================ */

// ── Nav Toggle (mobile) ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target))
        navLinks.classList.remove('open');
    });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === currentPage ||
        a.getAttribute('href') === './' + currentPage)
      a.classList.add('active');
  });

  // Init MCQ if present
  initMCQ();

  // Init smooth scroll anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// ── MCQ Engine ──────────────────────────────────────────────
function initMCQ() {
  const blocks = document.querySelectorAll('.mcq-block');
  if (!blocks.length) return;

  let score = 0, answered = 0;
  const total = blocks.length;
  updateScoreBoard(score, answered, total);

  blocks.forEach(block => {
    const options = block.querySelectorAll('.mcq-option');
    const feedback = block.querySelector('.mcq-feedback');
    const correctIdx = parseInt(block.dataset.correct, 10);

    options.forEach((opt, i) => {
      opt.addEventListener('click', () => {
        if (block.classList.contains('answered')) return;
        block.classList.add('answered');
        answered++;

        if (i === correctIdx) {
          opt.classList.add('correct');
          score++;
          if (feedback) {
            feedback.textContent = '✓ Correct!';
            feedback.className = 'mcq-feedback show correct-msg';
          }
        } else {
          opt.classList.add('wrong');
          options[correctIdx].classList.add('reveal');
          if (feedback) {
            const correctText = options[correctIdx].textContent.trim();
            feedback.textContent = `✗ Incorrect. Correct answer: ${correctText}`;
            feedback.className = 'mcq-feedback show wrong-msg';
          }
        }
        updateScoreBoard(score, answered, total);
      });
    });
  });
}

function updateScoreBoard(score, answered, total) {
  const val = document.querySelector('.score-val');
  const sub = document.querySelector('.score-sub');
  const bar = document.querySelector('.progress-bar-fill');
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  if (val) val.textContent = `${score} / ${total}`;
  if (sub) sub.textContent = `${answered} answered • ${pct}% complete`;
  if (bar) bar.style.width = pct + '%';
}

// ── Reset MCQ ───────────────────────────────────────────────
function resetMCQ() {
  document.querySelectorAll('.mcq-block').forEach(block => {
    block.classList.remove('answered');
    block.querySelectorAll('.mcq-option').forEach(opt => {
      opt.classList.remove('correct', 'wrong', 'reveal');
    });
    const fb = block.querySelector('.mcq-feedback');
    if (fb) { fb.className = 'mcq-feedback'; fb.textContent = ''; }
  });
  updateScoreBoard(0, 0, document.querySelectorAll('.mcq-block').length);
}

// ── Collapsible Answer Sections ─────────────────────────────
function toggleAnswer(btn) {
  const content = btn.nextElementSibling;
  const isOpen = content.style.display !== 'none';
  content.style.display = isOpen ? 'none' : 'block';
  btn.textContent = isOpen ? '▶ Show Answer' : '▼ Hide Answer';
}
