import { Link } from 'react-router-dom'

const INDUSTRIES = ['Manufacturing', 'Retail', 'Services', 'Construction']

const FloatingCard = ({ className, children }) => (
  <div
    className={`absolute bg-white rounded-xl shadow-md border border-[#e8e8e0] px-4 py-3 ${className}`}
  >
    {children}
  </div>
)

// Places `count` dots evenly around a circle of `radius` px, centered on
// whatever element this is rendered inside (that element must be the one
// with position:relative/absolute and the rotation animation on it).
// `colors` (if given) alternates per dot; falls back to `colorClass`.
const OrbitDots = ({ count, radius, size = 8, colorClass = '', colors, startAngle = 0 }) => {
  return Array.from({ length: count }).map((_, i) => {
    const angle = startAngle + (360 / count) * i
    const dotColor = colors ? colors[i % colors.length] : colorClass
    return (
      <span
        key={i}
        className={`absolute rounded-full ${dotColor}`}
        style={{
          width: size,
          height: size,
          top: '50%',
          left: '50%',
          // rotate to the dot's angle, push it out to the radius, then
          // rotate back so the dot itself stays upright — the standard
          // "N items on a circle" trick. Centered with a negative margin
          // instead of translate(-50%,-50%) so it composes cleanly with
          // the rotate/translate chain.
          transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
          marginTop: -size / 2,
          marginLeft: -size / 2,
        }}
      />
    )
  })
}

