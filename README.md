# MERLIN — A Falacy Labs Product

> Multi-node Edge Runtime for Language-model Inference Networks.  
> *A small falcon. Intelligence, without a centre.*

A minimal, editorial, and atmospheric pre-launch landing page for **MERLIN**, a decentralized AI inference network by **Falacy Labs**.

---

## Design Philosophy

- **Anticipation over explanation**: The landing page creates an aura of technical sophistication, quiet authority, and anticipation.
- **Editorial & Monochromatic**: Restrained monochromatic palette (`#0A0A0A`, `#EAEAEA`, `#888888`, `#383838`) paired with high-contrast editorial typography (`Instrument Serif`, `Inter`, `Space Mono`).
- **Aerodynamic Falcon Vector**: Technical fine-line schematic of *Falco columbarius* (the Merlin falcon) representing the distributed, agile edge computing model.
- **Ambient Distributed Network**: Subtle, interactive HTML5 canvas simulation representing peer-to-peer compute nodes and token transmission (optimized for desktop/tablet; disabled on mobile view for focus and efficiency).
- **Multi-Device Responsive Precision**: Custom layout treatments tailored across Mobile (< 768px), Tablet (769px–1024px), Desktop (1025px–1599px), and Ultra-Wide/TV/4K (1600px+).

---

## Project Structure

```
merlin_lander/
├── index.html        # Semantic HTML5 structure
├── style.css         # Pure CSS3 styling, responsive layouts & animations
├── script.js         # Vanilla JavaScript (Network simulation, cursor, parallax, reveals)
└── assets/
    ├── falcon.svg    # Vector technical schematic of the Merlin falcon
    └── favicon.svg   # Favicon
```

---

## Technical Specifications

- **Tech Stack**: Pure HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Frameworks**: None (Zero React, Next.js, Vue, Tailwind, or Bootstrap).
- **Dependencies**: None.
- **Performance**: 60fps canvas animation with automatic viewport observation (`IntersectionObserver`) to conserve CPU/battery when scrolled out of view. Automatically deactivated on mobile screens.
- **Accessibility**: Full `prefers-reduced-motion` support.

---

## Deployment

The repository is 100% static and can be deployed directly:

- **GitHub Pages**: Settings -> Pages -> Deploy from branch `main` / root.
- **Cloudflare Pages**: Connect Git repository, set build command to empty, output directory to `.`.
- **Vercel**: Import repository as a static project.
