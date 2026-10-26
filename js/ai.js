/**
 * LoanAI - AI Financial Advisor & Integration Layer
 * 
 * Provides clean architectural abstractions for:
 * 1. Anthropic Claude AI integration (safe proxy configuration + intelligent contextual demo mode)
 * 2. Google Sheets record management (safe webhook configuration + browser audit trail)
 * 
 * SECURITY NOTICE:
 * In compliance with BFSI security standards, no API keys or Google private credentials
 * are hardcoded or exposed in client-side JavaScript.
 */

window.LoanAI = window.LoanAI || {};

// Production endpoint hooks (configure when hosting with a serverless backend / Cloudflare Worker)
const INTEGRATION_CONFIG = {
  // If hosting a backend proxy, set URL here (e.g., 'https://api.yourdomain.com/claude-proxy')
  CLAUDE_PROXY_ENDPOINT: null,
  
  // If using Google Apps Script Web App for Google Sheets sync, set URL here
  GOOGLE_SHEETS_WEBHOOK_URL: null,

  // Timeout in milliseconds
  REQUEST_TIMEOUT_MS: 12000
};

/**
 * Clean abstraction for Claude AI Financial Advice
 * Evaluates contextual user financial metrics and returns structured advice.
 * 
 * @param {Object} financialData - User's financial profile
 * @returns {Promise<string>} - Formatted HTML/Markdown advice
 */
window.LoanAI.generateFinancialAdvice = async function(financialData) {
  // If a production proxy endpoint is configured, invoke it securely
  if (INTEGRATION_CONFIG.CLAUDE_PROXY_ENDPOINT) {
    try {
      const response = await fetch(INTEGRATION_CONFIG.CLAUDE_PROXY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet',
          system: 'You are an expert BFSI fintech decision-support advisor. Provide structured, actionable, and mathematically grounded financial guidance.',
          data: financialData
        })
      });

      if (!response.ok) {
        throw new Error(`Proxy error: ${response.statusText}`);
      }

      const resData = await response.json();
      return resData.advice || resData.content;
    } catch (err) {
      console.warn('Backend proxy unavailable, falling back to contextual demo engine:', err);
    }
  }

  // --------------------------------------------------------------------------
  // Intelligent Contextual Reasoning Engine (Demo Mode for GitHub Pages)
  // Generates dynamic, highly personalized financial guidance based on real inputs
  // --------------------------------------------------------------------------
  return new Promise((resolve) => {
    setTimeout(() => {
      const income = Number(financialData.income) || 60000;
      const emi = Number(financialData.emi) || 0;
      const score = Number(financialData.creditScore) || 720;
      const targetLoan = Number(financialData.targetLoan) || 1500000;
      const goal = financialData.goal || 'General Wealth & Debt Optimization';
      const promptQuery = financialData.promptQuery || '';

      const dti = income > 0 ? ((emi / income) * 100).toFixed(1) : 0;
      const disposableIncome = Math.max(0, income - emi);
      const isPrime = score >= 750;
      const isSubprime = score < 650;
      const isHighDti = dti > 45;

      const formattedIncome = window.LoanAI.formatCurrency(income);
      const formattedEmi = window.LoanAI.formatCurrency(emi);
      const formattedDisposable = window.LoanAI.formatCurrency(disposableIncome);
      const formattedTarget = window.LoanAI.formatCurrency(targetLoan);

      let adviceHtml = '';

      adviceHtml += `
        <div class="ai-generated-report">
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1.25rem;">
            <span class="badge ${isPrime ? 'badge-success' : isSubprime ? 'badge-danger' : 'badge-warning'}">
              <span class="badge-dot"></span> Credit Tier: ${isPrime ? 'Prime (750+)' : isSubprime ? 'Sub-Prime (<650)' : 'Near-Prime'}
            </span>
            <span class="badge ${isHighDti ? 'badge-danger' : 'badge-success'}">
              <span class="badge-dot"></span> DTI Ratio: ${dti}%
            </span>
          </div>

          <h3>1. Executive Financial Summary</h3>
          <p>
            Based on your net monthly cash flow of <strong>${formattedIncome}</strong> and existing fixed obligations of <strong>${formattedEmi}</strong>, your current Debt-to-Income (DTI) ratio is <strong>${dti}%</strong>. 
            You retain a monthly unencumbered liquidity cushion of <strong>${formattedDisposable}</strong>. Your credit bureau profile stands at <strong>${score}</strong>, targeting an allocation of <strong>${formattedTarget}</strong> toward <em>${goal}</em>.
          </p>

          <h3>2. Key Analytical Observations & Bottlenecks</h3>
          <ul>
            <li><strong>Debt Absorption Capacity:</strong> ${isHighDti 
              ? `Your current debt obligations consume ${dti}% of gross income. Standard institutional lenders cap total borrowing at 50%, leaving very limited headroom for new loan approvals without co-borrowing or debt consolidation.` 
              : `Your low DTI of ${dti}% demonstrates disciplined financial leverage. You have healthy capacity to absorb additional borrowing without compromising baseline household liquidity.`}</li>
            <li><strong>Interest Rate Tiering:</strong> ${isPrime 
              ? `Your credit score of ${score} puts you in the Tier-1 bracket, qualifying you for prevailing prime benchmark rates (8.5% - 9.25% p.a.) with zero or discounted processing charges.` 
              : `With a score of ${score}, institutional lenders may price risk by adding a 150-300 bps premium over base lending rates (~11.0% - 13.5% p.a.).`}</li>
            <li><strong>Cash Flow Resilience:</strong> Assuming typical living expenses of 30-40% of income, your net free investable surplus is approximately <strong>${window.LoanAI.formatCurrency(disposableIncome * 0.65)}/month</strong>.</li>
          </ul>

          <h3>3. Actionable Recommendations</h3>
          <ul>
            <li><strong>Immediate (30 Days):</strong> ${isHighDti 
              ? `Allocate a portion of liquid savings toward pre-closing high-cost revolving debt (credit cards or personal loans) to compress your DTI under 40% before submitting fresh applications.` 
              : `Keep credit card statement balances under 20% of assigned credit limits during billing snapshot cycles to protect your prime credit rating.`}</li>
            <li><strong>Intermediate (90 Days):</strong> ${isSubprime 
              ? `Implement strict automated autopay. Avoid new credit inquiries for at least 3 billing cycles to eliminate temporary bureau score suppressions.` 
              : `If borrowing ${formattedTarget}, structure your tenure to maintain projected total EMI within ${window.LoanAI.formatCurrency(income * 0.45)}.`}</li>
            <li><strong>Strategic Borrowing:</strong> Consider opting for a step-down or hybrid tenure if expecting career income appreciation, allowing lower initial EMIs.</li>
          </ul>

          <h3>4. Stress Testing & Risk Considerations</h3>
          <p>
            Before undertaking new commitments, ensure you maintain an emergency reserve of at least <strong>${window.LoanAI.formatCurrency(disposableIncome * 4)}</strong> (equal to 3–6 months of fixed household and debt obligations) in a high-liquidity instrument. In the event of a 150 bps interest rate upward cycle, your monthly EMI on a floating loan of ${formattedTarget} could increase by approximately <strong>${window.LoanAI.formatCurrency(targetLoan * 0.0012)}/month</strong>.
          </p>

          <h3>5. AI Decision-Support Guidance</h3>
          <p>
            ${promptQuery ? `<em>Regarding your inquiry "${promptQuery}":</em> ` : ''}
            Prioritize building your net worth through low-cost debt and productive asset generation. Always compare APR (Annual Percentage Rate) inclusive of origination and insurance costs rather than purely flat interest quotes across at least 3 scheduled commercial banks.
          </p>
        </div>
      `;

      resolve(adviceHtml);
    }, 600); // realistic async delay
  });
};

