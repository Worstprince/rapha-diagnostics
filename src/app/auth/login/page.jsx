"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Figtree, Noto_Sans } from "next/font/google";

import BrandMark from "@/components/BrandMark";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";

import "./login.css";

/* "Medical Clean" pairing: Figtree carries the headings, Noto Sans the running
   text. Loaded through next/font so the files are self-hosted and the metrics
   are known up front — no CDN request at runtime and no shift when they land.
   Exposed as CSS variables because the styling all lives in login.css. */
const display = Figtree({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--rd-font-display",
  display: "swap",
});

const body = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--rd-font-body",
  display: "swap",
});

const ROLE_ROUTES = {
  Administrator: "/dashboard/admin",
  Receptionist: "/dashboard/reception",
  "Medical Technologist": "/dashboard/medtech",
  Pathologist: "/dashboard/doctor",
  Physician: "/dashboard/doctor",
};

/* Named off the route map so the panel cannot advertise a role the app no
   longer routes anywhere. Display order is intake → bench → sign-out → admin,
   which is the order a specimen actually passes through. */
const STAFF_ROLES = [
  "Reception",
  "Medical Technologist",
  "Pathologist",
  "Physician",
  "Administrator",
];

const SKIN = "#f6dfd0";
const SKIN_SHADE = "#ecc2ac";
const CAP = "#22d3ee";
const CAP_HEM = "#0d94ac";
const SCRUBS = "#0f7c93";
const SCRUBS_DARK = "#0a5c6e";
const GLOVE = "#bde9f5";
const GLOVE_CUFF = "#0d94ac";
const STETH = "#12283a";
const METAL = "#cbd5e1";
const INK = "#12202e";
const FEATURE = "#663d32";
const BLUSH = "#f2a08c";
const TONGUE = "#f4a0b0";

const VB_W = 140;
const VB_H = 132;
const EYE_L_X = 56;
const EYE_R_X = 84;
const EYE_CY = 62;

const PUPIL_MAX_X = 5;
const PUPIL_MAX_Y = 4;
const HEAD_FOLLOW = 0.3;
const HEAD_TILT_DEG = 4;
const GAZE_RADIUS = 320;
const PEEK_CONVERGE = 3.2;

const HAND_POSE = {
  rest: { l: "translate(0px, 0px) rotate(0deg)", r: "translate(0px, 0px) rotate(0deg)" },
  cover: { l: "translate(24px, -42px) rotate(12deg)", r: "translate(-24px, -42px) rotate(-12deg)" },
  peek: { l: "translate(11px, -34px) rotate(-8deg)", r: "translate(-11px, -34px) rotate(8deg)" },
};

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduce;
}

function useLoginMascot() {
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState(null);
  const [caret, setCaret] = useState(0);

  const mirrorRef = useRef(null);
  const blurTimer = useRef(null);
  const errorTimer = useRef(null);

  useEffect(() => {
    const span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    Object.assign(span.style, {
      position: "absolute",
      top: "0",
      left: "0",
      visibility: "hidden",
      whiteSpace: "pre",
      pointerEvents: "none",
    });
    document.body.appendChild(span);
    mirrorRef.current = span;
    return () => {
      span.remove();
      mirrorRef.current = null;
    };
  }, []);

  useEffect(
    () => () => {
      clearTimeout(blurTimer.current);
      clearTimeout(errorTimer.current);
    },
    [],
  );

  const trackCaret = useCallback((e) => {
    const input = e.currentTarget;
    const mirror = mirrorRef.current;
    if (!input || !mirror) return;

    const cs = getComputedStyle(input);
    mirror.style.fontFamily = cs.fontFamily;
    mirror.style.fontSize = cs.fontSize;
    mirror.style.fontWeight = cs.fontWeight;
    mirror.style.fontStyle = cs.fontStyle;
    mirror.style.letterSpacing = cs.letterSpacing;

    let index;
    try {
      index = input.selectionStart ?? input.value.length;
    } catch {
      index = input.value.length;
    }

    mirror.textContent = input.value.slice(0, index);
    const usable = Math.max(
      1,
      input.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
    );
    setCaret(Math.min(1, mirror.getBoundingClientRect().width / usable));
  }, []);

  const enter = useCallback((field) => {
    clearTimeout(blurTimer.current);
    setResult(null);
    setFocused(field);
  }, []);

  const leave = useCallback(() => {
    blurTimer.current = setTimeout(() => setFocused(null), 0);
  }, []);

  const emailBindings = {
    onFocus: (e) => {
      enter("email");
      trackCaret(e);
    },
    onBlur: leave,
    onKeyUp: trackCaret,
    onClick: trackCaret,
  };

  const passwordBindings = { onFocus: () => enter("password"), onBlur: leave };

  const toggleShowPassword = useCallback(() => setShowPassword((v) => !v), []);

  const celebrate = useCallback(() => {
    setFocused(null);
    setResult("success");
  }, []);

  const shake = useCallback(() => {
    setResult("error");
    clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setResult(null), 900);
  }, []);

  const state =
    result ??
    (focused === "email"
      ? "watchingEmail"
      : focused === "password"
        ? showPassword
          ? "peeking"
          : "hidingEyes"
        : "idle");

  return {
    state,
    caret,
    emailBindings,
    passwordBindings,
    trackCaret,
    showPassword,
    toggleShowPassword,
    celebrate,
    shake,
  };
}