const Hero = () => {
  return (
    <section
      className="w-full bg-[#f0ede6] relative overflow-hidden"
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >

      {/* Animation styles */}
      <style>{`
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes erpFloat {
          0%, 100% { transform: translateY(-6px); }
          50% { transform: translateY(6px); }
        }

        .orbit-ring {
          animation: orbitSpin 23s linear infinite;
        }

        .orbit-ring-outer {
          animation: orbitSpin 34s linear infinite reverse;
        }

        .erp-float {
          animation: erpFloat 5s ease-in-out infinite;
        }
      `}</style>


      {/* Noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />


      <div className="max-w-7xl mx-auto px-6 w-full">

        {/* Top */}
        <div className="flex items-center justify-between pt-8 pb-2">

          <div className="flex items-center gap-2 text-[10px] text-[#999] tracking-[0.18em] uppercase font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5a7a4a]" />
            AI-Powered Enterprise Resource Planning
          </div>

          <div className="text-[10px] text-[#bbb] tracking-[0.15em] hidden sm:block">
            Est. 2026 &nbsp;·&nbsp; v2.0
          </div>

        </div>


        {/* Main */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-0 pt-10 pb-16">

          {/* LEFT */}
          <div className="flex-[1.1] flex flex-col gap-7 pr-0 lg:pr-12">

            <h1
              className="text-[#1a1a14] leading-[1.02] tracking-[-0.02em] font-bold"
              style={{ fontSize: 'clamp(3.2rem, 6.5vw, 6rem)' }}
            >
              Run Your<br />
              Entire<br />
              Business.<br />
              <span className="text-[#4a6741]">Intelligently.</span>
            </h1>

            <div className="border-l-2 border-[#c8c4b8] pl-4 max-w-[340px]">
              <p className="text-[#666] text-[15px] leading-[1.7]">
                One intelligent ERP platform for finance, sales,
                operations, people and projects — with AI built into
                every layer, not bolted on after.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1">
              <Link
                to="/request-demo"
                className="inline-flex items-center gap-2 bg-[#1a1a14] text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2d2d20] transition-colors duration-150"
              >
                Request a Demo →
              </Link>

              <Link
                to="/platform"
                className="inline-flex items-center gap-2 text-[#444] text-sm font-medium px-6 py-3 rounded-xl border border-[#ccc8be] hover:bg-[#e8e4dc] transition-colors duration-150"
              >
                Explore Platform
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-0 mt-3">
              {INDUSTRIES.map((ind, i) => (
                <span key={ind} className="flex items-center">
                  <span className="text-[10px] text-[#999] tracking-[0.16em] uppercase">
                    {ind}
                  </span>
                  {i < INDUSTRIES.length - 1 && (
                    <span className="mx-3 text-[#ccc]">·</span>
                  )}
                </span>
              ))}
            </div>

          </div>


          {/* RIGHT */}
          <div className="flex-1 relative min-h-[380px] lg:min-h-[460px]">

            {/* Background dots */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #a0a090 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* =================================================
                ORBIT SYSTEM.

                IMPORTANT: a CSS @keyframes animation on `transform`
                completely REPLACES that element's transform — it
                does not merge with a `translate(-50%,-50%)` set via
                a utility class. That was the earlier bug: animating
                elements that relied on translate-based centering
                snapped to their top-left corner instead, so the
                ring and bubble drifted apart by different amounts
                (they're different sizes).

                Fix: centering here uses MARGIN (negative half the
                box's own size), never transform. The elements that
                actually animate (.orbit-ring, .erp-float) live one
                level deeper, sized to fill their already-centered
                parent exactly — so their rotate/translateY keyframes
                have nothing to clobber, and everything stays on the
                exact same center point.
            ================================================== */}
            <div className="absolute left-1/2 top-1/2">

              {/* OUTER RING POSITIONER — same centering trick, larger
                  box (380px) so its radius (190px) sits just outside
                  the inner ring's (150px). Rotates the opposite
                  direction and slower, for depth. */}
              <div
                className="absolute"
                style={{ width: 380, height: 380, marginLeft: -190, marginTop: -190 }}
              >
                <div className="orbit-ring-outer absolute inset-0">
                  <OrbitDots
                    count={6}
                    radius={230}
                    startAngle={30}
                    colors={['bg-[#9caf8b]', 'bg-[#8fa47e]']}
                  />
                </div>
              </div>

              {/* RING POSITIONER — centered via margin, never moves,
                  never animates. 300px box, centered on the point. */}
              <div
                className="absolute"
                style={{ width: 300, height: 300, marginLeft: -150, marginTop: -150 }}
              >
                {/* the actual rotating element — fills the box
                    exactly, so rotate() spins it around its own
                    center, which is the same point as the parent's
                    center. No translate here to lose. */}
                <div className="orbit-ring absolute inset-0">
                  <OrbitDots
                    count={6}
                    radius={150}
                    colors={['bg-[#8fa47e]', 'bg-[#9caf8b]']}
                  />
                </div>
              </div>

              {/* BUBBLE POSITIONER — same trick, 144px box (w-36
                  h-36), centered via margin on the exact same point
                  as the ring above. */}
              <div
                className="absolute"
                style={{ width: 144, height: 144, marginLeft: -72, marginTop: -72 }}
              >
                <div className="erp-float absolute inset-0 rounded-full bg-[#11130f] flex flex-col items-center justify-center z-10 shadow-[0_0_35px_rgba(50,65,42,0.12)]">
                  <div className="grid grid-cols-2 gap-[5px] mb-2">
                    <span className="w-[18px] h-[18px] rounded-[4px] bg-[#5a7a4a]" />
                    <span className="w-[18px] h-[18px] rounded-[4px] bg-[#4a6638] opacity-75" />
                    <span className="w-[18px] h-[18px] rounded-[4px] bg-[#3a5228] opacity-50" />
                    <span className="w-[18px] h-[18px] rounded-[4px] bg-[#6a8a5a] opacity-35" />
                  </div>
                  <span className="text-white text-[11px] font-semibold tracking-wide">
                    SmartERP
                  </span>
                  <span className="text-[#888] text-[9px] tracking-widest">
                    AI
                  </span>
                </div>
              </div>

            </div>

            {/* =========================
                AI CONFIDENCE
            ========================== */}
            <FloatingCard className="top-8 right-0 lg:right-4 min-w-[110px]">
              <p className="text-[#aaa] text-[9px] uppercase tracking-[0.14em] mb-1">
                AI Confidence
              </p>
              <p className="text-[#1a1a14] text-3xl font-bold leading-none">
                87%
              </p>
            </FloatingCard>

            {/* =========================
                MODULES
            ========================== */}
            <FloatingCard className="top-1/2 -translate-y-1/2 right-0 lg:-right-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5a7a4a] shrink-0" />
              <span className="text-[#1a1a14] text-[12px] font-semibold whitespace-nowrap tracking-wide">
                10 Modules Live
              </span>
            </FloatingCard>

            {/* =========================
                FRAUD ALERTS
            ========================== */}
            <div className="absolute bottom-10 left-[42%] -translate-x-1/2 bg-[#1a1a14] text-white rounded-xl px-5 py-3 shadow-xl z-10">
              <p className="text-[#888] text-[9px] uppercase tracking-[0.14em] mb-1">
                Fraud Alerts
              </p>
              <p className="text-white text-2xl font-bold leading-none">
                Zero
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  )
}

export default Hero
