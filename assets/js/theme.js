/**
 * CAR SHINE - Theme Engine (Dark / Light Mode)
 * Ensures seamless transition, equal dimension buttons, and local persistence.
 */

(function () {
  const currentTheme = localStorage.getItem('cs_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark'); // Default to dark for premium automotive look

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

