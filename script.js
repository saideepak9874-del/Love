window.onload = () => {
  const noBtn = document.getElementById("no");
  const yesBtn = document.getElementById("yes");
  const main = document.getElementById("main");
  const intermission = document.getElementById("intermission");
  const proceedBtn = document.getElementById("proceedBtn");
  const memorial = document.getElementById("memorial");
  const bgMusic = document.getElementById("bgMusic");
  const airlineLink = document.getElementById("airlineLink");

  // --- Evasive & Logic Variables ---
  let active = false;
  let isRespawning = false;
  let noX, noY, targetX, targetY;
  const SPEED = 0.2; 
  const MARGIN = 20;
  const SAFE_RADIUS = 90; 
  const ESCAPE_FORCE = 15; 
  let pointerX = null, pointerY = null;

  // --- "Crazy No" Conversation Messages ---
  const noMessages = [
    "No 🙈",
    "Noooo? 🤨",
    "No way! 🙅‍♀️",
    "Are you sure? 🥺",
    "Think again... 🌹",
    "Last chance! 💎",
    "Wrong button! 😂",
    "Still no? 😭",
    "You're being mean! 💔",
    "Just click Yes! ✨"
  ];
  let noClickCount = 0;

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  function moveButtonRandomly() {
    const rect = noBtn.getBoundingClientRect();
    noX = Math.random() * (window.innerWidth - rect.width - MARGIN * 2) + MARGIN;
    noY = Math.random() * (window.innerHeight - rect.height - MARGIN * 2) + MARGIN;
    targetX = noX;
    targetY = noY;
    noBtn.style.left = `${noX}px`;
    noBtn.style.top = `${noY}px`;
  }

  function handleNoInteraction(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    noClickCount++;
    const messageIndex = Math.min(noClickCount, noMessages.length - 1);
    noBtn.textContent = noMessages[messageIndex];
    const currentScale = 1 + (noClickCount * 0.1);
    yesBtn.style.transform = `scale(${currentScale})`;
    moveButtonRandomly();
  }

  function activateAvoidance(e) {
    if (!active) {
      active = true;
      const rect = noBtn.getBoundingClientRect();
      noX = rect.left;
      noY = rect.top;
      targetX = noX;
      targetY = noY;
      noBtn.style.position = "fixed";
      noBtn.style.left = `${noX}px`;
      noBtn.style.top = `${noY}px`;
      noBtn.style.margin = "0";
      noBtn.style.zIndex = "1000";
      noBtn.style.touchAction = "none"; 
      document.body.appendChild(noBtn);
    }
  }

  noBtn.addEventListener("mouseenter", activateAvoidance);
  noBtn.addEventListener("pointerdown", (e) => {
    activateAvoidance(e);
    handleNoInteraction(e);
  });

  const updatePointer = (x, y) => { pointerX = x; pointerY = y; };
  document.addEventListener("mousemove", e => updatePointer(e.clientX, e.clientY));
  document.addEventListener("touchmove", e => {
    updatePointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  function animate() {
    if (active && pointerX !== null && !isRespawning && noBtn.parentNode) {
      const rect = noBtn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(btnCenterX - pointerX, btnCenterY - pointerY);

      if (rect.left < 2 || rect.right > window.innerWidth - 2 || rect.top < 2 || rect.bottom > window.innerHeight - 2) {
        isRespawning = true;
        noBtn.style.opacity = "0";
        setTimeout(() => {
          if(noBtn.parentNode) {
              moveButtonRandomly();
              noBtn.style.opacity = "1";
          }
          isRespawning = false;
        }, 200);
      }

      if (!isRespawning && dist < SAFE_RADIUS) {
        let dx = btnCenterX - pointerX;
        let dy = btnCenterY - pointerY;
        const len = Math.hypot(dx, dy) || 1;
        targetX += (dx / len) * (SAFE_RADIUS - dist + ESCAPE_FORCE);
        targetY += (dy / len) * (SAFE_RADIUS - dist + ESCAPE_FORCE);
      }

      if (!isRespawning) {
        targetX = clamp(targetX, MARGIN, window.innerWidth - rect.width - MARGIN);
        targetY = clamp(targetY, MARGIN, window.innerHeight - rect.height - MARGIN);
        noX += (targetX - noX) * SPEED;
        noY += (targetY - noY) * SPEED;
        noBtn.style.left = `${noX}px`;
        noBtn.style.top = `${noY}px`;
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  function showMemorial() {
    memorial.classList.add("active");
    const photoRow = document.getElementById("photoRow");
    const videoRow = document.getElementById("videoRow");
    const letterEl = document.getElementById("letter");

    // --- INFINITE FIREWORKS LOOP ---
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    const infiniteConfetti = setInterval(() => {
      confetti(Object.assign({}, defaults, { 
        particleCount: 35, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount: 35, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      }));
    }, 500); // Fires every half second
    // -------------------------------

    photoRow.innerHTML = "";
    ["assets/photo1.jpeg", "assets/photo2.jpeg", "assets/photo3.jpeg", "assets/photo4.jpeg"].forEach(src => {
      const img = document.createElement("img"); img.src = src; photoRow.appendChild(img);
    });

    videoRow.src = "assets/video.mp4";
    videoRow.setAttribute("playsinline", "");
    videoRow.muted = true;
    videoRow.play();

    const letterText = `To my forever VALENTINE,\n\nBaby I never knew love could be this beautiful until I met you , Thank you for coming into my life. Every moment with you feels like home, You make my days brighter and my heart calmer. Your smile the best stress reliever-no matter how stressed I am. You are my world. When you are beside me, every day feels like Valentine's Day, and you are special to me every single day. My love for you grows stronger by time. I know I might not be the perfect boyfriend, but I promise I’ll always strive to be better everyday. I can’t see bear to see you in tears, and no matter what, I promise-you are the love of my life. No matter how many storms come our way, as long as you hold my hand, I am ready to overcome anything. I really can’t wait to grow older and wiser with you.\n\nThank you my love\n\nI love you to the moon and back❤️\n\nKhushi’s Saideepak\n\n❤️`;

    let i = 0;
    const typeInterval = setInterval(() => {
      if(letterText[i] !== undefined) {
        letterEl.textContent += letterText[i]; i++;
        if (i % 5 === 0) memorial.scrollTop = memorial.scrollHeight;
      } else {
        clearInterval(typeInterval);
        if(airlineLink) airlineLink.classList.add("show");
      }
    }, 45);
  }

  yesBtn.addEventListener("click", () => {
    main.style.display = "none";
    if(noBtn.parentNode) noBtn.style.display = "none"; 
    intermission.style.display = "flex"; 
    if (bgMusic) bgMusic.play().catch(() => {});
  });

  proceedBtn.addEventListener("click", () => {
    intermission.style.display = "none";
    if(noBtn.parentNode) noBtn.remove(); 
    if (bgMusic) bgMusic.play(); 
    showMemorial();
  });
};
