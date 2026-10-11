@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #07111d;
  --bg-soft: #0b1627;
  --panel: rgba(15, 23, 42, 0.82);
  --panel-alt: rgba(15, 23, 42, 0.7);
  --border: rgba(148, 163, 184, 0.18);
  --text: #edf2ff;
  --muted: #94a3b8;
  --primary: #7c3aed;
  --primary-2: #22c55e;
  --accent: #38bdf8;
  --warning: #fbbf24;
  --shadow: 0 30px 50px rgba(2, 6, 23, 0.45);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background:
    radial-gradient(circle at top left, rgba(124, 58, 237, 0.18), transparent 30%),
    radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.15), transparent 30%),
    var(--bg);
  color: var(--text);
}
button, input, select, textarea { font: inherit; }
textarea { font-family: inherit; }
::selection { background: rgba(124, 58, 237, 0.45); }
