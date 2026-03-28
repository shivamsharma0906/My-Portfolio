import { useEffect } from 'react'

/**
 * useFadeIn - Robustly attaches an IntersectionObserver to all .fade-in elements.
 * Uses a small rAF delay to let React finish rendering before querying the DOM.
 */
export function useFadeIn() {
  useEffect(() => {
    let rafId
    let observer

    const observe = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
            }
          })
        },
        { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
      )

      const elements = document.querySelectorAll('.fade-in')
      elements.forEach((el) => observer.observe(el))
    }

    // Wait two animation frames so React finishes all DOM mutations
    rafId = requestAnimationFrame(() => {
      requestAnimationFrame(observe)
    })

    return () => {
      cancelAnimationFrame(rafId)
      observer?.disconnect()
    }
  }, [])
}
