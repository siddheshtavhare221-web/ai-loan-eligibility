/**
 * LoanAI - Loan Eligibility Checker Logic
 * Deterministic business rules, FOIR/DTI engine, risk classification,
 * transparent score calculations, and real-time UI updates.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const ageInput = document.getElementById('loanAge');
  const ageDisplay = document.getElementById('loanAgeDisplay');
  const incomeInput = document.getElementById('loanIncome');
  const empSelect = document.getElementById('loanEmployment');
  const existingEmiInput = document.getElementById('loanExistingEmi');
  const creditScoreInput = document.getElementById('loanCreditScore');
  const creditScoreDisplay = document.getElementById('loanCreditScoreDisplay');
  const loanAmountInput = document.getElementById('loanAmount');
  const loanTenureInput = document.getElementById('loanTenure');
  const loanTenureDisplay = document.getElementById('loanTenureDisplay');

  // Outputs
  const statusBadge = document.getElementById('eligibilityStatusBadge');
  const riskBadge = document.getElementById('riskTierBadge');
  const scoreNumber = document.getElementById('eligibilityScoreNumber');
  const scoreCircle = document.getElementById('eligibilityScoreCircle');
  const maxLoanDisplay = document.getElementById('maxLoanAmountDisplay');
  const estimatedEmiDisplay = document.getElementById('estimatedEmiDisplay');
  const dtiPercentDisplay = document.getElementById('dtiPercentDisplay');
  const dtiProgressBar = document.getElementById('dtiProgressBar');
  const positiveFactorsContainer = document.getElementById('positiveFactorsList');
  const negativeFactorsContainer = document.getElementById('negativeFactorsList');
  const recommendationText = document.getElementById('loanRecommendationText');
  const saveAnalysisBtn = document.getElementById('saveAnalysisBtn');
  const sendToAiBtn = document.getElementById('sendToAiAdvisorBtn');

  // Load previous snapshot if exists
  if (window.LoanAI && window.LoanAI.getSnapshot) {
    const snap = window.LoanAI.getSnapshot('loanForm');
    if (snap) {
      if (ageInput && snap.age) ageInput.value = snap.age;
      if (incomeInput && snap.income) incomeInput.value = snap.income;
      if (empSelect && snap.empType) empSelect.value = snap.empType;
      if (existingEmiInput && snap.existingEmi !== undefined) existingEmiInput.value = snap.existingEmi;
      if (creditScoreInput && snap.creditScore) creditScoreInput.value = snap.creditScore;
      if (loanAmountInput && snap.loanAmount) loanAmountInput.value = snap.loanAmount;
      if (loanTenureInput && snap.tenure) loanTenureInput.value = snap.tenure;
    }
  }

  // Calculate & Refresh Results
  function calculateEligibility() {
    const age = parseInt(ageInput.value, 10) || 30;
    const monthlyIncome = parseFloat(incomeInput.value) || 60000;
    const empType = empSelect ? empSelect.value : 'salaried';
    const existingEmi = parseFloat(existingEmiInput.value) || 0;
    const creditScore = parseInt(creditScoreInput.value, 10) || 750;
    const requestedAmount = parseFloat(loanAmountInput.value) || 1500000;
    const tenureYears = parseInt(loanTenureInput.value, 10) || 5;

    // Update synced display pills
    if (ageDisplay) ageDisplay.textContent = `${age} Yrs`;
    if (creditScoreDisplay) creditScoreDisplay.textContent = creditScore;
    if (loanTenureDisplay) loanTenureDisplay.textContent = `${tenureYears} Yrs (${tenureYears * 12} Mos)`;

    // 1. Benchmark Interest Rate based on Credit Score
    let annualRate = 9.5;
    if (creditScore >= 800) annualRate = 8.5;
    else if (creditScore >= 750) annualRate = 9.0;
    else if (creditScore >= 700) annualRate = 10.25;
    else if (creditScore >= 650) annualRate = 11.5;
    else annualRate = 13.5;

    // 2. Maximum Permissible FOIR (Fixed Obligation to Income Ratio)
    let baseFoir = 0.50; // 50% default
    if (monthlyIncome < 30000) baseFoir = 0.40;
    else if (monthlyIncome >= 80000) baseFoir = 0.60;
    else baseFoir = 0.50;

    // Adjust FOIR by Employment stability
    let empMultiplier = 1.0;
    if (empType === 'self-employed-prof') empMultiplier = 0.95;
    else if (empType === 'business') empMultiplier = 0.90;
    else if (empType === 'gig') empMultiplier = 0.82;

    const maxAllowedFoir = baseFoir * empMultiplier;
    const maxMonthlyObligation = monthlyIncome * maxAllowedFoir;
    const netAvailableEmi = Math.max(0, maxMonthlyObligation - existingEmi);

    // 3. Reducing-Balance EMI calculations
    const monthlyRate = annualRate / (12 * 100);
    const months = tenureYears * 12;

    // EMI for requested loan amount
    const factorRequested = Math.pow(1 + monthlyRate, months);
    const requestedEmi = Math.round(requestedAmount * (monthlyRate * factorRequested) / (factorRequested - 1));

    // Maximum loan amount user qualifies for based on net available EMI
    let maxLoanAmount = 0;
    if (netAvailableEmi > 0) {
      maxLoanAmount = Math.round(netAvailableEmi * (factorRequested - 1) / (monthlyRate * factorRequested));
    }

    // 4. Actual DTI with Requested Loan
    const totalProjectedEmi = existingEmi + requestedEmi;
    const dtiRatio = monthlyIncome > 0 ? (totalProjectedEmi / monthlyIncome) * 100 : 100;

    // 5. Age at Loan Maturity
    const ageAtMaturity = age + tenureYears;
    const maxRetirementAge = (empType === 'salaried') ? 60 : 65;

    // 6. Comprehensive Scoring (0 to 100)
    let score = 0;
    const positiveFactors = [];
    const negativeFactors = [];

    // Credit score points (max 35)
    if (creditScore >= 800) {
      score += 35;
      positiveFactors.push({ title: 'Exceptional Credit Score', desc: `Score of ${creditScore} qualifies you for prime benchmark rates (~${annualRate}% p.a.).` });
    } else if (creditScore >= 750) {
      score += 30;
      positiveFactors.push({ title: 'Strong Credit Health', desc: `Credit score of ${creditScore} provides favorable underwriting preference.` });
    } else if (creditScore >= 680) {
      score += 20;
      positiveFactors.push({ title: 'Moderate Credit Rating', desc: `Credit score of ${creditScore} meets basic lender criteria.` });
    } else if (creditScore >= 600) {
      score += 10;
      negativeFactors.push({ title: 'Sub-Prime Credit Score', desc: `Credit score of ${creditScore} raises lender risk assessment and rates.` });
    } else {
      score += 0;
      negativeFactors.push({ title: 'High Credit Bureau Risk', desc: `Score under 600 typically leads to automated lender declines.` });
    }

    // DTI points (max 35)
    if (dtiRatio <= 35) {
      score += 35;
      positiveFactors.push({ title: 'Low Debt-to-Income (DTI)', desc: `Projected DTI of ${dtiRatio.toFixed(1)}% is comfortably within the conservative 40% zone.` });
    } else if (dtiRatio <= 45) {
      score += 26;
      positiveFactors.push({ title: 'Manageable Debt Burden', desc: `Projected DTI of ${dtiRatio.toFixed(1)}% reflects disciplined repayment capability.` });
    } else if (dtiRatio <= 55) {
      score += 14;
      negativeFactors.push({ title: 'Elevated Debt Obligations', desc: `Projected DTI of ${dtiRatio.toFixed(1)}% is near the maximum permissible lender cap.` });
    } else {
      score += 0;
      negativeFactors.push({ title: 'Severe Debt Burden', desc: `Projected DTI of ${dtiRatio.toFixed(1)}% exceeds standard 50-60% regulatory thresholds.` });
    }

    // Capacity ratio points (max 20)
    const capacityRatio = requestedAmount > 0 ? (maxLoanAmount / requestedAmount) : 0;
    if (capacityRatio >= 1.0) {
      score += 20;
      positiveFactors.push({ title: 'Sufficient Income Coverage', desc: `Your monthly cash flow supports up to ${window.LoanAI.formatCurrency(maxLoanAmount)}.` });
    } else if (capacityRatio >= 0.8) {
      score += 12;
      negativeFactors.push({ title: 'Slight Amount Overreach', desc: `Requested amount is ~${Math.round((1 - capacityRatio) * 100)}% above ideal conservative borrowing ceiling.` });
    } else {
      score += 4;
      negativeFactors.push({ title: 'High Income Stretch', desc: `Requested loan exceeds calculated capacity of ${window.LoanAI.formatCurrency(maxLoanAmount)}.` });
    }

    // Age & Employment points (max 10)
    if (age >= 23 && ageAtMaturity <= maxRetirementAge) {
      score += 10;
      positiveFactors.push({ title: 'Optimal Age & Career Horizon', desc: `Loan matures at age ${ageAtMaturity}, well within active earning years.` });
    } else if (ageAtMaturity > maxRetirementAge) {
      score += 2;
      negativeFactors.push({ title: 'Tenure Exceeds Retirement Age', desc: `Loan matures at age ${ageAtMaturity}, past typical retirement (${maxRetirementAge} yrs).` });
    } else {
      score += 5;
    }

    // Final Status & Risk Determinations
    let statusText = 'Eligible';
    let statusClass = 'badge-success';
    let riskText = 'Low Risk';
    let riskClass = 'badge-success';

    if (score >= 72 && capacityRatio >= 0.95 && creditScore >= 680 && ageAtMaturity <= maxRetirementAge) {
      statusText = 'Eligible';
      statusClass = 'badge-success';
      riskText = creditScore >= 750 && dtiRatio <= 40 ? 'Low Risk' : 'Moderate Risk';
      riskClass = riskText === 'Low Risk' ? 'badge-success' : 'badge-warning';
    } else if (score >= 48 && creditScore >= 600 && ageAtMaturity <= (maxRetirementAge + 3)) {
      statusText = 'Needs Review';
      statusClass = 'badge-warning';
      riskText = 'Moderate Risk';
      riskClass = 'badge-warning';
    } else {
      statusText = 'Not Eligible';
      statusClass = 'badge-danger';
      riskText = 'High Risk';
      riskClass = 'badge-danger';
    }

    // Dynamic Recommendations
    let recommendation = '';
    if (statusText === 'Eligible') {
      recommendation = `You demonstrate strong creditworthiness and manageable debt obligations. You can comfortably apply for ${window.LoanAI.formatCurrency(requestedAmount)} at an estimated EMI of ${window.LoanAI.formatCurrency(requestedEmi)}/month. To lock in the lowest interest rate (~${annualRate}%), maintain your low credit card utilization before filing the formal application.`;
    } else if (statusText === 'Needs Review') {
      if (capacityRatio < 1.0) {
        recommendation = `Your requested loan slightly strains current cash flow. Consider extending the tenure to ${Math.min(10, tenureYears + 2)} years to reduce your monthly EMI, or reducing the loan amount to ${window.LoanAI.formatCurrency(maxLoanAmount)}. Adding a co-applicant with independent income can immediately upgrade this to fully eligible status.`;
      } else {
        recommendation = `Your profile is on the borderline due to existing commitments or credit score. Paying off smaller revolving credit card balances can lower your DTI by 5-10% and bump your rating into the prime tier before formal underwriting.`;
      }
    } else {
      recommendation = `Based on conservative underwriting guidelines, current debt obligations (${window.LoanAI.formatCurrency(existingEmi)}) and credit profile restrict loan qualification at this time. Recommended steps: 1) Prepay high-interest existing debts, 2) Target bringing your DTI below 45%, and 3) Build a 6-month record of on-time payments to lift your credit score above 680.`;
    }

    // Render Outputs
    if (statusBadge) {
      statusBadge.className = `badge ${statusClass}`;
      statusBadge.innerHTML = `<span class="badge-dot"></span> ${statusText}`;
    }

    if (riskBadge) {
      riskBadge.className = `badge ${riskClass}`;
      riskBadge.innerHTML = `<span class="badge-dot"></span> ${riskText}`;
    }

    if (scoreNumber) {
      scoreNumber.textContent = score;
    }

    if (scoreCircle) {
      // Circle stroke-dasharray = 534
      const circumference = 534;
      const offset = circumference - (score / 100) * circumference;
      scoreCircle.style.strokeDashoffset = offset;
      if (score >= 70) scoreCircle.style.stroke = '#10b981';
      else if (score >= 50) scoreCircle.style.stroke = '#f59e0b';
      else scoreCircle.style.stroke = '#f43f5e';
    }

    if (maxLoanDisplay) maxLoanDisplay.textContent = window.LoanAI.formatCurrency(maxLoanAmount);
    if (estimatedEmiDisplay) estimatedEmiDisplay.textContent = `${window.LoanAI.formatCurrency(requestedEmi)}/mo`;
    
    if (dtiPercentDisplay) {
      dtiPercentDisplay.textContent = `${dtiRatio.toFixed(1)}%`;
      dtiPercentDisplay.style.color = dtiRatio <= 40 ? '#34d399' : dtiRatio <= 55 ? '#fbbf24' : '#fb7185';
    }

    if (dtiProgressBar) {
      dtiProgressBar.style.width = `${Math.min(100, dtiRatio)}%`;
      if (dtiRatio <= 40) dtiProgressBar.style.background = 'linear-gradient(90deg, #10b981, #06b6d4)';
      else if (dtiRatio <= 55) dtiProgressBar.style.background = 'linear-gradient(90deg, #f59e0b, #eab308)';
      else dtiProgressBar.style.background = 'linear-gradient(90deg, #f43f5e, #e11d48)';
    }

    // Render Factor Cards
    if (positiveFactorsContainer) {
      positiveFactorsContainer.innerHTML = positiveFactors.length > 0 
        ? positiveFactors.map(f => `
            <div class="factor-row">
              <div class="factor-icon-wrap factor-icon-positive">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div class="factor-text">
                <div class="factor-title">${f.title}</div>
                <div class="factor-desc">${f.desc}</div>
              </div>
            </div>
          `).join('')
        : `<p style="font-size: 0.85rem; color: var(--text-muted);">No key positive factors detected under current inputs.</p>`;
    }

    if (negativeFactorsContainer) {
      negativeFactorsContainer.innerHTML = negativeFactors.length > 0
        ? negativeFactors.map(f => `
            <div class="factor-row">
              <div class="factor-icon-wrap factor-icon-negative">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <div class="factor-text">
                <div class="factor-title">${f.title}</div>
                <div class="factor-desc">${f.desc}</div>
              </div>
            </div>
          `).join('')
        : `<div class="factor-row">
            <div class="factor-icon-wrap factor-icon-positive">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="factor-text">
              <div class="factor-title">Clean Risk Profile</div>
              <div class="factor-desc">No red flags or significant risk factors detected.</div>
            </div>
          </div>`;
    }

    if (recommendationText) {
      recommendationText.textContent = recommendation;
    }

    // Save snapshot for other modules
    if (window.LoanAI && window.LoanAI.saveSnapshot) {
      window.LoanAI.saveSnapshot('loanForm', {
        age,
        income: monthlyIncome,
        empType,
        existingEmi,
        creditScore,
        loanAmount: requestedAmount,
        tenure: tenureYears,
        status: statusText,
        risk: riskText,
        score,
        maxLoanAmount,
        requestedEmi,
        dti: dtiRatio
      });
    }
  }

  // Attach event listeners for real-time recalculation
  const inputs = [ageInput, incomeInput, empSelect, existingEmiInput, creditScoreInput, loanAmountInput, loanTenureInput];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', calculateEligibility);
      input.addEventListener('change', calculateEligibility);
    }
  });

  // Action Buttons
  if (saveAnalysisBtn) {
    saveAnalysisBtn.addEventListener('click', () => {
      const snap = window.LoanAI.getSnapshot('loanForm');
      if (window.LoanAI.saveUserAnalysis) {
        window.LoanAI.saveUserAnalysis('Loan Eligibility Analysis', snap);
      } else {
        window.LoanAI.showToast('Analysis snapshot saved successfully!', 'success');
      }
    });
  }

  if (sendToAiBtn) {
    sendToAiBtn.addEventListener('click', () => {
      window.LoanAI.showToast('Transferring profile to AI Advisor...', 'info');
      setTimeout(() => {
        window.location.href = 'financial-tips.html';
      }, 500);
    });
  }

  // Initial calculation run
  calculateEligibility();
});
