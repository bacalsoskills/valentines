import './App.css'

import { useEffect, useMemo, useRef, useState } from 'react'
import Flower from './components/Flower'
import IntroModal from './components/IntroModal'

function HeartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s-7.2-4.65-9.6-9.15C.7 8.95 2.4 6 5.55 6c1.7 0 3.05.92 3.85 2.02C10.2 6.92 11.55 6 13.25 6c3.15 0 4.85 2.95 3.15 5.85C19.2 16.35 12 21 12 21Z"
        fill="url(#g)"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="0.6"
      />
      <defs>
        <linearGradient id="g" x1="4" y1="6" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff2b6a" />
          <stop offset="0.55" stopColor="#ff4d8d" />
          <stop offset="1" stopColor="#f6c35c" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SparkleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"
        fill="rgba(246,195,92,0.85)"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.6"
      />
    </svg>
  )
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function useParallax() {
  const [y, setY] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        setY(window.scrollY || 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return y
}

function useInView(options) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), options)
    io.observe(el)
    return () => io.disconnect()
  }, [options])

  return [ref, inView]
}

function Reveal({ children, className = '', style }) {
  const [ref, inView] = useInView({ threshold: 0.18, rootMargin: '0px 0px -10% 0px' })
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'revealVisible' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

function FloatingHearts({ y }) {
  const hearts = useMemo(() => {
    const count = 34
    return Array.from({ length: count }).map((_, i) => {
      const left = (i * 97) % 100
      const top = ((i * 53) % 100) * 1.02
      const delay = (i * 0.45) % 6
      const duration = 6 + ((i * 0.77) % 8)
      const size = 8 + ((i * 11) % 28)
      const drift = -18 + ((i * 7) % 36)
      const opacity = 0.06 + ((i * 13) % 14) / 100
      const color = ['#FF6B6B','#FFB3C1','#FFD66B'][i % 3]
      return { left, top, delay, duration, size, drift, opacity, color }
    })
  }, [])

  const translateY = clamp(y * -0.08, -180, 0)
  const opacity = clamp(1 - y / 800, 0, 1)

  return (
    <div
      className="fxLayer"
      style={{ transform: `translate3d(0, ${translateY}px, 0)`, opacity }}
    >
      {hearts.map((h, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: `${h.left}%`,
            top: `${h.top}%`,
            width: h.size,
            height: h.size,
            opacity: h.opacity,
            transform: `translateX(${h.drift}px)`,
            animation: `floatUp ${h.duration}s ease-in-out ${h.delay}s infinite`,
            filter: `drop-shadow(0 18px 26px rgba(198, 15, 75, 0.18))`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden style={{ width: '100%', height: '100%' }}>
            <path d="M12 21s-7.2-4.65-9.6-9.15C.7 8.95 2.4 6 5.55 6c1.7 0 3.05.92 3.85 2.02C10.2 6.92 11.55 6 13.25 6c3.15 0 4.85 2.95 3.15 5.85C19.2 16.35 12 21 12 21Z" fill={h.color} />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translate3d(0, 30px, 0) scale(0.9); opacity: 0; }
          20% { opacity: 1; }
          55% { transform: translate3d(10px, -40px, 0) scale(1); }
          100% { transform: translate3d(-6px, -110px, 0) scale(1.02); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function Sparkles({ y }) {
  const sparkles = useMemo(() => {
    const count = 26
    return Array.from({ length: count }).map((_, i) => {
      const left = (i * 37) % 100
      const top = (i * 61) % 100
      const delay = (i * 0.33) % 5
      const duration = 3.6 + ((i * 0.41) % 3.2)
      const size = 10 + ((i * 9) % 16)
      const opacity = 0.08 + ((i * 17) % 10) / 100
      return { left, top, delay, duration, size, opacity }
    })
  }, [])

  const translateY = clamp(y * -0.04, -120, 0)
  const opacity = clamp(1 - y / 900, 0, 1)

  return (
    <div
      className="fxLayer"
      style={{ transform: `translate3d(0, ${translateY}px, 0)`, opacity }}
    >
      {sparkles.map((s, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            filter: 'drop-shadow(0 10px 22px rgba(246, 195, 92, 0.22))',
          }}
        >
          <SparkleIcon />
        </div>
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { transform: scale(0.85) rotate(0deg); opacity: 0.12; }
          40% { transform: scale(1.2) rotate(12deg); opacity: 0.30; }
          70% { transform: scale(0.92) rotate(-8deg); opacity: 0.18; }
        }
      `}</style>
    </div>
  )
}

function TypingText({ text, speedMs = 22, startDelayMs = 200 }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    let t1 = 0
    let t2 = 0
    t1 = window.setTimeout(() => {
      t2 = window.setInterval(() => {
        setI((v) => (v >= text.length ? v : v + 1))
      }, speedMs)
    }, startDelayMs)
    return () => {
      window.clearTimeout(t1)
      window.clearInterval(t2)
    }
  }, [text, speedMs, startDelayMs])

  return (
    <p className="typing">
      {text.slice(0, i)}
      <span className="caret">|</span>
    </p>
  )
}

function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function buildPlaceholderSlides() {
  return [
    // First photo shown in the main slideshow (change this path to make a different first slide)
    '/1.png', // first
    '/2.png',
    '/3.png',
    '/4.png', // last (current default set)

    // To add more photos: place your images in the `public/` folder and add the path here, e.g. '/photo5.jpg'
  ]
}

function FlipBookGallery({ images: propImages }) {
  // Default images (used when no `images` prop is provided)
  const defaultImages = useMemo(
    () => [
      { src: '/picture1.png', alt: 'A sweet memory' }, // first
      { src: '/picture2.png', alt: 'Another moment together' },
      { src: '/picture3.png', alt: 'Laughing together' },
      { src: '/picture4.png', alt: 'A special captured memory' }, // last
      { src: 'https://picsum.photos/id/1013/400/400', alt: 'Soft blurred memory' },
    ],
    [],
  )

  // Normalize incoming `images` prop which may be an array of strings or objects
  const images = useMemo(() => {
    if (!propImages || !propImages.length) return defaultImages
    return propImages.map((it) => (typeof it === 'string' ? { src: it, alt: '' } : it))
  }, [propImages, defaultImages])

  const [index, setIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(null)
  const [paused, setPaused] = useState(false)
  const [dir, setDir] = useState(1) // 1: right-to-left, -1: left-to-right (alternates)
  const slideDelay = 3000 // ms per slide
  const flipDuration = 2000 // ms for flip animation
  const prevClearRef = useRef(0)

  // helper to move to a specific index with flip animation (alternates direction)
  function goTo(i) {
    if (i === index) return
    // set prev and toggle direction for playful alternating flip
    setPrevIndex(index)
    setDir((d) => -d)
    setIndex(i)

    // clear any previous timeout and schedule clear of prevIndex after animation
    clearTimeout(prevClearRef.current)
    prevClearRef.current = setTimeout(() => setPrevIndex(null), flipDuration + 120)
  }

  useEffect(() => {
    if (paused || images.length <= 1) return
    const t = setInterval(() => goTo((index + 1) % images.length), slideDelay)
    return () => clearInterval(t)
  }, [images.length, paused, index])

  // cleanup any pending timeout if component unmounts
  useEffect(() => {
    return () => clearTimeout(prevClearRef.current)
  }, [])

  return (
    <div className="flipWrap">
      <div className="flipHeadlineContainer">
        <div className="flipShine">Happy Valentine&apos;s Day💞</div>
      </div>

      <div
        className="flipGallery"
        aria-label="Flip book gallery"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {images.map((img, i) => {
          const isActive = i === index
          const isPrev = i === prevIndex
          const inClass = dir === 1 ? 'flipInRight' : 'flipInLeft'
          const outClass = dir === 1 ? 'flipOutLeft' : 'flipOutRight'
          const cls = `flipSlide ${isActive ? `${inClass} active` : isPrev ? outClass : ''}`
          return (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className={`${cls} responsive-img`}
              onClick={() => goTo(i)}
              style={{ '--r': `${-8 + (i % 5) * 6}deg` }}
            />
          )
        })}

        <div className="flipDots" aria-hidden>
          {images.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? 'dotActive' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  const y = useParallax()
  const [slides, setSlides] = useState(() => buildPlaceholderSlides())
  const [index, setIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  // Intro modal visibility (start visible)
  const [introVisible, setIntroVisible] = useState(true)

  // prevent scrolling while intro is active
  useEffect(() => {
    document.body.style.overflow = introVisible ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [introVisible])

  const audioRef = useRef(null)
  const [musicOn, setMusicOn] = useState(false)

  useEffect(() => {
    if (!autoplay) return
    const t = window.setInterval(() => setIndex((v) => (v + 1) % slides.length), 3800)
    return () => window.clearInterval(t)
  }, [autoplay, slides.length])

  useEffect(() => {
    if (!audioRef.current) return
    if (musicOn) {
      audioRef.current.volume = 0.35
      audioRef.current.play().catch(() => {
        setMusicOn(false)
      })
    } else {
      audioRef.current.pause()
    }
  }, [musicOn])

  const onUploadImages = (files) => {
    const arr = Array.from(files || [])
    if (!arr.length) return
    const urls = arr.map((f) => URL.createObjectURL(f))
    setSlides((prev) => [...urls, ...prev])
    setIndex(0)
  }

  function startMusic() {
    if (!audioRef.current) {
      setMusicOn(true)
      return
    }
    audioRef.current.volume = 0.35
    audioRef.current.play().catch(() => setMusicOn(false))
    setMusicOn(true)
  }

  return (
    <div className={`app ${introVisible ? 'introActive' : ''}`}>
      <IntroModal visible={introVisible} onClose={() => setIntroVisible(false)} onYes={() => startMusic()} />

      <div className="fx" aria-hidden="true">
        <FloatingHearts y={y} />
        <Sparkles y={y} />
      </div>

      <header className="topbar">
        <div className="container">
          <div className="topbarInner">
            <div className="brand" role="banner">
              <div className="brandMark">
                <HeartIcon className="pillIcon" />
              </div>
              <div>For Mom</div>
            </div>
            {/* Mobile menu toggle */}
            <button
              className={`menuToggle ${menuOpen ? 'open' : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
                <path d="M0 2h22M0 8h22M0 14h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <nav className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Sections">
              {(() => {
                const navClick = (id) => {
                  scrollToId(id)
                  setMenuOpen(false)
                }
                return (
                  <>
                    <button className="pill" onClick={() => navClick('hero')}>
                      <HeartIcon className="pillIcon" /> Home
                    </button>
                    <button className="pill" onClick={() => navClick('gallery')}>
                      <SparkleIcon className="pillIcon" /> Photos
                    </button>
                    <button className="pill" onClick={() => navClick('message')}>
                      <SparkleIcon className="pillIcon" /> Message
                    </button>
                    <button className="pill" onClick={() => navClick('memories')}>
                      <HeartIcon className="pillIcon" /> Memories
                    </button>
                    <button className="pill" onClick={() => navClick('final')}>
                      <HeartIcon className="pillIcon" /> Love
                    </button>
                  </>
                )
              })()}
            </nav>
          </div>
        </div>
      </header>

      <main className="main">
        <section id="hero" className="hero">
          <div className="container">
            <div className="heroGrid">
              <Reveal>
                <h1 className="title">
                  <span className="titleGlow">Happy Valentine’s Day, Mom ❤️</span>
                </h1>
                <p className="subtitle">Thank you for your endless love and sacrifices.</p>

                <div className="ctaRow">
                  <button className="btn btnPrimary" onClick={() => scrollToId('gallery')}>
                    <SparkleIcon className="pillIcon" /> See Our Photos
                  </button>
                  <button className="btn" onClick={() => scrollToId('message')}>
                    <HeartIcon className="pillIcon" /> Read My Letter
                  </button>
                  <button
                    className="btn"
                    onClick={() => setMusicOn((v) => !v)}
                    title="Toggle background music"
                  >
                    <SparkleIcon className="pillIcon" /> {musicOn ? 'Pause Music' : 'Play Music'}
                  </button>
                </div>


              </Reveal>

              <Reveal>
                <div className="heroCard">
                  <div className="portrait portraitLovable" role="img" aria-label="A warm card for mom">
                    <div className="portraitInner">
                      <img
                        src="/picture5.png"
                        alt="Your mom’s portrait"
                        className="portraitImg responsive-img"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Flowers overlay (lowered further) */}
              <div className="flowers" aria-hidden="true" style={{ position: 'relative' }}>
                <Flower variant={1} size={20} color="#FF6B6B" speed={0.8} style={{ left: '200%', bottom: '-30vmin', position: 'absolute' }} />
                <Flower variant={1} size={10} color="#FFD66B" speed={0.9} style={{ left: '190%', bottom: '-4vmin', position: 'absolute', transform: 'scale(0.9) translateY(1vmin)' }} />
                <Flower variant={1} size={14} color="#9AD3A0" speed={0.7} style={{ left: '180%', bottom: '-5vmin', position: 'absolute' }} />
                <Flower variant={1} size={11} color="#FFB3C1" speed={1.0} style={{ left: '170%', bottom: '-4.5vmin', position: 'absolute' }} />
              </div>
            </div>
          </div>
        </section>

        <section id="gallery" className="section">
          <div className="container">
            <Reveal>
              <h2 className="h2">Photo Gallery</h2>
 
            </Reveal>

            <Reveal className="flipOuter">
              <div className="card">
                <FlipBookGallery images={slides} />
              </div>
            </Reveal>
          </div>
        </section>

        <section id="message" className="section">
          <div className="container">
            <Reveal>
              <h2 className="h2">A Message From My Heart</h2>
              <p className="lead">A little typing note, just for you.</p>
              <TypingText text="Mom, you are my strength, my home, and my forever Valentine. Thank you for loving me unconditionally." />
            </Reveal>
          </div>
        </section>

        <section id="memories" className="section">
          <div className="container">
            <Reveal>
              <div className="memoriesHeader">
                <h2 className="h2">Memories</h2>
                <div className="hearts" aria-hidden>
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span
                      key={i}
                      className="heart"
                      style={{ left: `${(i * 73) % 100}%`, top: `${(i * 37) % 40}%`, animationDelay: `${(i * 0.12) % 2}s` }}
                    >
                      ❤️
                    </span>
                  ))}
                </div>
              </div>
              <p className="lead">Little moments that make life sweeter.</p>
            </Reveal>

            <div className="memories">
              {[
                { title: 'Her hugs', text: 'The kind of comfort that makes the world feel soft again.' },
                { title: 'Her sacrifices', text: 'The quiet strength behind every step I’ve taken.' },
                { title: 'Her love', text: 'A love that shows up every day—steady, warm, and endless.' },
                { title: 'Her laughter', text: 'The sound that brightens every room and lifts my spirits.' },
                { title: 'Home-cooked meals', text: 'Simple dinners that tasted like safety and warmth.' },
                { title: 'Teaching me', text: 'Lessons that shaped how I try to be in the world.' },
              ].map((m, i) => (
                <Reveal key={m.title} style={{ transitionDelay: `${i * 90}ms` }}>
                  <div className="memoryCard">
                    <div className="memoryInner">
                      <h3 className="memoryTitle">{m.title}</h3>
                      <p className="memoryText">{m.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="final" className="section">
          <div className="container">
            <div className="finalWrap">
              <Reveal>
                <audio ref={audioRef} src="/muisc.mp3" preload="none" loop />
                <svg className="bigHeart" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 21s-7.2-4.65-9.6-9.15C.7 8.95 2.4 6 5.55 6c1.7 0 3.05.92 3.85 2.02C10.2 6.92 11.55 6 13.25 6c3.15 0 4.85 2.95 3.15 5.85C19.2 16.35 12 21 12 21Z"
                    fill="url(#fg)"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="0.7"
                  />
                  <defs>
                    <linearGradient id="fg" x1="4" y1="6" x2="20" y2="21" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ff2b6a" />
                      <stop offset="0.55" stopColor="#ff4d8d" />
                      <stop offset="1" stopColor="#f6c35c" />
                    </linearGradient>
                  </defs>
                </svg>
                <h2 className="h2" style={{ marginTop: 14 }}>
                  I Love You Always, Mom 💖
                </h2>
                <p className="lead" style={{ marginTop: 10 }}>
                  Happy Valentine’s Day. Thank you for being my everything.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