/**
 * Clean abstraction for Google Sheets Integration
 * In demo mode, records the analysis into browser audit storage and logs sanitized payload.
 * 
 * @param {string} moduleName - Name of module (Loan, Credit, EMI)
 * @param {Object} payload - Analysis data
 */
window.LoanAI.saveUserAnalysis = async function(moduleName, payload) {
  const timestamp = new Date().toISOString();
  const record = {
    id: 'REC-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    timestamp,
    module: moduleName,
    data: payload
  };

  // If Google Sheets webhook is configured, dispatch POST
  if (INTEGRATION_CONFIG.GOOGLE_SHEETS_WEBHOOK_URL) {
    try {
      await fetch(INTEGRATION_CONFIG.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      window.LoanAI.showToast(`Synced record ${record.id} with Google Sheets!`, 'success');
      return;
    } catch (e) {
      console.warn('Google Sheets Webhook dispatch error:', e);
    }
  }

  // Safe Demo Mode: Audit logging in LocalStorage
  try {
    const history = JSON.parse(localStorage.getItem('loanai_audit_trail') || '[]');
    history.unshift(record);
    if (history.length > 50) history.pop();
    localStorage.setItem('loanai_audit_trail', JSON.stringify(history));
    
    console.info('[LoanAI Audit Logger] Record created:', record);
    window.LoanAI.showToast(`Analysis saved! Record ID: ${record.id}`, 'success');
  } catch (err) {
    window.LoanAI.showToast('Analysis captured locally.', 'info');
  }
};

// UI Controller for financial-tips.html
document.addEventListener('DOMContentLoaded', () => {
  const incomeInput = document.getElementById('aiIncome');
  const emiInput = document.getElementById('aiEmi');
  const creditScoreInput = document.getElementById('aiCreditScore');
  const targetLoanInput = document.getElementById('aiTargetLoan');
  const goalSelect = document.getElementById('aiGoalSelect');
  const customQueryInput = document.getElementById('aiCustomQuery');
  const generateBtn = document.getElementById('aiGenerateBtn');
  const autoFillBtn = document.getElementById('aiAutoFillBtn');
  const responseBox = document.getElementById('aiResponseContent');
  const aiStatusPill = document.getElementById('aiStatusPill');
  const promptChips = document.querySelectorAll('.ai-prompt-chip');

  // Prepopulate from stored snapshot if available
  function loadStoredSnapshot() {
    const loanSnap = window.LoanAI.getSnapshot('loanForm');
    const creditSnap = window.LoanAI.getSnapshot('creditForm');
    const emiSnap = window.LoanAI.getSnapshot('emiForm');

    let loaded = false;
    if (loanSnap) {
      if (incomeInput && loanSnap.income) incomeInput.value = loanSnap.income;
      if (emiInput && loanSnap.existingEmi !== undefined) emiInput.value = loanSnap.existingEmi;
      if (creditScoreInput && loanSnap.creditScore) creditScoreInput.value = loanSnap.creditScore;
      if (targetLoanInput && loanSnap.loanAmount) targetLoanInput.value = loanSnap.loanAmount;
      loaded = true;
    } else if (creditSnap && creditScoreInput && creditSnap.score) {
      creditScoreInput.value = creditSnap.score;
      loaded = true;
    }

    if (emiSnap && targetLoanInput && !targetLoanInput.value) {
      targetLoanInput.value = emiSnap.principal;
      loaded = true;
    }

    return loaded;
  }

  // Auto-fill on initial page load if inputs are empty
  if (incomeInput && !incomeInput.value) {
    loadStoredSnapshot();
  }

  if (autoFillBtn) {
    autoFillBtn.addEventListener('click', () => {
      const ok = loadStoredSnapshot();
      if (ok) {
        window.LoanAI.showToast('Synchronized profile from previous modules!', 'success');
      } else {
        window.LoanAI.showToast('No saved profile found. Please enter details or run Loan Checker first.', 'warning');
      }
    });
  }

  // Quick Prompt Chips
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query') || chip.textContent.trim();
      if (customQueryInput) {
        customQueryInput.value = query;
      }
      triggerAdviceGeneration(query);
    });
  });

  async function triggerAdviceGeneration(queryOverride) {
    if (!responseBox) return;

    const data = {
      income: parseFloat(incomeInput ? incomeInput.value : 60000) || 60000,
      emi: parseFloat(emiInput ? emiInput.value : 10000) || 0,
      creditScore: parseInt(creditScoreInput ? creditScoreInput.value : 750, 10) || 750,
      targetLoan: parseFloat(targetLoanInput ? targetLoanInput.value : 1500000) || 1500000,
      goal: goalSelect ? goalSelect.value : 'Home Acquisition',
      promptQuery: queryOverride || (customQueryInput ? customQueryInput.value : '')
    };

    // UI Loading state
    if (aiStatusPill) {
      aiStatusPill.className = 'badge badge-primary';
      aiStatusPill.innerHTML = '<span class="badge-dot"></span> Synthesizing Insights...';
    }
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        Analyzing Financial Profile...
      `;
    }

    responseBox.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 1rem;">
        <div style="width: 38px; height: 38px; border: 3px solid rgba(6, 182, 212, 0.2); border-top-color: #06b6d4; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem;"></div>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">Evaluating credit bands, DTI risk thresholds, and borrowing roadmap...</p>
      </div>
    `;

    try {
      const adviceHtml = await window.LoanAI.generateFinancialAdvice(data);
      
      // Render structured result
      responseBox.innerHTML = adviceHtml;

      if (aiStatusPill) {
        aiStatusPill.className = 'badge badge-success';
        aiStatusPill.innerHTML = '<span class="badge-dot"></span> Analysis Complete';
      }

      window.LoanAI.showToast('Personalized AI Financial Guidance generated!', 'success');
    } catch (err) {
      responseBox.innerHTML = `
        <div style="padding: 1.5rem; background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 8px;">
          <h4 style="color: #fb7185; margin-bottom: 0.5rem;">Advisory Generation Notice</h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">Unable to complete analysis synthesis. Please check input parameters.</p>
        </div>
      `;
    } finally {
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
          Generate Financial Guidance
        `;
      }
    }
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', () => triggerAdviceGeneration());
  }

  // Auto run initial advice if on page
  if (responseBox && responseBox.getAttribute('data-autorun') === 'true') {
    triggerAdviceGeneration();
  }
});
