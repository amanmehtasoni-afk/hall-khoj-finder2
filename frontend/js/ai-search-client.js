/**
 * Hall Khoj Finder — Grounded AI Search Client (Phase 12)
 * Connects natural language search prompts to /api/ai/search,
 * renders interpreted attribute chips, factual summaries, and grounded database results.
 */

(function () {
  function initAISearch() {
    const modal = document.getElementById('ai-search-modal');
    const input = document.getElementById('ai-prompt-input');
    const submitBtn = document.getElementById('ai-submit-btn');
    const triggerBtns = document.querySelectorAll('[data-trigger="ai-search"]');

    if (!modal) return;

    // Open modal on trigger button click
    triggerBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (input) {
          setTimeout(() => input.focus(), 100);
        }
      });
    });

    // Sample prompt click
    document.querySelectorAll('[data-ai-sample]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sampleText = btn.getAttribute('data-ai-sample');
        if (input) {
          input.value = sampleText;
          executeAISearch(sampleText);
        }
      });
    });

    // Submit handler
    if (submitBtn && input) {
      submitBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (text) executeAISearch(text);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const text = input.value.trim();
          if (text) executeAISearch(text);
        }
      });
    }

    async function executeAISearch(promptText) {
      const modalBody = modal.querySelector('.modal-body');
      if (!modalBody) return;

      // Existing container for results or create one
      let resultsContainer = document.getElementById('ai-results-container');
      if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'ai-results-container';
        resultsContainer.style.marginTop = '1.25rem';
        modalBody.appendChild(resultsContainer);
      }

      // Loading state
      resultsContainer.innerHTML = `
        <div style="padding:2rem 1rem; text-align:center; color:var(--text-secondary);">
          <div style="font-size:2rem; animation:pulse 1.5s infinite; margin-bottom:0.5rem;">🤖 ✨</div>
          <p style="font-size:0.95rem; color:#fff; font-weight:600;">Analyzing your event requirements...</p>
          <p style="font-size:0.8rem; color:var(--text-muted);">Grounded search across verified database listings without hallucinations.</p>
        </div>
      `;

      try {
        let json;
        if (window.HKF_API?.ai?.search) {
          json = await window.HKF_API.ai.search(promptText);
        } else {
          const apiBase = window.HKF_API?.baseUrl || (
            (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '3000'))
              ? 'http://localhost:3000/api' : '/api'
          );
          const response = await fetch(`${apiBase}/ai/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptText })
          });
          json = await response.json();
        }

        if (!json.success) {
          throw new Error(json.message || 'AI search failed');
        }

        const { interpretedQuery, totalMatches, results, summary } = json.data;

        // Render chips
        const chipsHtml = [];
        if (interpretedQuery.city) chipsHtml.push(`<span class="ai-pill-chip">📍 City: ${interpretedQuery.city}</span>`);
        if (interpretedQuery.capacity) chipsHtml.push(`<span class="ai-pill-chip">👥 ${interpretedQuery.capacity} Guests</span>`);
        if (interpretedQuery.maxPrice) chipsHtml.push(`<span class="ai-pill-chip">💰 Max: ₹${(interpretedQuery.maxPrice).toLocaleString('en-IN')}</span>`);
        if (interpretedQuery.category) chipsHtml.push(`<span class="ai-pill-chip">🏛️ ${interpretedQuery.category}</span>`);
        if (interpretedQuery.eventType) chipsHtml.push(`<span class="ai-pill-chip">🎉 ${interpretedQuery.eventType}</span>`);
        (interpretedQuery.facilities || []).forEach(f => {
          chipsHtml.push(`<span class="ai-pill-chip">✨ ${f}</span>`);
        });

        // Build HTML
        let html = `
          <div style="border-top:1px solid var(--border-subtle); padding-top:1rem;">
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:0.5rem;">
              Parsed Requirements:
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1rem;">
              ${chipsHtml.join('')}
            </div>

            <div style="background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.3); border-radius:var(--radius-md); padding:0.9rem; font-size:0.88rem; line-height:1.5; color:#f8fafc; margin-bottom:1.25rem;">
              💬 <strong>AI Summary:</strong> ${summary}
            </div>

            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:0.75rem;">
              Matching Verified Listings (${totalMatches}):
            </div>
        `;

        if (results.length === 0) {
          html += `
            <div style="padding:1.5rem; text-align:center; color:var(--text-secondary); background:rgba(255,255,255,0.03); border-radius:var(--radius-md);">
              <p>No exact verified venues matched all specific constraints.</p>
              <a href="/search.html" class="btn btn-secondary btn-sm" style="margin-top:0.5rem;">Browse All Marketplace Listings</a>
            </div>
          `;
        } else {
          html += `<div style="display:flex; flex-direction:column; gap:0.75rem; max-height:280px; overflow-y:auto; padding-right:0.3rem;">`;
          results.slice(0, 5).forEach(hall => {
            html += `
              <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.04); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.75rem 1rem; gap:1rem; flex-wrap:wrap;">
                <div>
                  <div style="font-weight:700; font-size:0.95rem; color:#fff;">
                    ${hall.name}
                    ${hall.matchScore ? `<span class="badge badge-gold" style="font-size:0.7rem; margin-left:0.4rem;">${hall.matchScore}% Match</span>` : ''}
                  </div>
                  <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.2rem;">
                    📍 ${hall.city || ''} • 👥 Fits ${hall.capacityMax || hall.capacity || 'N/A'} • ₹${(hall.startingPrice || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div class="flex gap-1">
                  <a href="/hall-details.html?id=${hall.id}" class="btn btn-gold btn-sm" style="font-size:0.75rem; padding:0.35rem 0.75rem;">
                    View in 3D
                  </a>
                </div>
              </div>
            `;
          });
          html += `</div>`;

          // Button to apply filters in search
          const searchParams = new URLSearchParams();
          if (interpretedQuery.city) searchParams.set('location', interpretedQuery.city);
          if (interpretedQuery.category) searchParams.set('category', interpretedQuery.category);
          if (interpretedQuery.maxPrice) searchParams.set('maxPrice', interpretedQuery.maxPrice);

          html += `
            <div style="margin-top:1rem; text-align:right;">
              <a href="/search.html?${searchParams.toString()}" class="btn btn-primary btn-sm">
                Open in Full Marketplace Search →
              </a>
            </div>
          `;
        }

        html += `</div>`;
        resultsContainer.innerHTML = html;
      } catch (err) {
        resultsContainer.innerHTML = `
          <div style="padding:1.5rem; text-align:center; color:#ef4444; background:rgba(239, 68, 68, 0.1); border-radius:var(--radius-md);">
            ⚠️ Error searching with AI: ${err.message || 'Server connection error'}. Please try again.
          </div>
        `;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAISearch);
  } else {
    initAISearch();
  }
})();
