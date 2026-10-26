/**
 * LoanAI - Credit Score Analyzer Logic
 * Bureau metrics, 5-factor weighted scoring, risk tiers,
 * positive/negative factor analysis, and personalized improvement roadmap.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inputs
  const scoreInput = document.getElementById('creditScoreInput');
  const scoreDisplay = document.getElementById('creditScoreDisplay');
  const paymentHistorySelect = document.getElementById('paymentHistorySelect');
  const utilizationInput = document.getElementById('utilizationInput');
  const utilizationDisplay = document.getElementById('utilizationDisplay');
  const creditAgeSelect = document.getElementById('creditAgeSelect');
  const activeAccountsInput = document.getElementById('activeAccountsInput');
  const recentInquiriesSelect = document.getElementById('recentInquiriesSelect');

  // Outputs
  const gaugeNumber = document.getElementById('creditGaugeNumber');
  const gaugeCircle = document.getElementById('creditGaugeCircle');
  const healthCategoryBadge = document.getElementById('creditHealthCategoryBadge');
  const riskTierBadge = document.getElementById('creditRiskTierBadge');
  const creditSummaryDesc = document.getElementById('creditSummaryDesc');

  // Factor Progress Bars & Scores
  const factorPaymentBar = document.getElementById('factorPaymentBar');
  const factorPaymentScore = document.getElementById('factorPaymentScore');
  const factorUtilBar = document.getElementById('factorUtilBar');
  const factorUtilScore = document.getElementById('factorUtilScore');
  const factorAgeBar = document.getElementById('factorAgeBar');
  const factorAgeScore = document.getElementById('factorAgeScore');
  const factorMixBar = document.getElementById('factorMixBar');
  const factorMixScore = document.getElementById('factorMixScore');
  const factorInquiryBar = document.getElementById('factorInquiryBar');
  const factorInquiryScore = document.getElementById('factorInquiryScore');

  // Highlights & Action Steps
  const positiveHighlightsContainer = document.getElementById('creditPositiveHighlights');
  const improvementFlagsContainer = document.getElementById('creditImprovementFlags');
  const roadmap30Day = document.getElementById('roadmap30Day');
  const roadmap90Day = document.getElementById('roadmap90Day');
  const roadmap1Year = document.getElementById('roadmap1Year');
  const saveCreditBtn = document.getElementById('saveCreditAnalysisBtn');
  const sendToAiBtn = document.getElementById('sendCreditToAiBtn');

  // Check existing snapshot
  if (window.LoanAI && window.LoanAI.getSnapshot) {
    const snap = window.LoanAI.getSnapshot('creditForm');
    const loanSnap = window.LoanAI.getSnapshot('loanForm');
    if (snap) {
      if (scoreInput && snap.score) scoreInput.value = snap.score;
      if (paymentHistorySelect && snap.paymentHistory) paymentHistorySelect.value = snap.paymentHistory;
      if (utilizationInput && snap.utilization !== undefined) utilizationInput.value = snap.utilization;
      if (creditAgeSelect && snap.creditAge) creditAgeSelect.value = snap.creditAge;
      if (activeAccountsInput && snap.accounts) activeAccountsInput.value = snap.accounts;
      if (recentInquiriesSelect && snap.inquiries) recentInquiriesSelect.value = snap.inquiries;
    } else if (loanSnap && loanSnap.creditScore && scoreInput) {
      scoreInput.value = loanSnap.creditScore;
    }
  }

  function analyzeCredit() {
    const score = parseInt(scoreInput.value, 10) || 720;
    const paymentTier = paymentHistorySelect ? paymentHistorySelect.value : '100';
    const utilization = parseInt(utilizationInput.value, 10) || 28;
    const creditAge = creditAgeSelect ? creditAgeSelect.value : '3-5';
    const activeAccounts = parseInt(activeAccountsInput.value, 10) || 4;
    const inquiries = recentInquiriesSelect ? recentInquiriesSelect.value : '1-2';

    // Synchronize displays
    if (scoreDisplay) scoreDisplay.textContent = score;
    if (utilizationDisplay) utilizationDisplay.textContent = `${utilization}%`;
    if (gaugeNumber) gaugeNumber.textContent = score;

    // 1. Determine Category & Color
    let category = 'Good';
    let riskTier = 'Moderate Risk';
    let statusClass = 'badge-primary';
    let riskClass = 'badge-warning';
    let gaugeColor = '#06b6d4';
    let categoryDesc = '';

    if (score >= 800) {
      category = 'Exceptional';
      riskTier = 'Ultra-Low Risk';
      statusClass = 'badge-success';
      riskClass = 'badge-success';
      gaugeColor = '#10b981';
      categoryDesc = 'You are in the top 15% of borrowers nationwide. You qualify for the most competitive interest rates, priority processing, and zero-processing-fee waivers.';
    } else if (score >= 740) {
      category = 'Very Good';
      riskTier = 'Low Risk';
      statusClass = 'badge-success';
      riskClass = 'badge-success';
      gaugeColor = '#34d399';
      categoryDesc = 'Above prime borrower profile. Lenders view you as dependable with consistent credit discipline and low default probability.';
    } else if (score >= 670) {
      category = 'Good';
      riskTier = 'Moderate Risk';
      statusClass = 'badge-primary';
      riskClass = 'badge-warning';
      gaugeColor = '#06b6d4';
      categoryDesc = 'Prime threshold. Acceptable for most unsecured loans, mortgages, and auto financing, though minor interest concessions may not be granted.';
    } else if (score >= 580) {
      category = 'Fair';
      riskTier = 'Moderate-to-High Risk';
      statusClass = 'badge-warning';
      riskClass = 'badge-warning';
      gaugeColor = '#f59e0b';
      categoryDesc = 'Sub-prime tier. Higher interest rates and stringent documentation apply. Small missed payments or elevated balances are impacting your profile.';
    } else {
      category = 'Poor';
      riskTier = 'High Risk';
      statusClass = 'badge-danger';
      riskClass = 'badge-danger';
      gaugeColor = '#f43f5e';
      categoryDesc = 'High default probability. Likely subject to automated loan rejections or high-collateral secured requirements until repaired.';
    }

    // 2. SVG Gauge Arc Update (Score range 300 to 900 -> 0 to 100%)
    if (gaugeCircle) {
      const circumference = 534;
      const normalizedScore = Math.max(0, Math.min(1, (score - 300) / 600));
      const offset = circumference - normalizedScore * circumference;
      gaugeCircle.style.strokeDashoffset = offset;
      gaugeCircle.style.stroke = gaugeColor;
    }

    if (healthCategoryBadge) {
      healthCategoryBadge.className = `badge ${statusClass}`;
      healthCategoryBadge.innerHTML = `<span class="badge-dot"></span> ${category}`;
    }

    if (riskTierBadge) {
      riskTierBadge.className = `badge ${riskClass}`;
      riskTierBadge.innerHTML = `<span class="badge-dot"></span> ${riskTier}`;
    }

    if (creditSummaryDesc) {
      creditSummaryDesc.textContent = categoryDesc;
    }

    // 3. Compute 5 Factor Sub-Scores (out of 100)
    // Factor 1: Payment History (35% weight)
    let paymentScore = 80;
    if (paymentTier === '100') paymentScore = 100;
    else if (paymentTier === '98-99') paymentScore = 85;
    else if (paymentTier === '95-97') paymentScore = 65;
    else if (paymentTier === '90-94') paymentScore = 45;
    else paymentScore = 20;

    // Factor 2: Credit Utilization (30% weight)
    let utilScore = 50;
    if (utilization <= 10) utilScore = 100;
    else if (utilization <= 30) utilScore = 88;
    else if (utilization <= 50) utilScore = 65;
    else if (utilization <= 70) utilScore = 40;
    else utilScore = 15;

    // Factor 3: Length of Credit History (15% weight)
    let ageScore = 60;
    if (creditAge === '8+') ageScore = 100;
    else if (creditAge === '5-8') ageScore = 85;
    else if (creditAge === '3-5') ageScore = 70;
    else if (creditAge === '1-3') ageScore = 50;
    else ageScore = 30;

    // Factor 4: Credit Mix & Active Accounts (10% weight)
    let mixScore = 70;
    if (activeAccounts >= 3 && activeAccounts <= 7) mixScore = 95;
    else if (activeAccounts >= 1 && activeAccounts <= 2) mixScore = 70;
    else if (activeAccounts >= 8 && activeAccounts <= 12) mixScore = 75;
    else mixScore = 55;

    // Factor 5: Recent Inquiries (10% weight)
    let inqScore = 70;
    if (inquiries === '0') inqScore = 100;
    else if (inquiries === '1-2') inqScore = 82;
    else if (inquiries === '3-4') inqScore = 50;
    else inqScore = 20;

    // Update Factor UI
    const updateBar = (bar, scoreEl, val) => {
      if (bar) {
        bar.style.width = `${val}%`;
        if (val >= 80) bar.style.background = 'linear-gradient(90deg, #10b981, #06b6d4)';
        else if (val >= 60) bar.style.background = 'linear-gradient(90deg, #06b6d4, #3b82f6)';
        else if (val >= 40) bar.style.background = 'linear-gradient(90deg, #f59e0b, #eab308)';
        else bar.style.background = 'linear-gradient(90deg, #f43f5e, #e11d48)';
      }
      if (scoreEl) scoreEl.textContent = `${val}/100`;
    };

    updateBar(factorPaymentBar, factorPaymentScore, paymentScore);
    updateBar(factorUtilBar, factorUtilScore, utilScore);
    updateBar(factorAgeBar, factorAgeScore, ageScore);
    updateBar(factorMixBar, factorMixScore, mixScore);
    updateBar(factorInquiryBar, factorInquiryScore, inqScore);

    // 4. Positive Highlights & Improvement Flags
    const positives = [];
    const flags = [];

    if (paymentScore >= 85) {
      positives.push({ title: 'Impeccable Payment Record', desc: 'No recent delinquency. On-time payments carry the heaviest credit weighting (35%).' });
    } else {
      flags.push({ title: 'Delinquent Payment Record', desc: 'Recent late payments significantly suppress credit rating. Bring all accounts current.' });
    }

    if (utilScore >= 85) {
      positives.push({ title: 'Disciplined Credit Card Usage', desc: `Utilization is at ${utilization}%, well under the recommended 30% ceiling.` });
    } else if (utilScore >= 60) {
      flags.push({ title: 'Moderate Utilization Strain', desc: `Utilization is at ${utilization}%. Dropping below 30% will trigger a fast 15-30 point score boost.` });
    } else {
      flags.push({ title: 'High Credit Utilization Risk', desc: `Using ${utilization}% of available limit signals credit overdependence to bureau algorithms.` });
    }

    if (ageScore >= 80) {
      positives.push({ title: 'Mature Credit History', desc: 'Demonstrated borrowing tenure exceeding 5+ years signals stability.' });
    } else {
      flags.push({ title: 'Young Credit Profile', desc: 'Short account history limits bureau predictability. Keep your oldest card active.' });
    }

    if (inqScore >= 80) {
      positives.push({ title: 'Low Hard Inquiries', desc: 'Minimal credit applications in the past 6 months indicates financial stability.' });
    } else {
      flags.push({ title: 'Frequent Credit Searches', desc: 'Multiple recent loan/card applications trigger short-term bureau score dips.' });
    }

    // Render Highlights
    if (positiveHighlightsContainer) {
      positiveHighlightsContainer.innerHTML = positives.map(p => `
        <div class="factor-row">
          <div class="factor-icon-wrap factor-icon-positive">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="factor-text">
            <div class="factor-title">${p.title}</div>
            <div class="factor-desc">${p.desc}</div>
          </div>
        </div>
      `).join('');
    }

    if (improvementFlagsContainer) {
      improvementFlagsContainer.innerHTML = flags.length > 0 ? flags.map(f => `
        <div class="factor-row">
          <div class="factor-icon-wrap factor-icon-negative">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div class="factor-text">
            <div class="factor-title">${f.title}</div>
            <div class="factor-desc">${f.desc}</div>
          </div>
        </div>
      `).join('') : `
        <div class="factor-row">
          <div class="factor-icon-wrap factor-icon-positive">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="factor-text">
            <div class="factor-title">Excellent Risk Health</div>
            <div class="factor-desc">Zero critical improvement flags identified in your bureau profile.</div>
          </div>
        </div>
      `;
    }

    // 5. Tailored Action Roadmap
    if (roadmap30Day) {
      roadmap30Day.textContent = utilization > 30 
        ? `Pay down revolving credit card balances to bring utilization from ${utilization}% down under 30% before the next billing cycle statement date.`
        : `Request an automatic credit limit increase on existing credit cards without triggering a hard inquiry to immediately lower utilization ratio further.`;
    }

    if (roadmap90Day) {
      roadmap90Day.textContent = inquiries !== '0'
        ? `Enforce a strict 90-day moratorium on new credit card or personal loan applications to let recent hard inquiries mature and drop off bureau flags.`
        : `Maintain 100% automated autopay on all utility and debt accounts. Check official credit reports for any clerical inaccuracies or ghost defaults.`;
    }

    if (roadmap1Year) {
      roadmap1Year.textContent = creditAge === '<1' || creditAge === '1-3'
        ? `Keep your oldest accounts open and in good standing even if rarely used; credit longevity adds up to 15% of your compounding credit score.`
        : `Cultivate a balanced credit mix (combination of 1 secured loan like a home loan and 2-3 credit cards) to cement an 800+ Tier-1 rating.`;
    }

    // Save snapshot
    if (window.LoanAI && window.LoanAI.saveSnapshot) {
      window.LoanAI.saveSnapshot('creditForm', {
        score,
        category,
        riskTier,
        paymentHistory: paymentTier,
        utilization,
        creditAge,
        accounts: activeAccounts,
        inquiries
      });
    }
  }

  // Bind inputs
  const creditInputs = [scoreInput, paymentHistorySelect, utilizationInput, creditAgeSelect, activeAccountsInput, recentInquiriesSelect];
  creditInputs.forEach(elem => {
    if (elem) {
      elem.addEventListener('input', analyzeCredit);
      elem.addEventListener('change', analyzeCredit);
    }
  });

  // Action Buttons
  if (saveCreditBtn) {
    saveCreditBtn.addEventListener('click', () => {
      const snap = window.LoanAI.getSnapshot('creditForm');
      if (window.LoanAI.saveUserAnalysis) {
        window.LoanAI.saveUserAnalysis('Credit Health Audit', snap);
      } else {
        window.LoanAI.showToast('Credit health audit saved successfully!', 'success');
      }
    });
  }

  if (sendToAiBtn) {
    sendToAiBtn.addEventListener('click', () => {
      window.LoanAI.showToast('Transferring credit audit to AI Advisor...', 'info');
      setTimeout(() => {
        window.location.href = 'financial-tips.html';
      }, 500);
    });
  }

  // Initial Run
  analyzeCredit();
});
