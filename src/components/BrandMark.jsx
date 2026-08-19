"use client";

import { useId } from "react";

import "./brandMark.css";

/* The mark drawn as vectors so the rings can turn while the flask stays put —
   a flat scan can only ever spin as one piece. Each ring keeps its own tilt and
   turns at its own rate, the way the background helix does. `at` is where that
   ring's ball sits on its ellipse, in degrees. */
/* One lap length for all three, so they travel at the same rate. The phases are
   a sixth of a lap apart (60deg, 120deg): with the tilts 60deg apart as well,
   that spacing keeps the balls at least 97 units from one another at every
   point of the cycle, so they never run into each other. Unequal speeds are
   what made them drift together and collide. */
/* Orange takes the steep near-vertical ring and green the shallow one, as the
   mark has them.

   Unequal laps so no two move together, but in an exact ratio (1 : 1.33 : 2) so
   the pattern closes every 18s. That matters: a closed pattern can be checked
   in full, whereas arbitrary ratios drift forever and will eventually put two
   heads in the same place — which is what the earlier 4.2/5.9/7.3 did.

   These phases were solved for over the whole 12s period. The heads never come
   within 18.3 units of each other, which is why the trail tops out at 17 wide:
   below that gap, two trails cannot overlap.

   Speed is set by scaling laps and phases together by the same factor — that
   leaves the ratio, and so the separation, untouched. Scaling only the laps
   would break the phasing and put them back into collision. */
const ORBITS = [
  { key: "cyan", tilt: 22, lap: 3, phase: 0 },
  { key: "amber", tilt: 82, lap: 4, phase: 3.167 },
  { key: "lime", tilt: 142, lap: 6, phase: 2 },
];

/* Wide orbits around the whole mark, as the logo has them — the balls travel
   outside the flask, not within it. Centred on the flask body. */
const OCX = 100;
const OCY = 104;
const RX = 82;
const RY = 30;

export default function BrandMark({ size = 76, className = "rd-mark", title = "Rapha Diagnostics" }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <radialGradient id={`${uid}-b-cyan`} cx="34%" cy="30%">
          <stop offset="0" stopColor="#a5eeff" />
          <stop offset="1" stopColor="#1583c4" />
        </radialGradient>
        <radialGradient id={`${uid}-b-lime`} cx="34%" cy="30%">
          <stop offset="0" stopColor="#dcfa9a" />
          <stop offset="1" stopColor="#4e9c1d" />
        </radialGradient>
        <radialGradient id={`${uid}-b-amber`} cx="34%" cy="30%">
          <stop offset="0" stopColor="#ffd9a3" />
          <stop offset="1" stopColor="#dd6a08" />
        </radialGradient>

        {/* Half-planes either side of an orbit's major axis. */}
        <clipPath id={`${uid}-far`}>
          <rect x={OCX - 200} y={OCY - 200} width="400" height="200" />
        </clipPath>
        <clipPath id={`${uid}-near`}>
          <rect x={OCX - 200} y={OCY} width="400" height="200" />
        </clipPath>
      </defs>

      {/* Far half of each orbit: behind the glass. */}
      {ORBITS.map((o) => (
        <Orbiters key={o.key} uid={uid} orbit={o} half="far" />
      ))}

      {/* Flask, upright and unmoving — the trails sweep around it. */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Squat and broad, as the mark is: a short throat over a base three and
            a half times the neck's width. The earlier version was too tall and
            narrow, which pushed the seal down into the point of the cone. */}
        <path d="M74 24 H126" />
        <path d="M84 26 V64 L44 140 a6 6 0 0 0 5 10 H151 a6 6 0 0 0 5-10 L116 64 V26" />
      </g>

      {/* The seal: a hexagram with a lighter rim, crossed by a dark band that
          carries the name in Hebrew — רפא, rapha, "he heals". Two triangles
          rather than one star path so they overlap the way the mark's do. */}
      <g
        fill="#1b3a9c"
        stroke="#6c8dea"
        strokeWidth="2.2"
        strokeLinejoin="round"
      >
        <path d="M100 82 L119 115 H81 Z" />
        <path d="M100 126 L81 93 H119 Z" />
      </g>

      <rect x="82" y="99" width="36" height="11" rx="1" fill="#0a1024" />

      <text
        x="100"
        y="107.6"
        textAnchor="middle"
        fontSize="9"
        fontFamily="'Segoe UI', 'Arial Hebrew', 'Times New Roman', serif"
        fill="#f2f6ff"
      >
        רפא
      </text>

      {/* Near half: in front of the glass. */}
      {ORBITS.map((o) => (
        <Orbiters key={o.key} uid={uid} orbit={o} half="near" />
      ))}
    </svg>
  );
}

