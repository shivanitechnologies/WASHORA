/**
 * CAR SHINE - Theme Engine (Dark / Light Mode)
 * Default: Light mode for first-time visitors.
 * Persists user preference via localStorage.
 */

(function () {
  const stored = localStorage.getItem('cs_theme');
  // First visit: default to light. Returning user: use their saved preference.
  const currentTheme = stored || 'light';

  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  const newTheme = isDark ? 'dark' : 'light';
  localStorage.setItem('cs_theme', newTheme);
  
  // Update icons if lucide is available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Dispatch event for components that need theme awareness (e.g. charts)
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
}

window.toggleTheme = toggleTheme;

