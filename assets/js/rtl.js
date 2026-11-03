/**
 * CAR SHINE - RTL (Right to Left) Layout Engine
 * Supports seamless directional toggle with persistence.
 */

(function () {
  const isRTL = localStorage.getItem('cs_rtl') === 'true';
  if (isRTL) {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }
})();

function toggleRTL() {
  const currentDir = document.documentElement.getAttribute('dir');
  const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
  document.documentElement.setAttribute('dir', newDir);
  localStorage.setItem('cs_rtl', (newDir === 'rtl').toString());

  if (window.showToast) {
    window.showToast(`Switched layout to ${newDir.toUpperCase()}`, 'info');
  }
}

window.toggleRTL = toggleRTL;

