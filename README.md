# VELOA

Your story. Your voice. Your VELOA.

VELOA is a support platform for women at universities. A student describes an everyday moment of unfairness, such as being talked over in a meeting or seeing her idea praised only when a man repeats it. VELOA answers with a supportive reply and one sentence she can use next time. Then she decides what happens: keep it private, have an anonymised report sent to a trained volunteer, or take it to the administration. Nothing leaves the chat until she has read and approved the anonymised version.

Team Stimme of Change built this clickable prototype for the Science-Equality-Award (SEA) at THWS Würzburg, on the theme of male allyship.

**Live demo:** [veloa-fawn.vercel.app](https://veloa-fawn.vercel.app)

## What the prototype shows

| Screen | What happens |
| --- | --- |
| Landing | "A safe place for your voice." One button to start. |
| Login | University sign-in with simulated verification steps. |
| Chat | Type freely or tap a starter such as "I was interrupted again in a meeting". VELOA validates the experience, suggests a sentence to use next time, then offers three choices: keep it private, share with a volunteer, or tell the administration. |
| Check before it goes | Shows the anonymised report before anything is sent: names removed, place and group kept. On the administration route she also decides whether to add her name. |
| Results | Saved privately, sent to a volunteer, or shared with the administration. Reports to the administration arrive under an anonymous ID such as `VL-8X42-QR91` unless she chose to add her name. |
| Dashboard | Past check-ins and a confidence ring. |
| Volunteer space | Incoming anonymised signals, each with a suggested focus for the group. |
| Administration portal | Complaints inbox, plus monthly and yearly views with charts. |
| Settings | Privacy and data controls in plain language. |

The **Screens** button at the bottom left jumps to any of the 12 screens. The moon button at the bottom right switches to dark mode.

After the chat, a short popup asks testers to rate the experience (good, average or bad) and leave a suggestion. Five quick taps on the logo open a hidden viewer with all responses.

## What is simulated

- The chat has no language model behind it yet. It matches keywords against four written scenarios plus a general fallback, and each of the five starter chips has its own reply.
- Sign-in and verification are simulated. There is no backend: complaints, signals and chart data are sample data in the code.
- Feedback is saved through the host's shared storage API (`window.storage`) when one exists, otherwise in the browser's `localStorage`.

## Run it locally

There is no build step. `index.html` loads React 18, ReactDOM and Babel standalone from unpkg, and Babel compiles the `.jsx` files in the browser. Most browsers block those file loads when `index.html` is opened straight from disk, so serve the folder:

```bash
git clone https://github.com/aryanthakkar221-droid/Veloa.git
cd Veloa
python3 -m http.server 8000
```

Then open http://localhost:8000. The page needs an internet connection for unpkg and Google Fonts.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Page shell, global styles and script order |
| `veloa-app.jsx` | Router, screen browser, dark mode toggle and tweak defaults |
| `veloa-shared.jsx` | Shared components, navigation context and the animated orb |
| `veloa-landing.jsx` | Landing screen |
| `veloa-login.jsx` | Sign-in with simulated verification |
| `veloa-chat.jsx` | Chat screen and the scripted scenarios |
| `veloa-preview.jsx` | "Check before it goes" consent step |
| `veloa-results.jsx` | The three result screens |
| `veloa-dashboard.jsx` | Personal dashboard |
| `veloa-volunteer.jsx` | Volunteer space |
| `veloa-admin.jsx` | Administration portal |
| `veloa-charts.jsx` | SVG charts for the admin views |
| `veloa-settings.jsx` | Privacy and data controls |
| `veloa-feedback.jsx` | Feedback popup, storage and hidden viewer |
| `tweaks-panel.jsx` | Optional panel for theme, orb style, text size, corner softness, title font and transitions |
| `image-slot.js` | Drag-and-drop image placeholder component |

## Built with

React 18, Babel standalone, CSS, SVG and canvas. Fonts: Inter and Spectral from Google Fonts. Hosted on Vercel.
