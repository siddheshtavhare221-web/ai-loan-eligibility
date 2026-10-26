# LoanAI — Smart Financial Decision Support Platform

[![Platform](https://img.shields.io/badge/Platform-BFSI%20Decision%20Support-06b6d4.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20ES6%2B-8b5cf6.svg)](#)
[![Deployment](https://img.shields.io/badge/Deploy-GitHub%20Pages%20Ready-10b981.svg)](#)
[![Security](https://img.shields.io/badge/Security-Zero%20Secret%20Exposure-f59e0b.svg)](#)

A modern, responsive, BFSI (Banking, Financial Services & Insurance) financial decision-support and loan underwriting estimation prototype built using **HTML5, CSS3, and modern modular JavaScript**. 

Designed with a **dark glassmorphism fintech aesthetic**, **LoanAI** bridges the gap between complex institutional credit underwriting heuristics and personal financial planning by combining deterministic mathematical models with intelligent AI advisory abstractions.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Core Objectives](#3-core-objectives)
4. [Key Features](#4-key-features)
5. [Project Architecture & File Structure](#5-project-architecture--file-structure)
6. [Module Deep Dive](#6-module-deep-dive)
   - [Loan Eligibility Checker](#module-1-loan-eligibility-checker)
   - [Credit Score Analyzer](#module-2-credit-score-analyzer)
   - [Real-Time EMI Calculator](#module-3-real-time-emi-calculator)
   - [AI Financial Tips & Advisor](#module-4-ai-financial-tips--advisor)
7. [Business Rules & Mathematical Formulations](#7-business-rules--mathematical-formulations)
8. [Claude AI Integration Architecture](#8-claude-ai-integration-architecture)
9. [Google Sheets Integration Architecture](#9-google-sheets-integration-architecture)
10. [Client-Side Validation & Error Handling](#10-client-side-validation--error-handling)
11. [Responsive Design & Visual Design Tokens](#11-responsive-design--visual-design-tokens)
12. [GitHub Pages Deployment Instructions](#12-github-pages-deployment-instructions)
13. [Future Enhancements](#13-future-enhancements)
14. [Institutional Disclaimer](#14-institutional-disclaimer)

---

## 1. Project Overview

Retail loan applicants often struggle to understand how banking institutions determine creditworthiness, borrowing ceilings, and interest rate margins. Traditional bank portals often require sensitive personal identifiers (PAN, Aadhaar, SSN) before revealing eligibility criteria, creating friction and unwanted credit inquiries.

**LoanAI** provides an unencumbered, client-side, real-time financial decision-support tool. It empowers borrowers to simulate borrowing scenarios, understand debt-to-income (DTI) thresholds, audit credit score factor impacts, compute accurate reducing-balance EMI schedules, and access contextual financial advice—all without exposing confidential credentials.

---

## 2. Problem Statement

Retail borrowing faces several critical user experience and financial literacy hurdles:
1. **Underwriting Opacity:** Borrowers are unaware of Fixed Obligation to Income Ratio (FOIR) restrictions and how existing EMIs drastically curtail borrowing capacity.
2. **Credit Bureau Ambiguity:** Consumers often know their 3-digit bureau score (e.g. 720) but do not understand the underlying mathematical weights (Payment History 35%, Utilization 30%, Age 15%, Mix 10%, Inquiries 10%).
3. **Compound Interest Illusion:** Borrowers fail to visualize the proportion of total interest repaid relative to the principal over extended tenures.
4. **Data Privacy Concerns:** Sharing personal contact details on lead-generation aggregator portals results in unsolicited telemarketing calls and unnecessary hard inquiries.

---

## 3. Core Objectives

* **Deterministic Precision:** Perform all financial calculations, FOIR caps, DTI ratios, and amortization schedules using rigorous, standardized JavaScript algorithms.
* **Intelligent AI Explanations:** Deploy modern AI advisory patterns to synthesize contextual observations and customized action plans without replacing deterministic calculations.
* **Zero Secret Exposure:** Guarantee complete compliance with fintech security standards by avoiding exposed API tokens in client-side repositories.
* **Instant Interaction:** Ensure zero page reloads during parameter adjustments via responsive event listeners and reactive DOM updates.
* **Accessibility & Responsiveness:** Adhere to WCAG 2.1 accessibility guidelines and fluid desktop-to-mobile layouts.

---

## 4. Key Features

* **Multi-Page Architecture:** Dedicated modular pages for Landing, Loan Eligibility, Credit Score, EMI Calculator, and AI Financial Tips.
* **Dark Glassmorphism Design System:** Layered backdrop blurs, glow borders, responsive flex/grid layouts, and custom range sliders.
* **Live Circular SVG Meters:** Dynamic gauges for credit bureau score bands and eligibility indices.
* **Animated SVG Donut Visualization:** Real-time visual comparison of Principal vs. Interest percentage on reducing-balance schedules.
* **Full Yearly Amortization Table:** Period-by-period breakdown of opening balance, principal repaid, interest paid, and closing balance.
* **Cross-Module State Synchronization:** Seamless profile transfer from Loan Eligibility and Credit Score modules directly to the AI Advisor via browser session storage.
* **Comprehensive Toast Notification Engine:** Non-intrusive feedback toasts for calculations, data transfers, and record saves.

---

## 5. Project Architecture & File Structure

```text
ai-loan-eligibility-checker/
├── index.html               # Landing & Overview page with hero, live metrics & features
├── loan-eligibility.html    # Loan Eligibility Checker (DTI, Age, Income, Risk)
├── credit-score.html        # Credit Score Health Analyzer & 5-Factor Impact Audit
├── emi-calculator.html      # Real-Time EMI Calculator with visual donut & amortization table
├── financial-tips.html      # AI Financial Advisor & Chat-Style Contextual Guidance
├── css/
│   └── style.css            # Master styles: Glassmorphism tokens, Grid/Flexbox, Animations
├── js/
│   ├── main.js              # Global navbar, mobile drawer, formatting, notifications & state sync
│   ├── loan.js              # Deterministic loan eligibility rules, scoring & risk classification
│   ├── credit.js            # Credit bureau metrics, factor weights, and improvement roadmap
│   ├── emi.js               # Reducing-balance EMI formula, SVG Donut chart, amortization table
│   └── ai.js                # Claude AI & Google Sheets abstraction + contextual reasoning engine
└── README.md                # Comprehensive documentation
```

---

## 6. Module Deep Dive

### Module 1: Loan Eligibility Checker (`loan-eligibility.html`)
Evaluates applicant eligibility based on cash flow, employment type, age horizons, existing liabilities, and credit rating.
* **Key Inputs:** Monthly Income, Existing EMIs, Employment Category, Applicant Age, Bureau Score, Desired Loan Amount, Tenure.
* **Key Outputs:**
  * **Eligibility Status:** `Eligible`, `Needs Review`, or `Not Eligible`.
  * **Risk Tier:** `Low Risk`, `Moderate Risk`, or `High Risk`.
  * **Eligibility Index (0–100):** Weighted composite score.
  * **Maximum Eligible Loan Capacity:** Maximum borrowing permissible under regulatory FOIR caps.
  * **Projected Total DTI Ratio:** Colored progress bar with healthy (<40%), standard (50%), and high risk (>60%) thresholds.
  * **Strengths & Underwriting Concerns:** Bulleted factor impact breakdown.

### Module 2: Credit Score Analyzer (`credit-score.html`)
Deconstructs bureau credit scores using standard international scoring models (CIBIL / FICO).
* **5-Factor Analysis:**
  1. *Payment History (35% Weight):* Evaluates on-time payment track record.
  2. *Credit Card Utilization (30% Weight):* Evaluates percentage of assigned revolving limits in use.
  3. *Credit History Longevity (15% Weight):* Evaluates age of active accounts.
  4. *Credit Mix & Lines (10% Weight):* Evaluates balance of secured vs. unsecured credit.
  5. *Recent Hard Inquiries (10% Weight):* Assesses new credit-seeking behavior.
* **Output:** Circular score gauge, tier badge (Exceptional, Very Good, Good, Fair, Poor), and a prioritized 30-Day, 90-Day, and 1-Year credit improvement roadmap.

### Module 3: Real-Time EMI Calculator (`emi-calculator.html`)
Models reducing-balance loan repayment without page reloads.
* **Live Inputs:** Principal amount (₹1 Lakh to ₹2 Crores), Annual Interest Rate (4% to 25%), and Tenure (Years or Months).
* **Visual Output:**
  * Monthly installment amount (EMI).
  * Total interest payable and overall repayment total.
  * Interactive SVG Donut Chart highlighting the exact principal vs. interest proportion.
  * Complete period-by-period Amortization Schedule table detailing principal and interest components each year.

### Module 4: AI Financial Tips & Advisor (`financial-tips.html`)
Provides conversational, structured financial advisory based on the user's combined financial metrics.
* **Contextual Inputs:** Monthly take-home pay, existing debt commitments, credit score, target loan amount, and borrowing objective.
* **Interactive Quick Chips:** Pre-built strategy prompts such as *"Lower EMI burden"*, *"Boost credit to 780+"*, *"Prepay vs. Invest"*, and *"Max safe home loan"*.
* **Structured Output:** Executive Financial Summary, Key Observations & Bottlenecks, Prioritized Actionable Recommendations, Stress Testing scenarios, and Risk-Weighted Guidance.

---

## 7. Business Rules & Mathematical Formulations

### 1. Reducing-Balance EMI Formula
The monthly repayment installment ($EMI$) is calculated using the standard institutional reducing-balance formula:

$$EMI = P \times r \times \frac{(1+r)^n}{(1+r)^n - 1}$$

Where:
* $P$ = Principal loan amount
* $r$ = Monthly interest rate $= \frac{\text{Annual Interest Rate}}{12 \times 100}$
* $n$ = Total number of monthly installments $= \text{Tenure in Years} \times 12$

Total Repayment $= EMI \times n$  
Total Interest Payable $= \text{Total Repayment} - P$

---

### 2. Fixed Obligation to Income Ratio (FOIR) & Borrowing Capacity
Institutional lenders restrict total monthly debt commitments to a percentage of net monthly income (FOIR):

$$\text{Max FOIR} = 
\begin{cases} 
40\% & \text{if Monthly Income} < ₹30,000 \\
50\% & \text{if } ₹30,000 \le \text{Monthly Income} < ₹80,000 \\
60\% & \text{if Monthly Income} \ge ₹80,000 
\end{cases}$$

Employment multipliers apply to adjust for cash flow variance:
* Salaried: $1.0\times$
* Self-Employed Professional: $0.95\times$
* Business Owner: $0.90\times$
* Gig / Freelance: $0.82\times$

$$\text{Net Available Monthly EMI} = (\text{Monthly Income} \times \text{Max FOIR} \times \text{Multiplier}) - \text{Existing EMIs}$$

The maximum eligible loan capacity ($P_{\text{max}}$) is the present value of the net available EMI over the tenure:

$$P_{\text{max}} = \text{Net Available EMI} \times \frac{(1+r)^n - 1}{r \times (1+r)^n}$$

---

### 3. Debt-to-Income (DTI) Ratio

$$DTI_{\text{total}} = \frac{\text{Existing EMIs} + EMI_{\text{requested}}}{\text{Monthly Income}} \times 100\%$$

* **DTI $\le 35\%$:** Low Risk / Prime capacity.
* **$36\% \le \text{DTI} \le 50\%$:** Moderate Risk / Standard underwriting threshold.
* **DTI $> 50\%$:** High Risk / Restrictive debt burden.

---

## 8. Claude AI Integration Architecture

To ensure adherence to BFSI security standards and zero secret exposure on public GitHub repositories, `js/ai.js` implements a clean abstraction layer:

```javascript
window.LoanAI.generateFinancialAdvice(financialData)
```

### Architectural Separation
1. **Production Mode (Secure Backend Proxy):**  
   When connecting to live Anthropic Claude models, set `CLAUDE_PROXY_ENDPOINT` in `js/ai.js`. The client dispatches a sanitized JSON payload to an authenticated serverless proxy (e.g., Cloudflare Worker, AWS Lambda, or Node.js backend). The proxy appends the private `ANTHROPIC_API_KEY` securely in backend environment variables and returns the response. **No secret credentials ever touch client code.**

2. **Demo Mode (Deterministic Contextual Reasoning Engine):**  
   For client-side deployments and GitHub Pages demonstration, the engine evaluates real user inputs (net income, DTI, credit tier, target loan) to synthesize structured, mathematically grounded Markdown advice with simulated streaming latency.

---

## 9. Google Sheets Integration Architecture

To enable record persistence without exposing Google Cloud Service Account private keys or OAuth secrets, `js/ai.js` defines:

```javascript
window.LoanAI.saveUserAnalysis(moduleName, payload)
```

### Integration Workflow
* **Production Hook:** Configure `GOOGLE_SHEETS_WEBHOOK_URL` in `js/ai.js` pointing to a deployed **Google Apps Script Web App**. The client sends an asynchronous `POST` request with the analysis record.
* **Demo / Local Fallback:** Captures records into the browser's structured `localStorage` audit trail (`loanai_audit_trail`), assigns a unique receipt ID (`REC-XXXXX`), logs the payload to the developer console, and triggers a confirmation toast.

---

## 10. Client-Side Validation & Error Handling

* **Range Bounds:** Enforces age boundaries ($21 \le \text{Age} \le 65$), valid credit scores ($300 \le \text{Score} \le 900$), and positive monetary inputs.
* **Cross-Field Validation:** Validates that existing EMI commitments do not exceed monthly income.
* **Graceful Fallbacks:** Zero and negative values are handled safely; fallback messages and zeroed metrics prevent JavaScript runtime exceptions.
* **ARIA & Accessibility:** Semantic `<label>` bindings, `aria-expanded` attributes on responsive drawer toggles, and high-contrast color pairings.

---

## 11. Responsive Design & Visual Design Tokens

The interface uses a **dark glassmorphism fintech aesthetic** built on standard CSS custom properties:

```css
:root {
  --bg-base: #060911;
  --glass-bg: rgba(16, 24, 40, 0.70);
  --glass-border: rgba(255, 255, 255, 0.09);
  --glass-blur: blur(16px);
  --primary: #06b6d4;
  --secondary: #8b5cf6;
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
  --accent-rose: #f43f5e;
}
```

* **Desktop ($\ge 1024\text{px}$):** Two-column split layout with sticky assessment sidebars.
* **Tablet ($768\text{px} - 1023\text{px}$):** Single-column adaptive grids with full touch target sizes.
* **Mobile ($< 768\text{px}$):** Collapsible glassmorphic drawer navigation, full-width cards, and zero horizontal scrolling.
* **Motion Preferences:** Respects `prefers-reduced-motion` to suppress animations for sensitive users.

---

## 12. GitHub Pages Deployment Instructions

This prototype is built using standard HTML5, CSS3, and ES6+ JavaScript, requiring no npm build steps, compilers, or server runtime.

### Step 1: Initialize Git Repository
```bash
cd ai-loan-eligibility-checker
git init
git add .
git commit -m "feat: initial commit for LoanAI BFSI decision support prototype"
```

### Step 2: Push to GitHub
```bash
git remote add origin https://github.com/<your-username>/ai-loan-eligibility-checker.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on **GitHub.com**.
2. Navigate to **Settings** > **Pages** (under Code and automation).
3. Under **Branch**, select `main` and root directory `/(root)`.
4. Click **Save**.
5. Your prototype will be live at `https://<your-username>.github.io/ai-loan-eligibility-checker/` within 1–2 minutes!

---

## 13. Future Enhancements

* **Multi-Currency Toggle:** Instant switching between INR (₹ Lakhs/Crores) and USD ($ Millions) with auto-converted benchmark interest tiers.
* **Co-Applicant Income Pooling:** Interactive co-borrower module to model dual-income eligibility and tax exemptions.
* **PDF Report Generation:** Client-side generation of comprehensive decision-support audit certificates using `jspdf`.
* **PWA Offline Support:** Service worker caching for offline calculations in areas with intermittent connectivity.

---

## 14. Institutional Disclaimer

> **IMPORTANT NOTICE:**  
> **LoanAI** is an educational financial decision-support and eligibility estimation prototype. All calculations, eligibility statuses, interest rates, and risk tiers are mathematical estimates derived from standard BFSI heuristics. This application does not constitute a legal loan sanction, certified financial planner (CFP) advice, or a guaranteed bank commitment. Actual loan sanctions are subject to individual bank underwriting policies, documentation verification, physical KYC, and formal bureau approval.
