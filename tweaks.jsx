/* global React, TweaksPanel, useTweaks, TweakSection, TweakColor, TweakRadio */
const { useEffect: useEffectT } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#0d1c30", "#c98c4a", "#f7f3ec"],
  "voice": "editorial",
  "atmosphere": "cinematic"
}/*EDITMODE-END*/;

const PALETTE_OPTIONS = [
  ["#0d1c30", "#c98c4a", "#f7f3ec"], // Copper Estate (default)
  ["#1c2a24", "#9aa886", "#efeadc"], // Verdigris Atelier
  ["#1a1a1a", "#b8b1a4", "#f1ede5"], // Graphite Mono
  ["#241616", "#d36b3f", "#f5e9d8"], // Terracotta Foundry
];

const VOICE_FONTS = {
  editorial: {
    serif: "'Cormorant Garamond', Georgia, serif",
    serifSc: "'Cormorant SC', Georgia, serif",
    sans: "'Jost', 'Helvetica Neue', sans-serif",
    tracking: "-0.012em",
  },
  quiet: {
    serif: "'Spectral', Georgia, serif",
    serifSc: "'Spectral', Georgia, serif",
    sans: "'Inter', 'Helvetica Neue', sans-serif",
    tracking: "-0.008em",
  },
  display: {
    serif: "'Playfair Display', Georgia, serif",
    serifSc: "'Cormorant SC', Georgia, serif",
    sans: "'Jost', 'Helvetica Neue', sans-serif",
    tracking: "-0.02em",
  },
};

// Load extra Google fonts on demand
function ensureFont(href, id) {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function TweaksController() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // ---- palette ----
  useEffectT(() => {
    const [navy, copper, cream] = t.palette || PALETTE_OPTIONS[0];
    const root = document.documentElement.style;
    root.setProperty("--navy-900", navy);
    root.setProperty("--navy-800", shift(navy, 14));
    root.setProperty("--navy-700", shift(navy, 28));
    root.setProperty("--copper-500", copper);
    root.setProperty("--copper-600", shift(copper, -18));
    root.setProperty("--copper-300", shift(copper, 30));
    root.setProperty("--cream-50", cream);
    root.setProperty("--cream-100", shift(cream, -6));
    root.setProperty("--cream-200", shift(cream, -14));
  }, [t.palette]);

  // ---- voice (typography) ----
  useEffectT(() => {
    if (t.voice === "quiet") {
      ensureFont(
        "https://fonts.googleapis.com/css2?family=Spectral:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap",
        "tk-font-quiet"
      );
    }
    if (t.voice === "display") {
      ensureFont(
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap",
        "tk-font-display"
      );
    }
    const f = VOICE_FONTS[t.voice] || VOICE_FONTS.editorial;
    const root = document.documentElement.style;
    root.setProperty("--serif", f.serif);
    root.setProperty("--serif-sc", f.serifSc);
    root.setProperty("--sans", f.sans);
    root.setProperty("--display-track", f.tracking);
  }, [t.voice]);

  // ---- atmosphere ----
  useEffectT(() => {
    document.body.dataset.atmosphere = t.atmosphere || "cinematic";
  }, [t.atmosphere]);

  return (
    <TweaksPanel title="Tweaks" defaultPos={{ right: 24, bottom: 24 }}>
      <TweakSection title="Palette" subtitle="Reshapes navy · accent · cream across the whole site">
        <TweakColor
          value={t.palette}
          options={PALETTE_OPTIONS}
          onChange={(v) => setTweak("palette", v)}
        />
      </TweakSection>

      <TweakSection title="Voice" subtitle="Typographic temperament of headlines and labels">
        <TweakRadio
          value={t.voice}
          options={[
            { value: "editorial", label: "Editorial" },
            { value: "quiet", label: "Quiet" },
            { value: "display", label: "Display" },
          ]}
          onChange={(v) => setTweak("voice", v)}
        />
      </TweakSection>

      <TweakSection title="Atmosphere" subtitle="Hero treatment and overall mood">
        <TweakRadio
          value={t.atmosphere}
          options={[
            { value: "cinematic", label: "Cinematic" },
            { value: "daylight", label: "Daylight" },
            { value: "archival", label: "Archival" },
          ]}
          onChange={(v) => setTweak("atmosphere", v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// hex shift helper — clamps each channel by `amount`
function shift(hex, amount) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  let r = (n >> 16) & 0xff, g = (n >> 8) & 0xff, b = n & 0xff;
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

// Mount the panel into a dedicated root
const tweaksHost = document.createElement("div");
tweaksHost.id = "tweaks-root";
document.body.appendChild(tweaksHost);
ReactDOM.createRoot(tweaksHost).render(<TweaksController />);
