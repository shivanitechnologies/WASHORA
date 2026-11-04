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

// Mobile Menu Drawer (Right-Side Slide-In Panel)
function initMobileMenu() {
  const toggleBtns = document.querySelectorAll('#mobile-menu-toggle, #mobile-menu-btn');
  const menuDrawers = document.querySelectorAll('#mobile-menu-drawer, #mobile-menu');
  const closeBtns = document.querySelectorAll('#mobile-menu-close');

  function openDrawer(drawer) {
    if (!drawer) return;
    drawer.classList.remove('hidden');
    // Force reflow so CSS animation triggers reliably
    void drawer.offsetWidth;
    drawer.classList.add('drawer-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer(drawer) {
    if (!drawer) return;
    drawer.classList.remove('drawer-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!drawer.classList.contains('drawer-open')) {
        drawer.classList.add('hidden');
      }
    }, 320);
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuDrawers.forEach(drawer => openDrawer(drawer));
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuDrawers.forEach(drawer => closeDrawer(drawer));
    });
  });

  // Clicking outside on the dark backdrop overlay closes the drawer
  menuDrawers.forEach(drawer => {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        closeDrawer(drawer);
      }
    });
  });
}

// Before & After Interactive Comparison Slider
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.ba-slider');
  sliders.forEach(slider => {
    const resize = slider.querySelector('.resize');
    const handle = slider.querySelector('.handle');
    const resizeImg = resize ? resize.querySelector('img') : null;
    if (!resize || !handle) return;

    // Keep resize inner image exactly synchronized with the outer slider container width
    const syncImageWidth = () => {
      if (resizeImg) {
        resizeImg.style.width = slider.offsetWidth + 'px';
      }
    };
    syncImageWidth();
    window.addEventListener('resize', syncImageWidth);

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

// Universal Dashboard Sidebar & Backdrop Handler for Mobile
function initDashboardSidebar() {
  const sidebar = document.getElementById('dash-sidebar');
  const openBtn = document.getElementById('sidebar-open-btn');
  const closeBtn = document.getElementById('sidebar-close-btn');

  if (!sidebar) return;

  // Create backdrop element if not exists
  let backdrop = document.querySelector('.dashboard-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'dashboard-backdrop';
    document.body.appendChild(backdrop);
  }

  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSidebar();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSidebar();
    });
  }

  backdrop.addEventListener('click', closeSidebar);

  // Close when tapping any link inside the sidebar on mobile
  const navLinks = sidebar.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initMobileMenu();
  initDashboardSidebar();
  initBeforeAfterSliders();
  highlightActiveNav();
});

// Expose utilities to global window
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;

