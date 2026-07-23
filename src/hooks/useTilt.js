import { useEffect, useRef } from 'react';

/**
 * useTilt
 * Adds a high-performance 3D glass-tilt effect to an element based on mouse position.
 * 
 * @param {Object} options Configuration for tilt intensity, scale, and glare.
 * @returns {React.RefObject} A React ref to attach to the target element.
 */
export function useTilt({
  max = 15,          // max tilt rotation (deg)
  scale = 1.02,      // scale on hover
  speed = 400,       // transition speed
  glare = true,      // enable inner glare effect
  maxGlare = 0.3,    // max opacity of glare
  disabled = false,  // disable tilt effect (e.g. when active/typing)
} = {}, externalRef = null) {
  const internalRef = useRef(null);
  const ref = externalRef || internalRef;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (disabled || window.matchMedia("(pointer: coarse)").matches) {
      el.style.transform = '';
      el.style.transition = '';
      return;
    }

    // Create glare element
    let glareEl;
    if (glare) {
      glareEl = document.createElement('div');
      glareEl.style.position = 'absolute';
      glareEl.style.top = '0';
      glareEl.style.left = '0';
      glareEl.style.width = '100%';
      glareEl.style.height = '100%';
      glareEl.style.pointerEvents = 'none';
      glareEl.style.backgroundImage = 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,1) 50%, transparent 80%)';
      glareEl.style.transform = 'translate(-100%, -100%)';
      glareEl.style.opacity = '0';
      glareEl.style.transition = `opacity ${speed}ms ease, transform ${speed}ms ease`;
      glareEl.style.zIndex = '1';
      glareEl.style.mixBlendMode = 'overlay';

      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.style.overflow = 'hidden';
      el.appendChild(glareEl);
    }

    el.style.transformPerspective = '1000px';
    el.style.transformStyle = 'preserve-3d';

    let animationFrameId = null;
    let rectCache = null;

    const handlePointerEnter = () => {
      rectCache = el.getBoundingClientRect();
      el.style.transition = `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`;
      if (glareEl) {
        glareEl.style.transition = `opacity ${speed}ms ease`;
      }
    };

    const handlePointerMove = (e) => {
      if (!rectCache) {
        rectCache = el.getBoundingClientRect();
      }

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        const x = e.clientX - rectCache.left; 
        const y = e.clientY - rectCache.top; 

        const centerX = rectCache.width / 2;
        const centerY = rectCache.height / 2;

        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;

        const rotateX = max * -percentY;
        const rotateY = max * percentX;

        // Set transition to none during tracking for 60-120fps smooth performance
        el.style.transition = 'none';
        el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;

        if (glareEl) {
          const glareX = percentX * 100;
          const glareY = percentY * 100;
          glareEl.style.transition = 'none';
          glareEl.style.transform = `translate(${glareX.toFixed(2)}%, ${glareY.toFixed(2)}%)`;
          
          const distance = Math.sqrt(percentX * percentX + percentY * percentY);
          glareEl.style.opacity = Math.min(distance * maxGlare, maxGlare).toString();
        }
      });
    };

    const handlePointerLeave = () => {
      rectCache = null;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      
      el.style.transition = `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`;
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

      if (glareEl) {
        glareEl.style.transition = `opacity ${speed}ms ease, transform ${speed}ms ease`;
        glareEl.style.opacity = '0';
        glareEl.style.transform = 'translate(-100%, -100%)';
      }
    };

    el.addEventListener('pointerenter', handlePointerEnter);
    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      if (glareEl && el.contains(glareEl)) {
        el.removeChild(glareEl);
      }
    };
  }, [max, scale, speed, glare, maxGlare, disabled]);

  return ref;
}