function LoginMascot({ state = "idle", caret = 0, className = "", width = 148 }) {
  const rootRef = useRef(null);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [blinking, setBlinking] = useState(false);
  const reduce = useReducedMotion();

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const following = state === "idle" && !reduce;

  useEffect(() => {
    if (!following) return;
    const el = rootRef.current;
    if (!el) return;

    let rect = el.getBoundingClientRect();
    let frame = 0;
    let pending = null;

    const remeasure = () => {
      rect = el.getBoundingClientRect();
    };

    const apply = () => {
      frame = 0;
      if (!pending) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * (EYE_CY / VB_H);
      let x = (pending.x - cx) / GAZE_RADIUS;
      let y = (pending.y - cy) / GAZE_RADIUS;
      const len = Math.hypot(x, y);
      if (len > 1) {
        x /= len;
        y /= len;
      }
      setGaze({ x, y });
    };

    const onMove = (e) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("scroll", remeasure, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [following]);

  useEffect(() => {
    if (reduce) return;
    let open;
    let close;
    const schedule = () => {
      close = setTimeout(
        () => {
          setBlinking(true);
          open = setTimeout(() => {
            setBlinking(false);
            schedule();
          }, 150);
        },
        3000 + Math.random() * 3000,
      );
    };
    schedule();
    return () => {
      clearTimeout(close);
      clearTimeout(open);
    };
  }, [reduce]);

  let gx = 0;
  let gy = 0;
  if (state === "watchingEmail") {
    gx = caret * 1.7 - 0.85;
    gy = 0.55;
  } else if (state === "hidingEyes") {
    gy = 0.2;
  } else if (state === "peeking") {
    gy = 0.85;
  } else if (following) {
    ({ x: gx, y: gy } = gaze);
  }

  const covered = state === "hidingEyes";
  const success = state === "success";
  const converge = state === "peeking" ? PEEK_CONVERGE : 0;
  const dip = state === "watchingEmail" ? 1.5 : 0;

  const head = `translate(${gx * PUPIL_MAX_X * HEAD_FOLLOW}px, ${
    gy * PUPIL_MAX_Y * HEAD_FOLLOW + dip
  }px) rotate(${gx * HEAD_TILT_DEG}deg)`;

  const pupil = (side) =>
    `translate(${gx * PUPIL_MAX_X + converge * side}px, ${gy * PUPIL_MAX_Y}px)`;

  const lid = covered || blinking ? 1 : 0;
  const browY = state === "watchingEmail" || success ? -3 : covered ? 1 : 0;
  const browRot = state === "error" ? 12 : 0;
  const pose = covered ? "cover" : state === "peeking" ? "peek" : "rest";
  const mouth = success ? "big" : covered ? "shy" : state === "error" ? "frown" : "smile";

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ width, pointerEvents: "none", userSelect: "none" }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        aria-hidden="true"
        focusable="false"
        style={{
          display: "block",
          overflow: "visible",
          filter: "drop-shadow(0 12px 26px rgba(2, 8, 20, 0.6))",
        }}
      >
        <defs>
          <radialGradient id={`${uid}-glow`}>
            <stop offset="0%" stopColor={CAP} stopOpacity="0.28" />
            <stop offset="100%" stopColor={CAP} stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}-eyeL`}>
            <ellipse cx={EYE_L_X} cy={EYE_CY} rx="12" ry="13" />
          </clipPath>
          <clipPath id={`${uid}-eyeR`}>
            <ellipse cx={EYE_R_X} cy={EYE_CY} rx="12" ry="13" />
          </clipPath>
        </defs>

        <ellipse cx="70" cy="64" rx="66" ry="60" fill={`url(#${uid}-glow)`} />

        <g
          className={`lm-x ${success ? "lm-bounce" : ""}`}
          style={{ transformOrigin: "70px 128px" }}
        >
          <rect x="59" y="94" width="22" height="19" rx="8" fill={SKIN} />
          <path d="M20 132 C21 115 34 105 52 102 L88 102 C106 105 119 115 120 132 Z" fill={SCRUBS} />
          <path d="M58 103 L70 119 L82 103 Z" fill={SKIN} />
          <path
            d="M58 103 L70 119 L82 103"
            fill="none"
            stroke={SCRUBS_DARK}
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <g fill="none" stroke={STETH} strokeWidth="2.6" strokeLinecap="round">
            <path d="M60 107 C46 112 40 122 44 132" />
            <path d="M80 107 C94 111 101 119 95 124" />
          </g>
          <circle cx="95" cy="127" r="6.5" fill={METAL} />
          <circle cx="95" cy="127" r="3.6" fill={CAP_HEM} />

          <g
            className={`lm-x lm-head ${state === "error" ? "lm-shake" : ""}`}
            style={{ transformOrigin: "70px 92px", transform: head }}
          >
            <ellipse cx="25" cy="64" rx="5.5" ry="7.5" fill={SKIN} />
            <ellipse cx="115" cy="64" rx="5.5" ry="7.5" fill={SKIN} />
            <ellipse cx="70" cy="62" rx="46" ry="42" fill={SKIN} />
            <ellipse cx="50" cy="80" rx="6.5" ry="4.6" fill={BLUSH} opacity="0.42" />
            <ellipse cx="90" cy="80" rx="6.5" ry="4.6" fill={BLUSH} opacity="0.42" />

            <path
              d="M25 56 C25 28 45 17 70 17 C95 17 115 28 115 56 C100 42 88 36 70 36 C52 36 40 42 25 56 Z"
              fill={CAP}
            />
            <path
              d="M25 56 C40 42 52 36 70 36 C88 36 100 42 115 56"
              fill="none"
              stroke={CAP_HEM}
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <g fill="#ffffff" opacity="0.92">
              <rect x="66.8" y="20" width="6.4" height="13" rx="1.6" />
              <rect x="62.8" y="23.3" width="14.4" height="6.4" rx="1.6" />
            </g>

            <g className="lm-fade" style={{ opacity: success ? 0 : 1 }}>
              {[
                { x: EYE_L_X, side: 1, clip: `${uid}-eyeL` },
                { x: EYE_R_X, side: -1, clip: `${uid}-eyeR` },
              ].map(({ x, side, clip }) => (
                <g key={clip}>
                  <ellipse cx={x} cy={EYE_CY} rx="12" ry="13" fill="#ffffff" />
                  <g clipPath={`url(#${clip})`}>
                    <g className="lm-x lm-pupil" style={{ transform: pupil(side) }}>
                      <circle cx={x} cy={EYE_CY} r="5.6" fill={INK} />
                      <circle cx={x + 1.9} cy={EYE_CY - 2.1} r="1.9" fill="#ffffff" opacity="0.92" />
                      <circle cx={x - 2.4} cy={EYE_CY + 2.6} r="1" fill={CAP} opacity="0.8" />
                    </g>
                    <g
                      className="lm-x lm-lid"
                      style={{ transformOrigin: `${x}px 48px`, transform: `scaleY(${lid})` }}
                    >
                      <rect x={x - 13} y="48" width="26" height="28" fill={SKIN} />
                      <path
                        d={`M${x - 8} ${EYE_CY} Q${x} ${EYE_CY + 4.5} ${x + 8} ${EYE_CY} Q${x} ${EYE_CY + 2.5} ${x - 8} ${EYE_CY} Z`}
                        fill={INK}
                      />
                    </g>
                  </g>
                </g>
              ))}
            </g>

            <g
              className="lm-fade"
              style={{ opacity: success ? 1 : 0 }}
              fill="none"
              stroke={INK}
              strokeWidth="4"
              strokeLinecap="round"
            >
              <path d="M46 65 Q56 54 66 65" />
              <path d="M74 65 Q84 54 94 65" />
            </g>

            <g fill="none" stroke={FEATURE} strokeWidth="3.5" strokeLinecap="round">
              <g
                className="lm-x lm-brow"
                style={{
                  transformOrigin: "56px 45px",
                  transform: `translateY(${browY}px) rotate(${-browRot}deg)`,
                }}
              >
                <path d="M48 47 Q56 42 64 46" />
              </g>
              <g
                className="lm-x lm-brow"
                style={{
                  transformOrigin: "84px 45px",
                  transform: `translateY(${browY}px) rotate(${browRot}deg)`,
                }}
              >
                <path d="M76 46 Q84 42 92 47" />
              </g>
            </g>

            <path d="M67 78 Q70 76 73 78 Q71.5 83 70 83.5 Q68.5 83 67 78 Z" fill={SKIN_SHADE} />

            <g className="lm-x" style={{ transformOrigin: "70px 90px" }}>
              <path
                className="lm-fade"
                style={{ opacity: mouth === "smile" ? 1 : 0 }}
                d="M61 88 Q70 96 79 88"
                fill="none"
                stroke={FEATURE}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                className="lm-fade"
                style={{ opacity: mouth === "shy" ? 1 : 0 }}
                d="M62 90 Q66 87 70 90 Q74 93 78 90"
                fill="none"
                stroke={FEATURE}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                className="lm-fade"
                style={{ opacity: mouth === "frown" ? 1 : 0 }}
                d="M61 94 Q70 86 79 94"
                fill="none"
                stroke={FEATURE}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <g className="lm-fade" style={{ opacity: mouth === "big" ? 1 : 0 }}>
                <path d="M58 86 Q70 102 82 86 Z" fill="#5a2d26" />
                <path d="M65 93.5 Q70 100 75 93.5 Z" fill={TONGUE} />
              </g>
            </g>
          </g>

          {[
            { side: "l", cx: 32, dir: 1, cls: "" },
            { side: "r", cx: 108, dir: -1, cls: " lm-paw-r" },
          ].map(({ side, cx, dir, cls }) => (
            <g
              key={side}
              className={`lm-x lm-paw${cls}`}
              data-covering={covered || state === "peeking" ? "true" : "false"}
              style={{ transformOrigin: `${cx}px 104px`, transform: HAND_POSE[pose][side] }}
            >
              <ellipse cx={cx} cy="104" rx="14" ry="12" fill={GLOVE} />
              <circle cx={cx - 8} cy="95" r="4.4" fill={GLOVE} />
              <circle cx={cx} cy="93" r="4.4" fill={GLOVE} />
              <circle cx={cx + 8} cy="95" r="4.4" fill={GLOVE} />
              <ellipse cx={cx + 11 * dir} cy="107" rx="4.6" ry="5.4" fill={GLOVE} />
              <rect x={cx - 11} y="111" width="22" height="7" rx="3.5" fill={GLOVE_CUFF} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

const ECG_PATH = [
  "M0 90",
  "L250 90",
  "L272 90",
  "Q282 80 292 90",
  "L306 90",
  "L312 98",
  "L318 34",
  "L324 118",
  "L330 90",
  "Q344 76 358 90",
  "L378 90",
  "L396 90",
  "Q406 80 416 90",
  "L430 90",
  "L436 98",
  "L442 34",
  "L448 118",
  "L454 90",
  "Q468 76 482 90",
  "L500 90",
  "L600 90",
].join(" ");

function EcgLine({ className = "" }) {
  return (
    <div className={`ecg ${className}`} aria-hidden="true">
      <svg className="ecg-svg" viewBox="0 0 600 150" preserveAspectRatio="xMidYMid meet">
        <path className="ecg-base" d={ECG_PATH} />
        <path className="ecg-beam" d={ECG_PATH} pathLength="1000" />
      </svg>
    </div>
  );
}

const TAU = Math.PI * 2;

const DNA_TILT = -0.61;
const DNA_SPAN = 0.22;
const DNA_PITCH_RATIO = 1;
const DNA_OVERSHOOT = 1.15;
const DNA_BACKBONE_DOTS = 1200;
const DNA_RUNGS = 32;
const DNA_RUNG_DOTS = 30;
const DNA_TUBE = 0.15;
const DNA_TURN_SECONDS = 25;
const DNA_ACCENT_CHANCE = 0.32;
const DNA_INTRO = 2.2;
const DNA_INTRO_STAGGER = 0.7;
const DNA_PILLS = 5;
const DNA_HAZE = 4;
const DNA_DOT_R = 9.5;
const DNA_FOCUS_STEPS = 6;
const DNA_STATIC_ANGLE = 1.15;

/* Two strands, so the helix still reads as two things rather than a rope. Both
   sit in the blue family now: the rose that used to pair with the blue was the
   loudest colour on a page whose logo already owns three hues. */
const DNA_PILL_HUES = ["#0284c7", "#6366f1"];

const DNA_THEME = {
  dark: {
    core: "#38bdf8",
    accent: "#818cf8",
    shellHi: "#ffffff",
    shellLo: "#9fb3cc",
    rim: "rgba(255,255,255,0.34)",
    haze: "#1d4ed8",
    hazeBlend: "lighter",
    hazeAlpha: 0.2,
    glow: 1,
    pillAlpha: 0.26,
    alphaBase: 0.35,
    alphaSpan: 0.5,
  },
  light: {
    /* Darker and weaker than the dark set across the board. On a pale canvas
       the field is behind white cards rather than glowing through dark glass,
       so anything at full strength shows as grubby smudges around the panels. */
    core: "#0369a1",
    accent: "#4f46e5",
    shellHi: "#f4f8fd",
    shellLo: "#7c8ba1",
    rim: "rgba(12,74,110,0.26)",
    haze: "#3b82f6",
    hazeBlend: "source-over",
    hazeAlpha: 0.14,
    glow: 0.42,
    pillAlpha: 0.26,
    alphaBase: 0.42,
    alphaSpan: 0.34,
  },
};

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ease = (x) => 1 - Math.pow(1 - x, 3);
const lerp = (a, b, t) => a + (b - a) * t;

function mix(a, b, t) {
  const na = parseInt(a.slice(1), 16);
  const nb = parseInt(b.slice(1), 16);
  const ch = (s) => Math.round(lerp((na >> s) & 255, (nb >> s) & 255, t)) << s;
  return `#${(ch(16) | ch(8) | ch(0)).toString(16).padStart(6, "0")}`;
}

function makeGlowSprite(color, glow, focus) {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  const r = size / 2;

  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, rgba(color, lerp(0.8, 1, focus)));
  grad.addColorStop(lerp(0.1, 0.44, focus), rgba(color, lerp(0.62, 1, focus)));
  grad.addColorStop(0.5, rgba(color, lerp(0.26, 0.42, focus)));
  grad.addColorStop(lerp(0.78, 0.58, focus), rgba(color, lerp(0.08, 0.14, focus) * glow));
  grad.addColorStop(1, rgba(color, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

function focusLadder(color, glow) {
  return Array.from({ length: DNA_FOCUS_STEPS }, (_, i) =>
    makeGlowSprite(color, glow, i / (DNA_FOCUS_STEPS - 1)),
  );
}

function makeHazeSprite(color) {
  const w = 220;
  const h = 92;
  const pad = 64;
  const c = document.createElement("canvas");
  c.width = w + pad * 2;
  c.height = h + pad * 2;
  const g = c.getContext("2d");

  g.filter = "blur(28px)";
  if (g.filter === "none") return null;

  const r = h / 2;
  g.fillStyle = color;
  g.beginPath();
  g.arc(pad + r, pad + r, r, Math.PI / 2, Math.PI * 1.5);
  g.lineTo(pad + w - r, pad);
  g.arc(pad + w - r, pad + r, r, Math.PI * 1.5, Math.PI / 2);
  g.closePath();
  g.fill();
  return c;
}

function makePillSprite(hue, shellHi, shellLo, rim) {
  const L = 340;
  const W = 120;
  const pad = 32;
  const c = document.createElement("canvas");
  c.width = L + pad * 2;
  c.height = W + pad * 2;
  const g = c.getContext("2d");

  const r = W / 2;
  const x0 = pad;
  const y0 = pad;
  const seam = x0 + L * 0.46;

  const outline = () => {
    g.beginPath();
    g.arc(x0 + r, y0 + r, r, Math.PI / 2, Math.PI * 1.5);
    g.lineTo(x0 + L - r, y0);
    g.arc(x0 + L - r, y0 + r, r, Math.PI * 1.5, Math.PI / 2);
    g.closePath();
  };

  outline();
  g.save();
  g.clip();

  const shell = g.createLinearGradient(0, y0, 0, y0 + W);
  shell.addColorStop(0, mix(shellLo, shellHi, 0.4));
  shell.addColorStop(0.32, shellHi);
  shell.addColorStop(0.68, mix(shellHi, shellLo, 0.45));
  shell.addColorStop(1, shellLo);
  g.fillStyle = shell;
  g.fillRect(x0, y0, L, W);

  const grain = mulberry32(0xb10b);
  for (let i = 0; i < 70; i++) {
    const gx = seam + grain() * (x0 + L - seam);
    const gy = y0 + grain() * W;
    g.fillStyle = grain() < 0.58 ? rgba(shellHi, 0.8) : rgba(hue, 0.32);
    g.beginPath();
    g.arc(gx, gy, 3.5 + grain() * 3.5, 0, TAU);
    g.fill();
  }

  const cap = g.createLinearGradient(0, y0, 0, y0 + W);
  cap.addColorStop(0, mix(hue, "#000000", 0.42));
  cap.addColorStop(0.3, mix(hue, "#ffffff", 0.28));
  cap.addColorStop(0.54, hue);
  cap.addColorStop(1, mix(hue, "#000000", 0.52));
  g.fillStyle = cap;
  g.fillRect(x0, y0, seam - x0, W);

  const lip = g.createLinearGradient(seam - 4, 0, seam + 7, 0);
  lip.addColorStop(0, "rgba(0,0,0,0.22)");
  lip.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = lip;
  g.fillRect(seam - 4, y0, 11, W);

  const spec = g.createLinearGradient(0, y0 + W * 0.12, 0, y0 + W * 0.42);
  spec.addColorStop(0, "rgba(255,255,255,0)");
  spec.addColorStop(0.5, "rgba(255,255,255,0.7)");
  spec.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = spec;
  g.beginPath();
  g.ellipse(x0 + L * 0.5, y0 + W * 0.26, L * 0.43, W * 0.11, 0, 0, TAU);
  g.fill();

  g.restore();

  g.strokeStyle = rim;
  g.lineWidth = 2.5;
  outline();
  g.stroke();

  const out = document.createElement("canvas");
  out.width = c.width;
  out.height = c.height;
  const og = out.getContext("2d");
  og.filter = "blur(3px)";
  og.drawImage(c, 0, 0);
  return og.filter === "none" ? c : out;
}

function DnaField({ theme = "dark" }) {
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();
  const themeRef = useRef(theme);
  const redrawRef = useRef(null);

  useEffect(() => {
    themeRef.current = theme;
    redrawRef.current?.();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let startTime = 0;

    const rand = mulberry32(0x5eed1e);

    const sprites = {};
    for (const [name, skin] of Object.entries(DNA_THEME)) {
      sprites[name] = {
        core: focusLadder(skin.core, skin.glow),
        accent: focusLadder(skin.accent, skin.glow),
        pills: DNA_PILL_HUES.map((hue) =>
          makePillSprite(hue, skin.shellHi, skin.shellLo, skin.rim),
        ),
        haze: makeHazeSprite(skin.haze),
      };
    }

    const speck = () => ({
      dT: (rand() - 0.5) * 0.012,
      dAngle: (rand() - 0.5) * 0.26,
      dRadius: (rand() - 0.5) * 2 * DNA_TUBE,
      size: 0.3 + Math.pow(rand(), 1.6) * 1.5,
      sx: rand(),
      sy: rand(),
      delay: rand() * DNA_INTRO_STAGGER,
    });

    const nodes = [];

    for (const side of [1, -1]) {
      for (let i = 0; i < DNA_BACKBONE_DOTS; i++) {
        nodes.push({
          ...speck(),
          t: i / (DNA_BACKBONE_DOTS - 1),
          radius: side,
          dim: 1,
          accent: false,
        });
      }
    }

    for (let i = 0; i < DNA_RUNGS; i++) {
      const t = i / (DNA_RUNGS - 1);
      const accent = rand() < DNA_ACCENT_CHANCE;
      for (let j = 0; j < DNA_RUNG_DOTS; j++) {
        nodes.push({
          ...speck(),
          t,
          radius: (1 - (2 * j) / (DNA_RUNG_DOTS - 1)) * 0.88,
          dim: 0.85,
          accent,
        });
      }
    }

    const count = nodes.length;
    const px = new Float32Array(count);
    const py = new Float32Array(count);
    const pr = new Float32Array(count);
    const pd = new Float32Array(count);
    const pa = new Float32Array(count);
    const order = Array.from({ length: count }, (_, i) => i);

    const drifter = (spread) => ({
      hx: rand(),
      hy: rand(),
      ax: 0.05 + rand() * spread,
      ay: 0.05 + rand() * spread,
      sx: 0.04 + rand() * 0.05,
      sy: 0.04 + rand() * 0.05,
      px: rand() * TAU,
      py: rand() * TAU,
      rot: rand() * TAU,
      rs: (rand() - 0.5) * 0.012,
    });

    const pills = [];
    for (let i = 0; i < DNA_PILLS; i++) {
      pills.push({
        ...drifter(0.07),
        hue: rand() < 0.6 ? 0 : 1,
        scale: 0.6 + rand() * 0.55,
      });
    }

    const haze = [];
    for (let i = 0; i < DNA_HAZE; i++) {
      haze.push({ ...drifter(0.12), scale: 1.6 + rand() * 1.6 });
    }

    const render = (elapsed) => {
      const skin = DNA_THEME[themeRef.current] || DNA_THEME.dark;
      const set = sprites[themeRef.current] || sprites.dark;
      const spin = reduce ? DNA_STATIC_ANGLE : (elapsed / DNA_TURN_SECONDS) * TAU;
      const drift = reduce ? 0 : elapsed;

      const cx = width / 2;
      const cy = height / 2;
      const R = Math.max(width, height) * DNA_SPAN;
      const H = Math.hypot(width, height) * DNA_OVERSHOOT;
      const turns = H / (2 * R * DNA_PITCH_RATIO);
      const sinT = Math.sin(DNA_TILT);
      const cosT = Math.cos(DNA_TILT);

      ctx.clearRect(0, 0, width, height);

      const place = (d, sprite) => {
        ctx.save();
        ctx.translate(
          d.hx * width + Math.sin(drift * d.sx + d.px) * width * d.ax,
          d.hy * height + Math.cos(drift * d.sy + d.py) * height * d.ay,
        );
        ctx.rotate(d.rot + drift * d.rs);
        ctx.scale(d.scale, d.scale);
        ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
        ctx.restore();
      };

      if (set.haze) {
        ctx.globalCompositeOperation = skin.hazeBlend;
        ctx.globalAlpha = skin.hazeAlpha;
        for (const h of haze) place(h, set.haze);
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = skin.pillAlpha;
      for (const c of pills) place(c, set.pills[c.hue]);

      for (let i = 0; i < count; i++) {
        const p = nodes[i];
        const reach = (p.radius + p.dRadius) * R;
        const ang = p.t * turns * TAU + p.dAngle + spin;
        const u = (p.t + p.dT - 0.5) * H;
        const v = Math.cos(ang) * reach;
        let x = cx + u * sinT + v * cosT;
        let y = cy + u * cosT - v * sinT;

        const a = reduce ? 1 : ease(clamp01((elapsed - p.delay) / DNA_INTRO));
        if (a < 1) {
          const ox = p.sx * width;
          const oy = p.sy * height;
          x = ox + (x - ox) * a;
          y = oy + (y - oy) * a;
        }

        const d = clamp01((Math.sin(ang) * (p.radius + p.dRadius) + 1) / 2);
        px[i] = x;
        py[i] = y;
        pd[i] = d;
        pr[i] = DNA_DOT_R * p.size * (0.42 + 0.58 * d);
        pa[i] =
          x < -70 || x > width + 70 || y < -70 || y > height + 70
            ? 0
            : (skin.alphaBase + skin.alphaSpan * d) * p.dim * (0.25 + 0.75 * a);
      }

      order.sort((i, j) => pd[i] - pd[j]);

      ctx.globalCompositeOperation = "source-over";
      for (let k = 0; k < count; k++) {
        const i = order[k];
        if (pa[i] === 0) continue;
        const halo = pr[i] * 2;
        const rung = Math.min(DNA_FOCUS_STEPS - 1, (pd[i] * DNA_FOCUS_STEPS) | 0);
        ctx.globalAlpha = pa[i];
        ctx.drawImage(
          (nodes[i].accent ? set.accent : set.core)[rung],
          px[i] - halo,
          py[i] - halo,
          halo * 2,
          halo * 2,
        );
      }

      ctx.globalAlpha = 1;
    };

    const frame = (now) => {
      if (!startTime) startTime = now;
      render((now - startTime) / 1000);
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) render(0);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      redrawRef.current = () => render(0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      redrawRef.current = null;
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className="rd-dnafield" aria-hidden="true" />;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  /* Shared workstations plus an obscured field is exactly where Caps Lock costs
     people a login attempt. getModifierState reports it from any key event, so
     the hint can appear before the form is ever submitted. */
  const [capsOn, setCapsOn] = useState(false);

  const readCapsLock = useCallback((event) => {
    if (typeof event.getModifierState === "function") {
      setCapsOn(event.getModifierState("CapsLock"));
    }
  }, []);

  const router = useRouter();
  const mascot = useLoginMascot();
  const { theme, toggle: toggleTheme } = useTheme();

  /* If someone already has a session cached (e.g. they hit the browser's back
     button after logging in, or a bfcache restore serves up this page again),
     bounce straight to their dashboard instead of showing a stale login form.
     This is a UX convenience only — real access control is enforced server-side
     via the httpOnly JWT cookie + middleware.ts, not by this check. */
  useEffect(() => {
    try {
      const cached = localStorage.getItem("rd-user");
      if (cached) {
        const user = JSON.parse(cached);
        const target = ROLE_ROUTES[user.role] ?? "/dashboard";
        router.replace(target);
      }
    } catch {
      // ignore malformed/missing cache
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (name === "email") mascot.trackCaret(event);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setStatus(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setStatus({ tone: "error", text: result.message || "Invalid email or password." });
        mascot.shake();
        setSubmitting(false);
        return;
      }

      try {
        localStorage.setItem("rd-user", JSON.stringify(result.user));
      } catch {
        /* storage unavailable — proceed without caching the session */
      }

      setStatus({ tone: "success", text: `Welcome back, ${result.user.username}. Redirecting…` });
      mascot.celebrate();

      const target = ROLE_ROUTES[result.user.role] ?? "/dashboard";
      /* router.replace, not router.push: swaps this history entry instead of
         stacking on top of it, so /login never sits behind the dashboard in
         browser history. Without this, pressing the browser's back button on
         the dashboard would land the user right back on the login form. */
      setTimeout(() => router.replace(target), 900);
    } catch {
      setStatus({ tone: "error", text: "Unable to reach the server. Please try again." });
      mascot.shake();
      setSubmitting(false);
    }
  };

  return (
    <main className={`rd-page ${display.variable} ${body.variable}`}>
      <DnaField theme={theme} />

      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <div className="rd-shell">
        <section className="rd-brand">
          <div className="rd-brandmark">
            <BrandMark />
            <div className="rd-word">
              <span className="rd-word-main">Rapha</span>
              <span className="rd-word-sub">Diagnostics</span>
            </div>
          </div>

          <h1 className="rd-hero">
            Every result, <em>traceable</em> end to end.
          </h1>
          <p className="rd-hero-sub">
            From specimen intake to verified report — one record, one chain of custody, visible to
            everyone who needs it.
          </p>

          <EcgLine className="rd-ecg" />

          <ul className="rd-roles">
            {STAFF_ROLES.map((role) => (
              <li key={role} className="rd-role">
                {role}
              </li>
            ))}
          </ul>
        </section>

        <section className="rd-authcol">
          <div className="rd-card">
            <LoginMascot state={mascot.state} caret={mascot.caret} className="rd-mascot" />

            <p className="rd-eyebrow">Staff sign-in</p>
            <h2 className="rd-title">Sign in</h2>
            <p className="rd-lede">Use your work email or username and password to continue.</p>

            <form className="rd-form" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="rd-label">
                  Email or username
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@rapha.com or username"
                  className="rd-input"
                  {...mascot.emailBindings}
                />
              </div>

              <div>
                <label htmlFor="password" className="rd-label">
                  Password
                </label>
                <div className="rd-pw">
                  <input
                    id="password"
                    name="password"
                    type={mascot.showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="rd-input"
                    {...mascot.passwordBindings}
                    onKeyDown={readCapsLock}
                    onKeyUp={readCapsLock}
                  />

                  <button
                    type="button"
                    className="rd-eye"
                    onClick={mascot.toggleShowPassword}
                    onMouseDown={(event) => event.preventDefault()}
                    {...mascot.passwordBindings}
                    aria-label={mascot.showPassword ? "Hide password" : "Show password"}
                    aria-pressed={mascot.showPassword}
                  >
                    {/* The glyph reports the state of the field, not the action of
                        the button: struck through while the password is hidden, open
                        once it is showing. The action stays on the aria-label, which
                        is where a screen reader looks for it. */}
                    <EyeIcon off={!mascot.showPassword} />
                  </button>
                </div>

                {capsOn ? (
                  <p className="rd-caps" role="status">
                    <CapsIcon />
                    Caps Lock is on
                  </p>
                ) : null}
              </div>

              <div className="rd-row">
                <label className="rd-check">
                  <input type="checkbox" name="remember" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="rd-link">
                  Forgot password?
                </a>
              </div>

              {status ? (
                <p
                  role={status.tone === "error" ? "alert" : "status"}
                  className={`rd-status rd-status--${status.tone}`}
                >
                  {status.text}
                </p>
              ) : null}

              <button type="submit" className="rd-submit" disabled={submitting}>
                {submitting ? <span className="rd-spin" aria-hidden="true" /> : null}
                {submitting ? "Signing in…" : "Continue to dashboard"}
              </button>
            </form>

            <p className="rd-foot">Need access? Contact your system administrator.</p>
          </div>
        </section>
      </div>
    </main>
  );
}



/* Both states share one eye. The struck-through version used to be built from
   its own set of arcs, and the numbers were wrong: the outline did not close,
   the halves sat at different heights, and the slash ran the full diagonal of
   the viewBox so it shot well past the eye at both ends. Drawing the slash over
   the exact almond the open state uses means the two can no longer disagree —
   toggling swaps one line in and out, and nothing else moves.

   The iris is dropped when struck. Keeping it puts three strokes through the
   middle of a 20px glyph, which at this size fills in as a smudge.

   `off` means the eye is shut — i.e. the password is hidden. */
function EyeIcon({ off }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />
      {off ? <path d="M4.5 4.5l15 15" /> : <circle cx="12" cy="12" r="3" />}
    </svg>
  );
}
/* An upward chevron over a bar — the standard Caps Lock glyph. Paired with the
   words "Caps Lock is on" rather than standing alone, so the warning does not
   depend on recognising the icon or on seeing the amber. */
function CapsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4 5 11h4v4h6v-4h4L12 4Z" />
      <path d="M9 19h6" />
    </svg>
  );
}
