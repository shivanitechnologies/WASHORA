// GSAP ScrollTrigger Foam Car Wash Animation for Services Hero
gsap.registerPlugin(ScrollTrigger);

(function () {
  const TOTAL_FRAMES = 120;
  const FRAME_FOLDER = "assets/animation-img/";
  const canvas = document.getElementById("carCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false });
  const progressBar = document.getElementById("progress-bar");
  const title = document.getElementById("stage-title");
  const description = document.getElementById("stage-description");
  const stageNumber = document.getElementById("stage-number");
  const scrollHint = document.getElementById("scroll-hint");
  const loadingMessage = document.getElementById("loading-message");

  const stages = [
    {
      frame: 0,
      title: "Your Car Deserves",
      highlight: "A Perfect Shine.",
      description: "Discover Chennai's premier doorstep car care and precision detailing.",
      number: "01 / 05"
    },
    {
      frame: 24,
      title: "Powerful High-Pressure",
      highlight: "Pre-Rinse Wash.",
      description: "High-pressure soft water removes road film, grit, and loose abrasives without scratching.",
      number: "02 / 05"
    },
    {
      frame: 48,
      title: "Experience Thick",
      highlight: "Snow Foam Bath.",
      description: "pH-neutral active snow foam encapsulates dirt particles and floats them gently away.",
      number: "03 / 05"
    },
    {
      frame: 78,
      title: "Purified De-Ionized",
      highlight: "Spotless Rinse.",
      description: "Filtered soft water flush eliminates mineral water spots and leaves paint streak-free.",
      number: "04 / 05"
    },
    {
      frame: 102,
      title: "Mirror Gloss Finish &",
      highlight: "Ceramic Sealant.",
      description: "Hand-buffed micro-fiber finish with hydrophobic UV ceramic protection for lasting brilliance.",
      number: "05 / 05"
    }
  ];

  let frames = [];
  let currentFrame = 0;
  let readyCount = 0;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    drawFrame(currentFrame);
  }

  function drawFrame(index) {
    const img = frames[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;
    const x = (canvas.width - drawWidth) / 2;
    const y = (canvas.height - drawHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  }

  function updateStage(frame) {
    let active = stages[0];
    for (const stage of stages) {
      if (frame >= stage.frame) active = stage;
    }
    if (title) {
      title.innerHTML = active.highlight
        ? `${active.title} <br><span class="text-[#D6FF36] drop-shadow-[0_2px_12px_rgba(214,255,54,0.4)]">${active.highlight}</span>`
        : `<span class="text-[#D6FF36]">${active.title}</span>`;
    }
    if (description) description.textContent = active.description;
    if (stageNumber) stageNumber.textContent = active.number;
  }

  function startScrollAnimation() {
    const playhead = { frame: 0 };
    gsap.to(playhead, {
      frame: TOTAL_FRAMES - 1,
      ease: "none",
      snap: "frame",
      onUpdate: () => {
        currentFrame = Math.round(playhead.frame);
        drawFrame(currentFrame);
        updateStage(currentFrame);
        if (progressBar) {
          progressBar.style.height = `${(currentFrame / (TOTAL_FRAMES - 1)) * 100}%`;
        }
        if (scrollHint) {
          scrollHint.style.opacity = currentFrame > 6 ? "0" : "1";
        }
      },
      scrollTrigger: {
        trigger: "#wash-section",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4
      }
    });

    ScrollTrigger.refresh();
  }

  function loadFrames() {
    const promises = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = `${FRAME_FOLDER}foam-${String(i).padStart(3, "0")}.jpg`;
      frames.push(img);
      promises.push(
        new Promise((resolve) => {
          img.onload = () => {
            readyCount++;
            // Draw first frame immediately as soon as frame 0 is ready
            if (readyCount === 1) {
              drawFrame(0);
            }
            resolve();
          };
          img.onerror = () => {
            // gracefully continue
            resolve();
          };
        })
      );
    }

    Promise.all(promises).then(() => {
      if (loadingMessage) loadingMessage.style.display = "none";
      resizeCanvas();
      drawFrame(0);
      updateStage(0);
      startScrollAnimation();
    });
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  loadFrames();
})();
