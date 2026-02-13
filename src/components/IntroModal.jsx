import React, { useEffect, useRef, useState } from 'react'
import './IntroModal.css'

export default function IntroModal({ visible = true, onClose = () => {}, onYes = () => {} }) {
  const [noCount, setNoCount] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef(null)
  const yesRef = useRef(null)

  useEffect(() => {
    if (!visible) return
    // add a small delay so the entrance transition is visible even when mounted initially
    const t1 = setTimeout(() => setMounted(true), 20)
    // focus the Yes button when modal opens
    const t2 = setTimeout(() => yesRef.current?.focus(), 80)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [visible])

  useEffect(() => {
    if (!visible) {
      // ensure we reset mounted state when modal is hidden
      setMounted(false)
    }
  }, [visible])

  useEffect(() => {
    if (!visible) return
    const onKey = (e) => {
      if (e.key === 'y' || e.key === 'Y') handleYes()
      if (e.key === 'n' || e.key === 'N') handleNo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, noCount])

  useEffect(() => {
    // reset when reopened
    if (visible) {
      setNoCount(0)
      setIsClosing(false)
    }
  }, [visible])

  const [shrug, setShrug] = useState(false)

  function handleNo() {
    setNoCount((c) => c + 1)
    setShrug(true)
    setTimeout(() => setShrug(false), 420)
  }

  function handleYes() {
    // allow parent to start music immediately (user gesture)
    try { onYes() } catch (e) {}
    // play closing animation then call onClose
    setIsClosing(true)
    // wait for CSS transition
    setTimeout(() => onClose(), 520)
  }

  const yesScale = 1 + Math.min(noCount * 0.06, 0.6)
  const yesTranslate = Math.min(noCount * 8, 48) // px towards center (right)
  const noTranslate = Math.min(20 + noCount * 36, 220) // px away to the right
  const noScale = Math.max(0.55, 1 - noCount * 0.08)

  const yesStyle = {
    transform: `translateX(${yesTranslate}px) scale(${yesScale})`,
  }
  const noStyle = {
    transform: `translateX(${noTranslate}px) scale(${noScale}) rotate(${noCount * 6}deg)`,
  }

  // build a bunch of floating hearts for background
  const hearts = Array.from({ length: 18 }).map((_, i) => {
    const left = `${(i * 73) % 100}%`
    const delay = `${(i * 0.29) % 2.2}s`
    const size = 6 + ((i * 7) % 18)
    const duration = 4 + ((i * 1.2) % 7)
    const color = ['#FF6B6B', '#FFB3C1', '#FFD66B'][i % 3]
    const opacity = 0.6 + ((i * 5) % 4) / 10
    return { left, delay, size, color, duration, opacity }
  })

  return (
    <div
      ref={containerRef}
      className={`introModal ${mounted ? 'introVisible' : ''} ${isClosing ? 'introClosing' : ''}`}
      aria-hidden={!visible}
    >
      <div className="introBackdrop" />

      {/* corner heart clusters (top-left / top-right) */}
      <div className="cornerHearts cornerLeft" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`l-${i}`}
            className="cornerHeart"
            style={{ left: `${i * 9}%`, animationDelay: `${i * 0.14}s` }}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="tinyHeart">
              <path d="M12 21s-7.2-4.65-9.6-9.15C.7 8.95 2.4 6 5.55 6c1.7 0 3.05.92 3.85 2.02C10.2 6.92 11.55 6 13.25 6c3.15 0 4.85 2.95 3.15 5.85C19.2 16.35 12 21 12 21Z" fill="#FF6B6B"/>
            </svg>
          </div>
        ))}
      </div>

      <div className="cornerHearts cornerRight" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`r-${i}`}
            className="cornerHeart"
            style={{ right: `${i * 9}%`, animationDelay: `${i * 0.12}s` }}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="tinyHeart">
              <path d="M12 21s-7.2-4.65-9.6-9.15C.7 8.95 2.4 6 5.55 6c1.7 0 3.05.92 3.85 2.02C10.2 6.92 11.55 6 13.25 6c3.15 0 4.85 2.95 3.15 5.85C19.2 16.35 12 21 12 21Z" fill="#FFD66B"/>
            </svg>
          </div>
        ))}
      </div>

      <div className="introPanel" role="dialog" aria-modal="true">
        <h2 className="introTitle">Happy Valentine’s Day ❤️</h2>
        <p className="introSub">Would you like to see what’s inside?</p>

        <div className="introButtons">
          <button ref={yesRef} className="introBtn introYes btnPrimary" style={yesStyle} onClick={handleYes}>
            Yes
          </button>

          <button className={`introBtn introNo ${shrug ? 'shrug' : ''}`} style={noStyle} onClick={handleNo}>
            No
          </button>
        </div>

    
      </div>

      <div className="introParticles" aria-hidden="true">
        {hearts.map((h, i) => (
          <div
            key={i}
            className="introHeart"
            style={{
              left: h.left,
              animationDelay: h.delay,
              animationDuration: `${h.duration}s`,
              width: h.size,
              height: h.size,
              opacity: h.opacity,
            }}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="tinyHeart">
              <path d="M12 21s-7.2-4.65-9.6-9.15C.7 8.95 2.4 6 5.55 6c1.7 0 3.05.92 3.85 2.02C10.2 6.92 11.55 6 13.25 6c3.15 0 4.85 2.95 3.15 5.85C19.2 16.35 12 21 12 21Z" fill={h.color}/>
            </svg>
          </div>
        ))}
      </div> 
    </div>
  )
}
