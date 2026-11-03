/**
 * CAR SHINE - Main UI Engine
 * Navigation, Toasts, Modals, Sliders, and Interactive Helpers.
 */

// Toast Notifications System
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast ';
  
  let iconName = 'check-circle';
  let bgClass = 'bg-[#101820] text-white border border-[#252E35] dark:bg-[#1A232C] dark:border-[#35424D]';

  if (type === 'success') {
    iconName = 'check-circle-2';
    toast.className += bgClass + ' border-l-4 border-l-[#D6FF36]';
  } else if (type === 'error') {
    iconName = 'alert-circle';
    toast.className += bgClass + ' border-l-4 border-l-red-500';
  } else if (type === 'warning') {
    iconName = 'alert-triangle';
    toast.className += bgClass + ' border-l-4 border-l-amber-400';
  } else {
    iconName = 'info';
    toast.className += bgClass + ' border-l-4 border-l-blue-400';
  }

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0 ${type === 'success' ? 'text-[#D6FF36]' : type === 'error' ? 'text-red-400' : 'text-blue-400'}"></i>
    <div class="text-sm font-medium flex-1">${message}</div>
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-white p-1">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Modal Management
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

// Mobile Menu Drawer
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const menuDrawer = document.getElementById('mobile-menu-drawer');
  const closeBtn = document.getElementById('mobile-menu-close');

  if (toggleBtn && menuDrawer) {
    toggleBtn.addEventListener('click', () => {
      menuDrawer.classList.toggle('hidden');
    });
  }
  if (closeBtn && menuDrawer) {
    closeBtn.addEventListener('click', () => {
      menuDrawer.classList.add('hidden');
    });
  }
}

// Before & After Interactive Comparison Slider
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.ba-slider');
  sliders.forEach(slider => {
    const resize = slider.querySelector('.resize');
    const handle = slider.querySelector('.handle');
    if (!resize || !handle) return;

    let isDown = false;

    const moveSlider = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let pos = ((clientX - rect.left) / rect.width) * 100;
      if (pos < 5) pos = 5;
      if (pos > 95) pos = 95;
      resize.style.width = pos + '%';
      handle.style.left = pos + '%';
    };

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      moveSlider(e.clientX);
    });

    // Touch support
    slider.addEventListener('touchstart', (e) => {
      isDown = true;
      moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDown = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      moveSlider(e.touches[0].clientX);
    });
  });
}

// Active Nav link detection
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.public-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('text-[#D6FF36]', 'font-bold');
      link.classList.remove('text-gray-400', 'text-gray-600');
    }
  });
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initMobileMenu();
  initBeforeAfterSliders();
  highlightActiveNav();
});

// Expose utilities to global window
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;

