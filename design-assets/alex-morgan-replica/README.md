# Alex Morgan Figma Replica Asset Pack

Source screenshots: 1491 x 1055 px.

## Files

- homepage.svg: vector reconstruction of Image #1.
- projects.svg: vector reconstruction of Image #2.
- article.svg: vector reconstruction of Image #3.
- tokens.json: extracted color, type, radius, and shadow decisions.
- assets/: cropped bitmap assets used by the SVG frames.

## Import Notes

1. In Figma, use File -> Place image/video or drag each SVG into the canvas.
2. Import the three SVG files at 1x scale. Each SVG has a 1491 x 1055 viewBox.
3. Fonts used by the SVG are fallbacks: Cormorant Garamond/Georgia for display and Inter/Avenir/Arial for UI text.
4. The generated files are Figma-ready approximations. Direct node creation was blocked because the Figma write tools were not exposed in this Codex thread.

## Extracted System

- Layout width: 1491 px, centered content around x=153 with 1185 px working width.
- Primary grid: 3 columns of 379 px with 17 px gaps on card-heavy sections.
- Background: warm off-white canvas, white cards, subtle warm borders.
- Interaction color: muted olive, used for CTA pills and active nav underline.
- Visual language: editorial serif headings, restrained sans body, rounded 8-10 px cards, soft low-opacity shadows.
