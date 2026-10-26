/**
 * LoanAI - EMI Calculator Logic
 * Standard reducing-balance EMI formula, real-time recalculation,
 * animated SVG Donut visualization (Principal vs Interest),
 * and dynamic yearly amortization schedule table.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inputs
  const amountSlider = document.getElementById('emiAmountSlider');
  const amountInput = document.getElementById('emiAmountInput');
  const rateSlider = document.getElementById('emiRateSlider');
  const rateInput = document.getElementById('emiRateInput');
  const tenureSlider = document.getElementById('emiTenureSlider');
  const tenureInput = document.getElementById('emiTenureInput');
  const tenureUnitSelect = document.getElementById('emiTenureUnit');

  // Outputs
  const monthlyEmiDisplay = document.getElementById('monthlyEmiDisplay');
  const totalPrincipalDisplay = document.getElementById('totalPrincipalDisplay');
  const totalInterestDisplay = document.getElementById('totalInterestDisplay');
  const totalRepaymentDisplay = document.getElementById('totalRepaymentDisplay');
  const principalPercentDisplay = document.getElementById('principalPercentDisplay');
  const interestPercentDisplay = document.getElementById('interestPercentDisplay');

  // SVG Donut Chart Segments
  const donutInterestSegment = document.getElementById('donutInterestSegment');
  const donutCenterPercent = document.getElementById('donutCenterPercent');

  // Amortization Table Body
  const amortizationTableBody = document.getElementById('amortizationTableBody');
  const saveEmiBtn = document.getElementById('saveEmiAnalysisBtn');
  const sendToAiBtn = document.getElementById('sendEmiToAiBtn');

  // Sync Slider <-> Number Input
  function bindSync(slider, input, callback) {
    if (!slider || !input) return;
    slider.addEventListener('input', () => {
      input.value = slider.value;
      callback();
    });
    input.addEventListener('input', () => {
      let val = parseFloat(input.value);
      if (isNaN(val)) val = slider.min;
      slider.value = Math.max(slider.min, Math.min(slider.max, val));
      callback();
    });
  }

  // Prepopulate from previous snapshot if available
  if (window.LoanAI && window.LoanAI.getSnapshot) {
    const loanSnap = window.LoanAI.getSnapshot('loanForm');
    if (loanSnap && loanSnap.loanAmount && amountSlider && amountInput) {
      amountSlider.value = loanSnap.loanAmount;
      amountInput.value = loanSnap.loanAmount;
    }
  }

  function calculateEmi() {
    const P = parseFloat(amountInput.value) || 1000000;
    const annualRate = parseFloat(rateInput.value) || 8.5;
    let tenureVal = parseFloat(tenureInput.value) || 5;
    const isYears = tenureUnitSelect ? tenureUnitSelect.value === 'years' : true;
    const months = Math.max(1, Math.round(isYears ? tenureVal * 12 : tenureVal));

    // Reducing balance monthly interest
    const r = (annualRate / 100) / 12;
    let emi = 0;
    let totalRepayment = 0;
    let totalInterest = 0;

    if (r === 0) {
      emi = Math.round(P / months);
      totalInterest = 0;
      totalRepayment = P;
    } else {
      const factor = Math.pow(1 + r, months);
      emi = Math.round(P * r * factor / (factor - 1));
      totalRepayment = emi * months;
      totalInterest = Math.max(0, totalRepayment - P);
    }

    const principalPercent = totalRepayment > 0 ? (P / totalRepayment) * 100 : 100;
    const interestPercent = totalRepayment > 0 ? (totalInterest / totalRepayment) * 100 : 0;

    // Update Displays
    if (monthlyEmiDisplay) monthlyEmiDisplay.textContent = window.LoanAI.formatCurrency(emi);
    if (totalPrincipalDisplay) totalPrincipalDisplay.textContent = window.LoanAI.formatCurrency(P);
    if (totalInterestDisplay) totalInterestDisplay.textContent = window.LoanAI.formatCurrency(totalInterest);
    if (totalRepaymentDisplay) totalRepaymentDisplay.textContent = window.LoanAI.formatCurrency(totalRepayment);

    if (principalPercentDisplay) principalPercentDisplay.textContent = `${principalPercent.toFixed(1)}%`;
    if (interestPercentDisplay) interestPercentDisplay.textContent = `${interestPercent.toFixed(1)}%`;

    // SVG Donut Visualization
    // Circumference for r=68 is 2 * PI * 68 = 427.25
    const circumference = 427.25;
    if (donutInterestSegment) {
      const interestOffset = circumference - (interestPercent / 100) * circumference;
      donutInterestSegment.style.strokeDasharray = `${circumference}`;
      donutInterestSegment.style.strokeDashoffset = `${interestOffset}`;
    }
    if (donutCenterPercent) {
      donutCenterPercent.textContent = `${principalPercent.toFixed(0)}%`;
    }

    // Generate Yearly Amortization Schedule
    if (amortizationTableBody) {
      let balance = P;
      let scheduleHtml = '';
      const totalYears = Math.ceil(months / 12);
      let monthCount = 0;

      for (let yr = 1; yr <= totalYears; yr++) {
        const openingBalance = balance;
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;
        const monthsInThisYear = Math.min(12, months - monthCount);

        for (let m = 1; m <= monthsInThisYear; m++) {
          const interestForMonth = balance * r;
          const principalForMonth = Math.min(balance, emi - interestForMonth);
          yearlyInterest += interestForMonth;
          yearlyPrincipal += principalForMonth;
          balance = Math.max(0, balance - principalForMonth);
          monthCount++;
        }

        const totalYearPayment = yearlyPrincipal + yearlyInterest;

        scheduleHtml += `
          <tr>
            <td><strong>Year ${yr}</strong></td>
            <td>${window.LoanAI.formatCurrency(openingBalance)}</td>
            <td style="color: #67e8f9;">${window.LoanAI.formatCurrency(yearlyPrincipal)}</td>
            <td style="color: #c4b5fd;">${window.LoanAI.formatCurrency(yearlyInterest)}</td>
            <td>${window.LoanAI.formatCurrency(totalYearPayment)}</td>
            <td><strong>${window.LoanAI.formatCurrency(balance)}</strong></td>
          </tr>
        `;

        if (balance <= 0) break;
      }

      amortizationTableBody.innerHTML = scheduleHtml;
    }

    // Save snapshot
    if (window.LoanAI && window.LoanAI.saveSnapshot) {
      window.LoanAI.saveSnapshot('emiForm', {
        principal: P,
        annualRate,
        months,
        emi,
        totalInterest,
        totalRepayment,
        principalPercent,
        interestPercent
      });
    }
  }

  // Bind inputs
  bindSync(amountSlider, amountInput, calculateEmi);
  bindSync(rateSlider, rateInput, calculateEmi);
  bindSync(tenureSlider, tenureInput, calculateEmi);

  if (tenureUnitSelect) {
    tenureUnitSelect.addEventListener('change', () => {
      const isYears = tenureUnitSelect.value === 'years';
      if (isYears) {
        tenureSlider.min = 1;
        tenureSlider.max = 30;
        tenureSlider.value = Math.max(1, Math.min(30, Math.round((parseFloat(tenureInput.value) || 60) / 12)));
        tenureInput.value = tenureSlider.value;
      } else {
        tenureSlider.min = 6;
        tenureSlider.max = 360;
        tenureSlider.value = Math.max(6, Math.min(360, (parseFloat(tenureInput.value) || 5) * 12));
        tenureInput.value = tenureSlider.value;
      }
      calculateEmi();
    });
  }

  // Action Buttons
  if (saveEmiBtn) {
    saveEmiBtn.addEventListener('click', () => {
      const snap = window.LoanAI.getSnapshot('emiForm');
      if (window.LoanAI.saveUserAnalysis) {
        window.LoanAI.saveUserAnalysis('EMI Amortization Calculation', snap);
      } else {
        window.LoanAI.showToast('EMI analysis saved successfully!', 'success');
      }
    });
  }

  if (sendToAiBtn) {
    sendToAiBtn.addEventListener('click', () => {
      window.LoanAI.showToast('Transferring EMI data to AI Advisor...', 'info');
      setTimeout(() => {
        window.location.href = 'financial-tips.html';
      }, 500);
    });
  }

  // Initial Calculation
  calculateEmi();
});