/* One ball plus its trail, riding the ring's own ellipse.

   Depth is faked three ways at once, all keyed to the same cycle: the ball
   swells and brightens through the near half and shrinks through the far half,
   and the whole group is drawn twice — once under the flask, once over it —
   with the two swapping visibility at the halfway point. That swap is what puts
   the ball genuinely behind the bottle for half of every lap. */
/* The tail is a stroked arc of the orbit itself, not a queue of circles. A row
   of circles can only ever look like a row of circles — this is one continuous
   stroke, so it reads as a solid streak however fast it moves.

   Taper comes from stacking a few arcs: the long thin one underneath, the short
   fat one on top, all ending at the same point. Widest last so the head is
   thickest. */
/* A comet tail built from many thin arcs rather than a few thick ones. Four
   chunky layers leave a visible shoulder wherever one ends; at this count the
   steps fall below a pixel and the taper reads as one smooth shape.

   t runs 0 at the tip to 1 at the head. Length falls off linearly so the tip
   reaches furthest back, while width and opacity ramp on curves — the powers
   are what stop the tail looking like a wedge and give it the pinched, drawn-out
   profile a comet actually has. */
const TAIL_STEPS = 26;
const TAIL = Array.from({ length: TAIL_STEPS }, (_, i) => {
  const t = i / (TAIL_STEPS - 1);
  return {
    len: 0.02 + 0.44 * (1 - t),
    w: 1.5 + 15.5 * t ** 1.6,
    o: 0.05 + 0.95 * t ** 2.2,
  };
});

function ellipsePath(cx, cy, rx, ry) {
  // sweep flag 1 = clockwise
  return `M ${cx - rx},${cy} a ${rx},${ry} 0 1,1 ${rx * 2},0 a ${rx},${ry} 0 1,1 ${-rx * 2},0`;
}

// Ramanujan's approximation — accurate enough to set dash lengths against.
function ellipsePerimeter(rx, ry) {
  const h = (rx - ry) ** 2 / (rx + ry) ** 2;
  return Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
}

function Orbiters({ uid, orbit, half }) {
  const path = ellipsePath(OCX, OCY, RX, RY);
  const per = ellipsePerimeter(RX, RY);
  const delay = `${(-orbit.phase).toFixed(3)}s`;

  /* The clip is resolved in this group's own space, i.e. after the tilt, so a
     single pair of half-planes split every orbit along its major axis however
     it is rotated. Far half draws before the flask, near half after — that is
     what makes a trail disappear behind the glass and come back out. */
  return (
    <g
      transform={`rotate(${orbit.tilt} ${OCX} ${OCY})`}
      clipPath={`url(#${uid}-${half})`}
    >
      {TAIL.map((t, i) => {
        const len = per * t.len;
        return (
          <path
            key={i}
            d={path}
            className="rd-trail"
            fill="none"
            stroke={`url(#${uid}-b-${orbit.key})`}
            strokeWidth={t.w}
            strokeLinecap="round"
            opacity={t.o}
            style={{
              strokeDasharray: `${len} ${per - len}`,
              /* Each arc ENDS at the head: offsetting by its own length puts
                 its leading edge in the same place regardless of how long it
                 is, so all four taper back from one point. */
              "--rd-dash-from": len,
              "--rd-dash-to": len - per,
              animationDuration: `${orbit.lap}s`,
              animationDelay: delay,
            }}
          />
        );
      })}

    </g>
  );
}