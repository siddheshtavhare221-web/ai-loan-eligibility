/**
 * LoanAI - Global Utilities & Application Engine
 * Handles navigation, mobile drawer, formatting, notifications, and cross-module state sync.
 */

// Global State Namespace
window.LoanAI = window.LoanAI || {
  currency: 'INR', // 'INR' or 'USD'
  currencySymbol: '₹',
  
  // Format currency with locale formatting
  formatCurrency: function(amount) {
    if (isNaN(amount) || amount === null) return `${this.currencySymbol}0`;
    const num = Math.round(Number(amount));
    if (this.currency === 'INR') {
      return '₹' + num.toLocaleString('en-IN');
    }
    return '$' + num.toLocaleString('en-US');
  },

  // Format compact currency (e.g. ₹25.5L or $250k)
  formatCompactCurrency: function(amount) {
    if (isNaN(amount) || amount === null) return `${this.currencySymbol}0`;
    const num = Number(amount);
    if (this.currency === 'INR') {
      if (num >= 10000000) {
        return `₹${(num / 10000000).toFixed(2)} Cr`;
      } else if (num >= 100000) {
        return `₹${(num / 100000).toFixed(2)} L`;
      } else if (num >= 1000) {
        return `₹${(num / 1000).toFixed(1)}k`;
      }
      return `₹${num}`;
    } else {
      if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(2)}M`;
      } else if (num >= 1000) {
        return `$${(num / 1000).toFixed(1)}k`;
      }
      return `$${num}`;
    }
  },

  // Toast notification manager
  showToast: function(message, type = 'info', duration = 3800) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon based on type
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div style="flex: 1; font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Save current financial snapshot to localStorage for seamless cross-module workflows
  saveSnapshot: function(key, data) {
    try {
      const existing = JSON.parse(localStorage.getItem('loanai_user_data') || '{}');
      existing[key] = data;
      existing.updatedAt = new Date().toISOString();
      localStorage.setItem('loanai_user_data', JSON.stringify(existing));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  // Retrieve stored snapshot
  getSnapshot: function(key) {
    try {
      const data = JSON.parse(localStorage.getItem('loanai_user_data') || '{}');
      return key ? data[key] : data;
    } catch (e) {
      return null;
    }
  }
};

// Initialize Navigation & Global Event Handlers
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Drawer Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active Link Highlight based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Slider Fill Sync Helper
  const sliders = document.querySelectorAll('.slider-control');
  sliders.forEach(slider => {
    const updateSliderFill = () => {
      const min = Number(slider.min) || 0;
      const max = Number(slider.max) || 100;
      const val = Number(slider.value);
      const percentage = ((val - min) / (max - min)) * 100;
      slider.style.background = `linear-gradient(to right, #06b6d4 0%, #3b82f6 ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`;
    };
    updateSliderFill();
    slider.addEventListener('input', updateSliderFill);
  });
});
