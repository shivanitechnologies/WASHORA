// CAR SHINE - Hero Cinematic Animation Controller

function startHeroAnimation() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  // Add the animation trigger class
  hero.classList.add("start");
}

function replayHeroAnimation() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  // Temporarily strip class and force reflow to restart CSS keyframe animations
  hero.classList.remove("start");
  void hero.offsetWidth; // Force CSS reflow
  hero.classList.add("start");
}

function setHeroAnimationMode(mode) {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  // Reset any custom mode classes
  hero.classList.remove("mode-reveal", "mode-close");

  if (mode === "reveal") {
    hero.classList.add("mode-reveal");
  } else if (mode === "close") {
    hero.classList.add("mode-close");
  }

  // Restart animation with newly chosen mode
  replayHeroAnimation();
}

// Window load listener
window.addEventListener("load", function () {
  startHeroAnimation();
});

// Immediate execution fallback if already loaded
if (document.readyState === "complete" || document.readyState === "interactive") {
  startHeroAnimation();
}
