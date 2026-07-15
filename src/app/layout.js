import "./globals.css";

// Runs before first paint, so the stored theme is on <html> by the time anything
// renders. Doing this in React instead would paint dark, hydrate, then correct —
// a visible flash on every load for anyone using light.
const THEME_BOOTSTRAP = `
(function () {
  try {
    var t = localStorage.getItem("rd-theme");
    if (t !== "light" && t !== "dark") {
      t = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    document.documentElement.dataset.theme = t;
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
