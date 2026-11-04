// GSAP ScrollTrigger Scroll Reveal & Parallax Enhancements for Services Page
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  // Animate all service alternating sections smoothly as they scroll into view
  const serviceSections = document.querySelectorAll(
    "#exterior-wash, section:has(.badge-lime):not(#wash-section), section:has(h2:contains('Exterior')), section:has(h2:contains('Interior')), section:has(h2:contains('Polishing')), section:has(h2:contains('Detailing')), section:has(h2:contains('Ceramic'))"
  );

  const cards = document.querySelectorAll(".service-section-row");

  cards.forEach((row, index) => {
    const isEven = index % 2 === 1;
    const imgCol = row.querySelector(".service-img-col");
    const textCol = row.querySelector(".service-text-col");
    const img = row.querySelector("img");

    // Smooth Entrance Scroll Animation
    if (imgCol && textCol) {
      gsap.fromTo(
        imgCol,
        {
          opacity: 0,
          x: isEven ? 40 : -40,
          scale: 0.96
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(
        textCol,
        {
          opacity: 0,
          x: isEven ? -40 : 40
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          delay: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Subtle Image Parallax on scroll through each card
    if (img) {
      gsap.to(img, {
        y: -25,
        ease: "none",
        scrollTrigger: {
          trigger: row,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }
  });

  // Quality Process 3-Step cards entrance cascade
  const processCards = document.querySelectorAll(".process-card");
  if (processCards.length > 0) {
    gsap.fromTo(
      processCards,
      { opacity: 0, y: 35, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.18,
        duration: 0.8,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: processCards[0].parentElement,
          start: "top 82%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }
});
