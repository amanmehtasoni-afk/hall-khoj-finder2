/**
 * Hall Khoj Finder — Advanced Interactive Event Planning Tools
 * 1. Wedding Budget Planner (Dynamic allocation, sliders, localStorage, export)
 * 2. Event Planning Checklist (Milestone tracker, custom tasks, localStorage)
 * 3. Guest Capacity & Seating Calculator (Sq Ft vs Guests, stage, parking)
 */

(function initPlanningTools() {
  'use strict';

  /* =========================================================================
     1. WEDDING BUDGET PLANNER
  ========================================================================= */
  const DEFAULT_BUDGET = 1000000; // ₹10,00,000 default
  const BUDGET_PERCENTAGES = {
    venue: 40,       // 40%
    catering: 25,    // 25%
    decor: 15,       // 15%
    photo: 10,       // 10%
    cars: 5,         // 5%
    misc: 5          // 5%
  };

  const STORAGE_KEY_BUDGET = 'hkf_planner_budget_v2';
  const STORAGE_KEY_CHECKLIST = 'hkf_planner_checklist_v2';

  function formatINR(val) {
    const num = Math.round(Number(val) || 0);
    return '₹' + num.toLocaleString('en-IN');
  }

  function initBudgetPlanner() {
    const totalInput = document.getElementById('budget-total-input');
    const presets = document.querySelectorAll('[data-budget-preset]');
    const saveBtn = document.getElementById('budget-save-btn');
    const printBtn = document.getElementById('budget-print-btn');

    if (!totalInput) return;

    // Load saved or default
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY_BUDGET));
    } catch (e) {}

    const initialTotal = saved && saved.total ? saved.total : DEFAULT_BUDGET;
    totalInput.value = initialTotal;

    function recalculate() {
      const total = Math.max(10000, Number(totalInput.value) || 0);
      let allocatedSum = 0;

      Object.keys(BUDGET_PERCENTAGES).forEach(cat => {
        const pct = BUDGET_PERCENTAGES[cat];
        const amount = Math.round(total * (pct / 100));
        allocatedSum += amount;

        const valEl = document.getElementById(`budget-val-${cat}`);
        const pctEl = document.getElementById(`budget-pct-${cat}`);
        const barEl = document.getElementById(`budget-bar-${cat}`);

        if (valEl) valEl.textContent = formatINR(amount);
        if (pctEl) pctEl.textContent = `${pct}%`;
        if (barEl) barEl.style.width = `${pct}%`;
      });

      const totalDisplay = document.getElementById('budget-allocated-total');
      if (totalDisplay) totalDisplay.textContent = formatINR(total);

      // Save to local storage automatically
      try {
        localStorage.setItem(STORAGE_KEY_BUDGET, JSON.stringify({ total, timestamp: Date.now() }));
      } catch (e) {}
    }

    totalInput.addEventListener('input', recalculate);

    presets.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = Number(btn.getAttribute('data-budget-preset'));
        if (val) {
          totalInput.value = val;
          recalculate();
          if (window.showToast) window.showToast(`Budget set to ${formatINR(val)}`, 'info');
        }
      });
    });

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        recalculate();
        if (window.showToast) {
          window.showToast('✅ Wedding Budget successfully saved to your browser!', 'success');
        } else {
          alert('Wedding Budget saved successfully!');
        }
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        const total = Number(totalInput.value) || 0;
        let text = `========================================\n`;
        text += `   HALL KHOJ FINDER — WEDDING BUDGET\n`;
        text += `========================================\n\n`;
        text += `Total Estimated Budget: ${formatINR(total)}\n\n`;
        text += `Breakdown Allocation:\n`;
        text += `• Venue & Banquet Hall (40%):   ${formatINR(total * 0.40)}\n`;
        text += `• Catering & Dining (25%):      ${formatINR(total * 0.25)}\n`;
        text += `• Stage & Flower Decor (15%):   ${formatINR(total * 0.15)}\n`;
        text += `• Photography & Video (10%):    ${formatINR(total * 0.10)}\n`;
        text += `• Luxury Wedding Cars (5%):     ${formatINR(total * 0.05)}\n`;
        text += `• Puja & Miscellaneous (5%):    ${formatINR(total * 0.05)}\n\n`;
        text += `Plan Date: ${new Date().toLocaleDateString('en-IN')}\n`;
        text += `Created with Hall Khoj Finder (https://hallkhoj.in)\n`;

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Wedding_Budget_Plan_HKF.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    recalculate();
  }

  /* =========================================================================
     2. EVENT PLANNING CHECKLIST
  ========================================================================= */
  const DEFAULT_CHECKLIST = [
    { id: 'task-1', stage: '6-12 Months Before', text: 'Select auspicious Muhurat date and backup dates', done: true },
    { id: 'task-2', stage: '6-12 Months Before', text: 'Determine initial guest list count and estimated budget', done: true },
    { id: 'task-3', stage: '6-12 Months Before', text: 'Explore and shortlist banquet halls on Hall Khoj Finder', done: true },
    { id: 'task-4', stage: '6-12 Months Before', text: 'Inspect 3D layout of shortlisted halls (seating & mandap stage)', done: false },
    { id: 'task-5', stage: '6-12 Months Before', text: 'Send booking inquiry and pay advance token to lock venue', done: false },

    { id: 'task-6', stage: '3-6 Months Before', text: 'Book luxury bridal / groom wedding cars on Hall Khoj', done: false },
    { id: 'task-7', stage: '3-6 Months Before', text: 'Finalize catering menu (veg/non-veg, live counters, dessert)', done: false },
    { id: 'task-8', stage: '3-6 Months Before', text: 'Book wedding photographer and 4K cinematography team', done: false },
    { id: 'task-9', stage: '3-6 Months Before', text: 'Reserve tent, shamiana, and ambient lighting contractor', done: false },

    { id: 'task-10', stage: '1-2 Months Before', text: 'Finalize wedding stage & floral entrance design theme', done: false },
    { id: 'task-11', stage: '1-2 Months Before', text: 'Send formal wedding invitations to family and friends', done: false },
    { id: 'task-12', stage: '1-2 Months Before', text: 'Confirm bridal makeup artist and mehendi packages', done: false },

    { id: 'task-13', stage: '1-2 Weeks Before', text: 'Reconfirm final guest headcount with banquet manager', done: false },
    { id: 'task-14', stage: '1-2 Weeks Before', text: 'Check air-conditioning and silent generator backup on site', done: false },
    { id: 'task-15', stage: '1-2 Weeks Before', text: 'Download official digital booking receipt from Hall Khoj', done: false },

    { id: 'task-16', stage: 'Event Day', text: 'Verify bridal dressing suite is unlocked and air-conditioned', done: false },
    { id: 'task-17', stage: 'Event Day', text: 'Ensure catering live counters start on time with welcome drinks', done: false },
    { id: 'task-18', stage: 'Event Day', text: 'Celebrate stress-free with verified direct owner support!', done: false }
  ];

  function initChecklist() {
    const container = document.getElementById('checklist-items-container');
    const progressBar = document.getElementById('checklist-progress-bar');
    const progressText = document.getElementById('checklist-progress-text');
    const addInput = document.getElementById('checklist-new-task');
    const addBtn = document.getElementById('checklist-add-btn');
    const resetBtn = document.getElementById('checklist-reset-btn');

    if (!container) return;

    let items = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHECKLIST);
      if (stored) {
        items = JSON.parse(stored);
      }
    } catch (e) {}

    if (!Array.isArray(items) || items.length === 0) {
      items = JSON.parse(JSON.stringify(DEFAULT_CHECKLIST));
    }

    function saveAndRender() {
      try {
        localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(items));
      } catch (e) {}

      // Calculate progress
      const total = items.length;
      const completed = items.filter(i => i.done).length;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

      if (progressBar) progressBar.style.width = `${pct}%`;
      if (progressText) progressText.textContent = `${completed} of ${total} Completed (${pct}%)`;

      // Group by stage
      const stages = {};
      items.forEach(item => {
        const st = item.stage || 'General Tasks';
        if (!stages[st]) stages[st] = [];
        stages[st].push(item);
      });

      let html = '';
      Object.keys(stages).forEach(stage => {
        html += `
          <div style="margin-bottom:1.25rem;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-champagne); text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
              <span>🗓️</span> <span>${stage}</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.4rem;">
        `;

        stages[stage].forEach(item => {
          html += `
            <label class="checklist-row ${item.done ? 'done' : ''}" style="display:flex; align-items:center; justify-content:space-between; gap:0.75rem; padding:0.6rem 0.85rem; border-radius:var(--radius-sm); background:rgba(255,255,255,${item.done ? '0.02' : '0.05'}); border:1px solid ${item.done ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}; cursor:pointer; transition:all 0.2s ease;">
              <div style="display:flex; align-items:center; gap:0.75rem; flex:1;">
                <input type="checkbox" data-task-id="${item.id}" ${item.done ? 'checked' : ''} style="width:18px; height:18px; accent-color:#10b981; cursor:pointer;">
                <span style="font-size:0.9rem; color:${item.done ? 'var(--text-muted)' : 'var(--text-primary)'}; text-decoration:${item.done ? 'line-through' : 'none'};">${item.text}</span>
              </div>
              <button type="button" data-delete-task="${item.id}" title="Remove task" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1rem; padding:0 0.35rem;" aria-label="Delete">&times;</button>
            </label>
          `;
        });

        html += `</div></div>`;
      });

      container.innerHTML = html;

      // Attach event listeners
      container.querySelectorAll('input[data-task-id]').forEach(box => {
        box.addEventListener('change', (e) => {
          const id = box.getAttribute('data-task-id');
          const target = items.find(i => i.id === id);
          if (target) {
            target.done = box.checked;
            saveAndRender();
          }
        });
      });

      container.querySelectorAll('button[data-delete-task]').forEach(delBtn => {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = delBtn.getAttribute('data-delete-task');
          items = items.filter(i => i.id !== id);
          saveAndRender();
        });
      });
    }

    if (addBtn && addInput) {
      function addNewTask() {
        const text = addInput.value.trim();
        if (!text) return;
        items.push({
          id: 'custom-' + Date.now(),
          stage: 'Custom Milestones',
          text: text,
          done: false
        });
        addInput.value = '';
        saveAndRender();
        if (window.showToast) window.showToast('New checklist item added!', 'info');
      }

      addBtn.addEventListener('click', addNewTask);
      addInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addNewTask();
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset checklist back to standard Indian wedding timeline?')) {
          items = JSON.parse(JSON.stringify(DEFAULT_CHECKLIST));
          saveAndRender();
        }
      });
    }

    saveAndRender();
  }

  /* =========================================================================
     3. GUEST CAPACITY & SEATING CALCULATOR
  ========================================================================= */
  function initCapacityCalculator() {
    const calcMode = document.getElementById('calc-mode-select');
    const primaryInput = document.getElementById('calc-primary-input');
    const inputLabel = document.getElementById('calc-input-label');
    const seatingStyle = document.getElementById('calc-seating-style');
    const includeStage = document.getElementById('calc-inc-stage');
    const includeBuffet = document.getElementById('calc-inc-buffet');
    const includeDance = document.getElementById('calc-inc-dance');
    const resultBox = document.getElementById('calc-results');
    const findVenuesBtn = document.getElementById('calc-find-venues-btn');

    if (!primaryInput) return;

    // Seating styles (Sq Ft per Guest)
    const SEATING_FACTORS = {
      banquet: 13,    // Round tables with chairs (12-14 sq ft)
      theater: 9,     // Rows of chairs facing stage (8-10 sq ft)
      cocktail: 6     // Floating / reception standing (5-6 sq ft)
    };

    function recalculate() {
      const mode = calcMode ? calcMode.value : 'guests'; // 'guests' or 'area'
      const val = Math.max(10, Number(primaryInput.value) || 0);
      const style = seatingStyle ? seatingStyle.value : 'banquet';
      const factor = SEATING_FACTORS[style] || 13;

      const stageArea = includeStage && includeStage.checked ? 400 : 0;
      const buffetArea = includeBuffet && includeBuffet.checked ? 750 : 0;
      const danceArea = includeDance && includeDance.checked ? 350 : 0;
      const auxiliaryArea = stageArea + buffetArea + danceArea;

      let guestCapacity = 0;
      let totalAreaSqFt = 0;

      if (mode === 'guests') {
        guestCapacity = val;
        totalAreaSqFt = Math.round((val * factor) + auxiliaryArea);
      } else {
        totalAreaSqFt = val;
        const seatingArea = Math.max(100, val - auxiliaryArea);
        guestCapacity = Math.round(seatingArea / factor);
      }

      const totalAreaSqMtr = Math.round(totalAreaSqFt * 0.092903);
      const estimatedCars = Math.round(guestCapacity / 4);

      const resGuests = document.getElementById('calc-res-guests');
      const resSqFt = document.getElementById('calc-res-sqft');
      const resSqMtr = document.getElementById('calc-res-sqm');
      const resParking = document.getElementById('calc-res-parking');
      const resStage = document.getElementById('calc-res-stage');

      if (resGuests) resGuests.textContent = guestCapacity.toLocaleString('en-IN') + ' Guests';
      if (resSqFt) resSqFt.textContent = totalAreaSqFt.toLocaleString('en-IN') + ' Sq. Ft.';
      if (resSqMtr) resSqMtr.textContent = totalAreaSqMtr.toLocaleString('en-IN') + ' m²';
      if (resParking) resParking.textContent = estimatedCars + ' Cars';
      if (resStage) resStage.textContent = auxiliaryArea + ' Sq. Ft.';

      if (findVenuesBtn) {
        findVenuesBtn.href = `/search.html?capacity=${guestCapacity}`;
      }
    }

    if (calcMode) {
      calcMode.addEventListener('change', () => {
        if (calcMode.value === 'guests') {
          if (inputLabel) inputLabel.textContent = 'Expected Number of Guests:';
          primaryInput.value = 500;
        } else {
          if (inputLabel) inputLabel.textContent = 'Banquet Hall Carpet Area (Sq. Ft.):';
          primaryInput.value = 7500;
        }
        recalculate();
      });
    }

    [primaryInput, seatingStyle, includeStage, includeBuffet, includeDance].forEach(el => {
      if (el) el.addEventListener('input', recalculate);
    });

    recalculate();
  }

  // Global trigger hooks
  window.openPlanningTool = function (toolId) {
    if (window.HallKhojModals && window.HallKhojModals.open) {
      window.HallKhojModals.open(toolId);
    }
  };

  // Wire tool trigger pills and buttons across document
  function wireTriggerButtons() {
    document.querySelectorAll('[data-open-tool]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tool = btn.getAttribute('data-open-tool');
        if (tool === 'budget') window.openPlanningTool('modal-budget-planner');
        if (tool === 'checklist') window.openPlanningTool('modal-event-checklist');
        if (tool === 'capacity') window.openPlanningTool('modal-capacity-calc');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initBudgetPlanner();
      initChecklist();
      initCapacityCalculator();
      wireTriggerButtons();
    });
  } else {
    initBudgetPlanner();
    initChecklist();
    initCapacityCalculator();
    wireTriggerButtons();
  }
})();
