import { useEffect } from "react";

export default function SparkCursor() {
  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const maxStars = 40; // The pool of retro stars
    const colors = ['#ff0000', '#00ff00', '#ffffff', '#ff00ff', '#ffa500', '#ffff00', '#00ff00'];
    const stars = [];

    // 1. Create the retro DOM elements (a pool of 5x5 cross shapes)
    for (let i = 0; i < maxStars; i++) {
      const star = document.createElement("div");
      star.style.position = "fixed";
      star.style.width = "5px";
      star.style.height = "5px";
      star.style.backgroundColor = "transparent";
      star.style.pointerEvents = "none";
      star.style.zIndex = "9999";
      star.style.visibility = "hidden";

      // The horizontal bar of the + shape
      const horiz = document.createElement("div");
      horiz.style.position = "absolute";
      horiz.style.width = "5px";
      horiz.style.height = "1px";
      horiz.style.top = "2px";
      horiz.style.left = "0px";

      // The vertical bar of the + shape
      const vert = document.createElement("div");
      vert.style.position = "absolute";
      vert.style.width = "1px";
      vert.style.height = "5px";
      vert.style.top = "0px";
      vert.style.left = "2px";

      star.appendChild(horiz);
      star.appendChild(vert);
      document.body.appendChild(star);

      stars.push({
        el: star,
        h: horiz,
        v: vert,
        x: 0,
        y: 0,
        life: 0,
        dx: (i % 5 - 2) / 5, // The exact horizontal drift math from the 2000s script
      });
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId;
    let lastTime = 0;

    // 2. The Animation Loop
    const animate = (time) => {
      // Throttle to ~25fps to get that authentic, slightly choppy 2000s feel
      // (The original script used setTimeout(..., 40) which is 25 frames per second)
      if (time - lastTime > 40) {
        lastTime = time;

        // If mouse moved, spawn a star
        if (Math.abs(mouseX - lastMouseX) > 1 || Math.abs(mouseY - lastMouseY) > 1) {
          lastMouseX = mouseX;
          lastMouseY = mouseY;
          
          // Find an inactive star in the pool to recycle
          const inactiveStar = stars.find((s) => s.life === 0);
          if (inactiveStar) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            inactiveStar.h.style.backgroundColor = color;
            inactiveStar.v.style.backgroundColor = color;
            inactiveStar.x = mouseX;
            inactiveStar.y = mouseY + 1;
            inactiveStar.life = 50; // Lives for 50 frames
            inactiveStar.el.style.visibility = "visible";
            
            // Reset to full 5x5 cross shape
            inactiveStar.h.style.width = "5px";
            inactiveStar.h.style.left = "0px";
            inactiveStar.v.style.height = "5px";
            inactiveStar.v.style.top = "0px";
          }
        }

        // Move all active stars
        for (let i = 0; i < maxStars; i++) {
          const s = stars[i];
          if (s.life > 0) {
            s.life--;

            // The exact falling speed math from the original
            s.y += 1 + Math.random() * 3; 
            s.x += s.dx;

            // Retro "clip" effect: at half-life, shrink the cross into a tiny 2x2 square
            if (s.life === 25) {
              s.h.style.width = "2px";
              s.h.style.left = "1px";
              s.v.style.height = "2px";
              s.v.style.top = "1px";
            }
            
            // Just before dying, shrink to a 1x1 dot
            if (s.life === 15) {
              s.h.style.width = "1px";
              s.v.style.height = "1px";
            }

            // If it falls off screen or runs out of life, hide it
            if (s.y > window.innerHeight) s.life = 0; 

            if (s.life === 0) {
              s.el.style.visibility = "hidden";
            } else {
              s.el.style.left = `${s.x}px`;
              s.el.style.top = `${s.y}px`;
            }
          }
        }
      }
      
      // Loop the animation
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 3. Cleanup on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      stars.forEach((s) => s.el.remove());
    };
  }, []);

  return null;
}