import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = {
  home: "/Users/echo/Downloads/ChatGPT Image 2026年5月30日 17_34_36 (1).png",
  projects: "/Users/echo/Downloads/ChatGPT Image 2026年5月30日 17_34_36 (2).png",
  article: "/Users/echo/Downloads/ChatGPT Image 2026年5月30日 17_34_37 (3).png",
};

const outDir = path.join(root, "design-assets", "alex-morgan-replica");
const assetsDir = path.join(outDir, "assets");
const width = 1491;
const height = 1055;

const tokens = {
  frame: { width, height, radius: 10 },
  color: {
    canvas: "#fbfaf7",
    surface: "#ffffff",
    surfaceWarm: "#f7f5f0",
    ink: "#171713",
    muted: "#64645c",
    faint: "#9a988f",
    line: "#e8e4db",
    olive: "#596044",
    oliveDark: "#485035",
    dot: "#d8d1c2",
  },
  typography: {
    display: "Cormorant Garamond, Canela, Georgia, serif",
    body: "Inter, Avenir Next, Helvetica Neue, Arial, sans-serif",
  },
  radius: { card: 10, image: 8, pill: 18 },
  shadow: {
    card: "0 12px 30px rgba(31, 29, 24, 0.08)",
    float: "0 20px 45px rgba(31, 29, 24, 0.12)",
  },
};

const crops = [
  ["home", "home-hero-portrait.png", 802, 99, 429, 320],
  ["home", "thumb-findash.png", 161, 497, 169, 126],
  ["home", "thumb-nura.png", 558, 497, 169, 126],
  ["home", "thumb-focus.png", 955, 497, 169, 126],
  ["home", "thumb-clarity.png", 161, 686, 168, 135],
  ["home", "thumb-wander.png", 558, 687, 168, 134],
  ["home", "thumb-desk.png", 955, 686, 169, 135],
  ["projects", "thumb-clarity-wide.png", 161, 477, 192, 161],
  ["projects", "thumb-pulse.png", 955, 478, 180, 156],
  ["projects", "case-nura-wide.png", 154, 670, 467, 160],
  ["article", "article-hero.png", 585, 83, 512, 268],
  ["article", "article-inline-dashboard.png", 683, 465, 313, 80],
  ["article", "author-avatar.png", 209, 280, 36, 36],
  ["article", "author-card-avatar.png", 211, 746, 80, 56],
];

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const img = (href, x, y, w, h, r = 8) => `
  <defs>
    <clipPath id="clip-${href.replace(/[^a-z0-9]/gi, "-")}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" />
    </clipPath>
  </defs>
  <image href="assets/${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${href.replace(/[^a-z0-9]/gi, "-")})" />`;

const text = (content, x, y, size, opts = {}) => {
  const {
    family = "body",
    weight = 400,
    color = tokens.color.ink,
    anchor = "start",
    letter = 0,
    opacity = 1,
  } = opts;
  return `<text x="${x}" y="${y}" font-family="${tokens.typography[family]}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}" letter-spacing="${letter}" opacity="${opacity}">${esc(content)}</text>`;
};

const lineText = (lines, x, y, size, leading, opts = {}) =>
  lines
    .map((line, index) => text(line, x, y + index * leading, size, opts))
    .join("\n");

const rect = (x, y, w, h, opts = {}) => {
  const {
    fill = tokens.color.surface,
    stroke = tokens.color.line,
    sw = 1,
    r = 0,
    shadow = false,
    opacity = 1,
  } = opts;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}"${shadow ? ' filter="url(#shadow-card)"' : ""}/>`;
};

const arrow = (x, y, color = tokens.color.ink) => `
  <path d="M${x} ${y}h9m-3-5 5 5-5 5" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`;

const pageShell = (body, active = "Home") => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="shadow-card" x="-20%" y="-30%" width="140%" height="180%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#1f1d18" flood-opacity="0.08"/>
    </filter>
    <filter id="shadow-float" x="-30%" y="-40%" width="160%" height="190%">
      <feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#1f1d18" flood-opacity="0.12"/>
    </filter>
    <pattern id="dot-grid" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="1.2" cy="1.2" r="1.1" fill="${tokens.color.dot}" opacity="0.75"/>
    </pattern>
  </defs>
  <rect x="1" y="1" width="1489" height="1053" rx="10" fill="${tokens.color.canvas}" stroke="${tokens.color.line}"/>
  ${header(active)}
  ${body}
  ${footer()}
</svg>
`;

const header = (active) => {
  const nav = ["Home", "Projects", "Blog", "About", "Contact"];
  const navX = [553, 628, 704, 773, 849];
  return `
    <g id="header">
      <line x1="0" y1="75" x2="1491" y2="75" stroke="${tokens.color.line}"/>
      ${text("A", 156, 50, 34, { family: "display", weight: 500 })}
      <path d="M171 26 L185 52 M185 26 L161 53" stroke="${tokens.color.ink}" stroke-width="1.5" fill="none"/>
      ${text("Alex Morgan", 214, 35, 17, { family: "display", weight: 500 })}
      ${text("Engineer - Designer - Creator", 214, 53, 10, { color: tokens.color.muted })}
      ${nav
        .map((label, index) => {
          const activePart =
            label === active
              ? `<line x1="${navX[index]}" y1="59" x2="${navX[index] + 34}" y2="59" stroke="${tokens.color.olive}" stroke-width="2"/>`
              : "";
          return `${text(label, navX[index], 44, 12, {
            color: label === active ? tokens.color.ink : tokens.color.muted,
            weight: label === active ? 600 : 400,
          })}${activePart}`;
        })
        .join("\n")}
      <circle cx="1170" cy="39" r="5.5" fill="none" stroke="${tokens.color.ink}" stroke-width="1.3"/>
      <g stroke="${tokens.color.ink}" stroke-width="1.3" stroke-linecap="round">
        <path d="M1170 25v5M1170 48v5M1156 39h5M1179 39h5M1160 29l3.5 3.5M1176.5 45.5l3.5 3.5M1180 29l-3.5 3.5M1163.5 45.5l-3.5 3.5"/>
      </g>
      <rect x="1202" y="23" width="136" height="34" rx="17" fill="${tokens.color.oliveDark}"/>
      ${text("Let's connect", 1223, 45, 11, { color: "#ffffff", weight: 700 })}
      ${arrow(1308, 40, "#ffffff")}
    </g>`;
};

const footer = () => `
  <g id="footer">
    <line x1="0" y1="979" x2="1491" y2="979" stroke="${tokens.color.line}"/>
    ${text("A", 157, 1026, 30, { family: "display", weight: 500 })}
    <path d="M169 1005 L184 1028 M184 1004 L161 1030" stroke="${tokens.color.ink}" stroke-width="1.4" fill="none"/>
    ${text("© 2024 Alex Morgan. All rights reserved.", 205, 1022, 10, { color: tokens.color.muted })}
    ${text("GitHub", 584, 1022, 11, { color: tokens.color.muted })}
    ${text("LinkedIn", 684, 1022, 11, { color: tokens.color.muted })}
    ${text("X (Twitter)", 790, 1022, 11, { color: tokens.color.muted })}
    ${text("Dribbble", 899, 1022, 11, { color: tokens.color.muted })}
    <rect x="1304" y="998" width="34" height="34" rx="8" fill="${tokens.color.surface}" stroke="${tokens.color.line}"/>
    <path d="M1321 1024v-15m-6 6 6-6 6 6" stroke="${tokens.color.muted}" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;

const skillStrip = (y = 838) => `
  <g id="about-skills">
    <line x1="0" y1="${y}" x2="1491" y2="${y}" stroke="${tokens.color.line}"/>
    ${text("ABOUT ME", 153, y + 29, 11, { weight: 700, color: tokens.color.olive, letter: 1.4 })}
    <circle cx="179" cy="${y + 75}" r="26" fill="${tokens.color.surfaceWarm}"/>
    <circle cx="179" cy="${y + 69}" r="5" fill="none" stroke="${tokens.color.ink}" stroke-width="1.2"/>
    <path d="M168 ${y + 87}c2-11 20-11 22 0" fill="none" stroke="${tokens.color.ink}" stroke-width="1.2"/>
    ${lineText(["I'm Alex, a product engineer and designer with a", "love for clean design, meaningful products, and", "continuous learning. When I'm not coding or", "designing, I'm reading, writing, or exploring the", "outdoors."], 240, y + 30, 12, 18, { color: tokens.color.muted })}
    ${text("More about me", 240, y + 126, 12, { weight: 600 })}
    ${arrow(340, y + 122)}
    <line x1="537" y1="${y + 20}" x2="537" y2="${y + 120}" stroke="${tokens.color.line}"/>
    ${text("SKILLS", 581, y + 29, 11, { weight: 700, color: tokens.color.olive, letter: 1.4 })}
    ${["React", "TypeScript", "Next.js", "Tailwind CSS", "Figma", "Node.js", "PostgreSQL", "AWS"]
      .map((label, i) => {
        const x = 608 + i * 101;
        return `<g>${text(iconFor(label), x, y + 73, 29, { family: "body", anchor: "middle", color: tokens.color.ink })}${text(label, x, y + 107, 11, { anchor: "middle" })}</g>`;
      })
      .join("\n")}
  </g>`;

const iconFor = (label) =>
  ({
    React: "⚛",
    TypeScript: "TS",
    "Next.js": "N",
    "Tailwind CSS": "≈",
    Figma: "F",
    "Node.js": "⬡",
    PostgreSQL: "♘",
    AWS: "aws",
  })[label] ?? label;

const projectCard = ({ x, y, image, title, tag, body }) => `
  <g>
    ${rect(x, y, 379, 140, { r: 10, shadow: true })}
    ${img(image, x + 8, y + 8, 168, 124, 7)}
    ${text(title, x + 195, y + 32, 16, { family: "display", weight: 600 })}
    ${tag ? `<rect x="${x + 284}" y="${y + 18}" width="${tag.length * 7 + 22}" height="18" rx="9" fill="${tokens.color.surfaceWarm}" stroke="${tokens.color.line}"/>${text(tag, x + 295, y + 31, 9, { color: tokens.color.muted })}` : ""}
    ${lineText(body, x + 195, y + 56, 11, 16, { color: tokens.color.muted })}
    ${text("View project", x + 195, y + 122, 11, { weight: 600 })}
    ${arrow(x + 270, y + 118)}
  </g>`;

const articleCard = ({ x, y, image, date, title, body }) => `
  <g>
    ${rect(x, y, 379, 150, { r: 10, shadow: true })}
    ${img(image, x + 8, y + 8, 168, 134, 7)}
    ${text(date, x + 195, y + 26, 8, { color: tokens.color.faint, letter: 0.8 })}
    ${lineText(title, x + 195, y + 46, 15, 17, { family: "display", weight: 600 })}
    ${lineText(body, x + 195, y + 83, 10.5, 15, { color: tokens.color.muted })}
    ${text("Read article", x + 195, y + 132, 11, { weight: 600 })}
    ${arrow(x + 270, y + 128)}
  </g>`;

const miniArticleCard = ({ x, y, image, date, title, body }) => `
  <g>
    ${rect(x, y, 250, 105, { r: 8, shadow: true })}
    ${img(image, x + 6, y + 6, 108, 93, 6)}
    ${text(date, x + 126, y + 20, 7, { color: tokens.color.faint, letter: 0.7 })}
    ${lineText(title, x + 126, y + 36, 13.5, 15, { family: "display", weight: 600 })}
    ${lineText(body, x + 126, y + 66, 8.5, 12, { color: tokens.color.muted })}
    ${text("Read article", x + 126, y + 94, 9.5, { weight: 600 })}
    ${arrow(x + 196, y + 90)}
  </g>`;

const homeSvg = pageShell(`
  <g id="hero">
    ${text("HELLO, I'M ALEX", 153, 135, 11, { weight: 800, color: tokens.color.olive, letter: 1.4 })}
    ${lineText(["I build digital experiences", "that are elegant, efficient,", "and human-centered."], 153, 189, 42, 47, { family: "display", weight: 500 })}
    ${lineText(["I'm a product engineer and designer focused on crafting thoughtful", "solutions that live at the intersection of code, design, and purpose."], 153, 320, 13, 18, { color: tokens.color.muted })}
    <rect x="153" y="368" width="138" height="38" rx="10" fill="${tokens.color.oliveDark}" filter="url(#shadow-card)"/>
    ${text("View my work", 177, 392, 11, { color: "#ffffff", weight: 700 })}
    ${arrow(262, 387, "#ffffff")}
    ${text("About me", 323, 392, 12, { weight: 600 })}
    <line x1="323" y1="396" x2="373" y2="396" stroke="${tokens.color.ink}"/>
    ${arrow(398, 387)}
    ${img("home-hero-portrait.png", 802, 99, 429, 320, 8)}
    <rect x="1245" y="106" width="105" height="204" fill="url(#dot-grid)" opacity="0.6"/>
    ${rect(1168, 324, 170, 85, { r: 8, shadow: true })}
    <circle cx="1192" cy="349" r="4" fill="#b6b391"/>
    ${text("Available for work", 1204, 353, 12, { color: tokens.color.muted, weight: 600 })}
    ${lineText(["Open to exciting projects", "and collaborations."], 1188, 374, 11, 15, { color: tokens.color.muted })}
  </g>
  <g id="selected-projects">
    <line x1="0" y1="442" x2="1491" y2="442" stroke="${tokens.color.line}"/>
    ${text("SELECTED PROJECTS", 153, 475, 11, { weight: 800, color: tokens.color.olive, letter: 1.4 })}
    ${text("View all projects", 1230, 475, 11, { weight: 600 })}
    <line x1="1287" y1="479" x2="1320" y2="479" stroke="${tokens.color.ink}"/>
    ${arrow(1324, 470)}
    ${projectCard({ x: 153, y: 489, image: "thumb-findash.png", title: "FinDash", tag: "SaaS", body: ["A modern analytics platform for", "financial teams. Real-time insights,", "beautifully presented."] })}
    ${projectCard({ x: 549, y: 489, image: "thumb-nura.png", title: "Nura Studio", tag: "Branding", body: ["Brand identity and digital presence", "for a modern furniture studio", "based in Stockholm."] })}
    ${projectCard({ x: 946, y: 489, image: "thumb-focus.png", title: "Focus Time", tag: "iOS App", body: ["A mindfulness app designed to", "help you focus, breathe, and", "reclaim your time."] })}
  </g>
  <g id="latest-articles">
    ${text("LATEST ARTICLES", 153, 664, 11, { weight: 800, color: tokens.color.olive, letter: 1.4 })}
    ${text("View all articles", 1230, 664, 11, { weight: 600 })}
    <line x1="1286" y1="668" x2="1320" y2="668" stroke="${tokens.color.ink}"/>
    ${arrow(1324, 659)}
    ${articleCard({ x: 153, y: 678, image: "thumb-clarity.png", date: "MAY 12, 2024", title: ["Designing for clarity in", "complex systems"], body: ["Thoughts on creating interfaces", "that reduce cognitive load and", "empower users."] })}
    ${articleCard({ x: 549, y: 678, image: "thumb-wander.png", date: "APR 28, 2024", title: ["What I learned building", "in public"], body: ["Reflections on sharing the process,", "not just the outcome."] })}
    ${articleCard({ x: 946, y: 678, image: "thumb-desk.png", date: "APR 10, 2024", title: ["My productivity", "tech stack in 2024"], body: ["The tools and habits that help me", "stay focused and create consistently."] })}
  </g>
  ${skillStrip(838)}
`, "Home");

const workCard = ({ x, y, image, title, type, body }) => `
  <g>
    ${rect(x, y, 379, 166, { r: 10, shadow: true })}
    ${img(image, x + 8, y + 8, 192, 150, 7)}
    ${text(title, x + 218, y + 35, 17, { family: "display", weight: 600 })}
    ${text(type, x + 218, y + 55, 10, { color: tokens.color.muted })}
    ${lineText(body, x + 218, y + 84, 10.5, 16, { color: tokens.color.muted })}
    ${text("View project", x + 218, y + 145, 11, { weight: 600 })}
    ${arrow(x + 303, y + 141)}
  </g>`;

const projectsSvg = pageShell(`
  <g id="portfolio-title">
    ${text("PORTFOLIO", 153, 132, 11, { weight: 800, color: tokens.color.olive, letter: 1.4 })}
    ${text("Selected Work", 153, 187, 46, { family: "display", weight: 500 })}
    ${lineText(["A collection of projects across product design, engineering,", "and brand. Each one crafted with intention and purpose."], 153, 222, 13, 19, { color: tokens.color.muted })}
    ${["All", "Web", "Branding", "Apps", "Experiments"].map((label, i) => {
      const widths = [48, 62, 82, 62, 91];
      const x = [955, 1014, 1084, 1174, 1244][i];
      const active = i === 0;
      return `<rect x="${x}" y="221" width="${widths[i]}" height="32" rx="16" fill="${active ? tokens.color.oliveDark : tokens.color.surface}" stroke="${active ? tokens.color.oliveDark : tokens.color.line}"/>${text(label, x + widths[i] / 2, 241, 10.5, { anchor: "middle", color: active ? "#fff" : tokens.color.muted, weight: active ? 700 : 400 })}`;
    }).join("\n")}
  </g>
  <g id="project-grid">
    ${workCard({ x: 153, y: 285, image: "thumb-findash.png", title: "FinDash", type: "Web App", body: ["A modern analytics platform for", "financial teams. Real-time insights,", "beautifully presented."] })}
    ${workCard({ x: 549, y: 285, image: "thumb-nura.png", title: "Nura Studio", type: "Branding", body: ["Brand identity and digital presence", "for a modern furniture studio", "based in Stockholm."] })}
    ${workCard({ x: 946, y: 285, image: "thumb-focus.png", title: "Focus Time", type: "iOS App", body: ["A mindfulness app designed to", "help you focus, breathe, and", "reclaim your time."] })}
    ${workCard({ x: 153, y: 477, image: "thumb-clarity-wide.png", title: "Clarity", type: "Web", body: ["A calm, content-first website for a", "coaching practice focused on", "clarity and intentional living."] })}
    ${workCard({ x: 549, y: 477, image: "thumb-wander.png", title: "Wander", type: "Web", body: ["A travel editorial website", "celebrating slow travel and", "meaningful experiences."] })}
    ${workCard({ x: 946, y: 477, image: "thumb-pulse.png", title: "Pulse", type: "Web App", body: ["A lightweight dashboard for", "managing health and performance", "metrics in one place."] })}
  </g>
  <g id="case-study">
    ${rect(153, 669, 1185, 161, { r: 10, shadow: true })}
    ${img("case-nura-wide.png", 154, 670, 467, 159, 8)}
    ${text("FEATURED CASE STUDY", 689, 692, 8, { color: tokens.color.faint, letter: 1 })}
    ${text("Nura Studio", 689, 724, 26, { family: "display", weight: 500 })}
    ${lineText(["An end-to-end brand and web experience for a contemporary", "furniture studio. Focused on timeless design and craftsmanship."], 689, 752, 11, 17, { color: tokens.color.muted })}
    <rect x="689" y="785" width="132" height="34" rx="10" fill="${tokens.color.oliveDark}"/>
    ${text("View case study", 708, 806, 10.5, { color: "#ffffff", weight: 700 })}
    ${arrow(793, 801, "#ffffff")}
    <line x1="1038" y1="697" x2="1038" y2="801" stroke="${tokens.color.line}"/>
    ${["Brand Strategy|Positioning, voice, and identity", "Web Design|A clean, editorial experience", "Development|Responsive, performant build"].map((item, i) => {
      const [title, sub] = item.split("|");
      const y = 707 + i * 38;
      return `<circle cx="1075" cy="${y}" r="6" fill="none" stroke="${tokens.color.olive}" stroke-width="1.2"/><path d="M1072 ${y}l2 2 4-5" fill="none" stroke="${tokens.color.olive}" stroke-width="1.2"/><g>${text(title, 1095, y + 3, 11, { weight: 700, color: tokens.color.muted })}${text(sub, 1095, y + 18, 9.5, { color: tokens.color.faint })}</g>`;
    }).join("\n")}
  </g>
  ${skillStrip(849)}
`, "Projects");

const articleSvg = pageShell(`
  <g id="article-header">
    ${text("DESIGN SYSTEMS  -  MAY 12, 2024", 209, 120, 9, { weight: 800, color: tokens.color.olive, letter: 1 })}
    ${lineText(["Designing for clarity in", "complex systems"], 209, 172, 34, 38, { family: "display", weight: 500 })}
    ${lineText(["Thoughts on creating interfaces that reduce cognitive load and", "empower users to focus on what matters."], 209, 238, 12, 18, { color: tokens.color.muted })}
    ${img("author-avatar.png", 209, 280, 36, 36, 18)}
    ${text("Alex Morgan", 260, 294, 10.5, { weight: 700 })}
    ${text("Engineer & Designer", 260, 309, 9.5, { color: tokens.color.muted })}
    ${img("article-hero.png", 585, 83, 512, 268, 8)}
    <g id="toc">
      ${text("ON THIS PAGE", 1140, 107, 9.5, { weight: 800, color: tokens.color.olive, letter: 1 })}
      <line x1="1141" y1="134" x2="1141" y2="232" stroke="${tokens.color.line}"/>
      <circle cx="1141" cy="134" r="3.5" fill="${tokens.color.olive}"/>
      ${["The problem with complexity", "Clarity is a design decision", "Building blocks of clarity", "A practical example", "Key takeaways"].map((label, i) => text(label, 1155, 138 + i * 24, 9.5, { color: i === 0 ? tokens.color.ink : tokens.color.muted, weight: i === 0 ? 700 : 400 })).join("\n")}
      ${rect(1128, 265, 187, 128, { r: 8, shadow: true })}
      <circle cx="1152" cy="295" r="13" fill="${tokens.color.olive}"/>
      <path d="M1148 298c7-2 9-8 7-10-5 1-8 4-7 10z" fill="none" stroke="#fff" stroke-width="1.2"/>
      ${text("Enjoyed this article?", 1177, 290, 11, { weight: 700, color: tokens.color.muted })}
      ${lineText(["Follow along for more", "thoughts on design,", "engineering, and building", "meaningful products."], 1177, 310, 9.5, 14, { color: tokens.color.muted })}
      ${text("Subscribe to updates", 1177, 371, 9.5, { color: tokens.color.muted })}
      ${arrow(1276, 366)}
    </g>
  </g>
  <g id="article-body">
    ${text("The problem with complexity", 209, 399, 18, { family: "display", weight: 500 })}
    ${lineText(["As our products grow, complexity creeps in--not just in code, but in the experience. More features,", "more data, more edge cases. Users are left to piece things together, often guessing what to do next."], 209, 426, 9.5, 16, { color: tokens.color.ink })}
    <line x1="209" y1="456" x2="209" y2="510" stroke="${tokens.color.olive}" stroke-width="2"/>
    ${lineText(["“  Clarity isn’t the absence of information.", "    It’s the presence of understanding."], 226, 480, 18, 24, { family: "display", weight: 500, color: tokens.color.muted })}
    ${lineText(["The goal isn’t to hide complexity from users. It’s to structure it in a way that feels intuitive,", "predictable, and empowering."], 209, 540, 9.5, 16, { color: tokens.color.ink })}
    ${text("Clarity is a design decision", 209, 590, 18, { family: "display", weight: 500 })}
    ${lineText(["Every element in an interface competes for attention. Good design removes that competition", "by making the next step obvious."], 209, 617, 9.5, 16, { color: tokens.color.ink })}
    ${["Use progressive disclosure to reveal, not overwhelm.", "Group by mental models, not by implementation.", "Make actions visible, and consequences clear."].map((label, i) => `<circle cx="215" cy="${651 + i * 23}" r="5" fill="${tokens.color.olive}"/><path d="M212 ${651 + i * 23}l2 2 4-5" fill="none" stroke="#fff" stroke-width="1"/><text x="230" y="${655 + i * 23}" font-family="${tokens.typography.body}" font-size="9.5" fill="${tokens.color.ink}">${esc(label)}</text>`).join("\n")}
    ${text("Clarity is built through consistent patterns and thoughtful defaults.", 209, 721, 9.5, { color: tokens.color.ink })}
    ${text("A practical example", 681, 399, 18, { family: "display", weight: 500 })}
    ${lineText(["In a recent project, we redesigned a data-heavy dashboard. By", "simplifying the information hierarchy and introducing contextual", "filters, we reduced task time by 38%."], 681, 426, 9.5, 16, { color: tokens.color.ink })}
    ${img("article-inline-dashboard.png", 683, 465, 313, 80, 5)}
    ${text("Small changes, grounded in clarity, lead to meaningful impact.", 681, 566, 9.5, { color: tokens.color.ink })}
    <rect x="681" y="581" width="314" height="99" rx="6" fill="#181816" filter="url(#shadow-card)"/>
    ${lineText(["function getPriorityScore(task: Task) {", "  const urgency = task.dueDate ? daysUntil(task.dueDate) : 999;", "  const importance = task.impact * 2;", "  return importance - urgency;", "}"], 704, 615, 8.5, 15, { family: "body", color: "#cfc9b8" })}
    <rect x="946" y="590" width="38" height="18" rx="4" fill="#2a2925"/>
    ${text("Copy", 964, 603, 8.5, { color: "#fff" })}
    ${text("Good interfaces are not just beautiful—they’re kind.", 681, 703, 9.5, { color: tokens.color.ink })}
  </g>
  <g id="author-card">
    ${rect(209, 742, 786, 72, { r: 8, shadow: true })}
    ${img("author-card-avatar.png", 213, 747, 78, 58, 6)}
    ${text("Written by Alex Morgan", 309, 766, 13, { family: "display", weight: 500 })}
    ${lineText(["I'm an engineer and designer focused on crafting thoughtful solutions that live at the intersection", "of code, design, and purpose."], 309, 787, 9.5, 14, { color: tokens.color.muted })}
    ${text("More about me", 894, 799, 9.5, { color: tokens.color.muted })}
    ${arrow(973, 794)}
  </g>
  <g id="more-articles">
    ${text("More articles", 209, 849, 17, { family: "display", weight: 500 })}
    ${text("View all articles", 916, 849, 9.5, { weight: 600 })}
    ${arrow(987, 844)}
    ${miniArticleCard({ x: 209, y: 859, image: "thumb-wander.png", date: "APR 28, 2024", title: ["What I learned", "building in public"], body: ["Reflections on sharing", "not just the outcome."] })}
    ${miniArticleCard({ x: 470, y: 859, image: "thumb-desk.png", date: "APR 10, 2024", title: ["My productivity", "tech stack"], body: ["The tools and habits", "that help me focus."] })}
    ${miniArticleCard({ x: 731, y: 859, image: "thumb-focus.png", date: "MAR 30, 2024", title: ["Designing dark mode", "that feels right"], body: ["Principles and practical tips for", "better dark mode experiences."] })}
  </g>
`, "Blog");

const manifest = `# Alex Morgan Figma Replica Asset Pack

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
`;

async function writeTextFile(name, contents) {
  await fs.writeFile(path.join(outDir, name), contents, "utf8");
}

async function main() {
  await fs.mkdir(assetsDir, { recursive: true });

  for (const [page, name, left, top, cropWidth, cropHeight] of crops) {
    await sharp(source[page])
      .extract({ left, top, width: cropWidth, height: cropHeight })
      .png()
      .toFile(path.join(assetsDir, name));
  }

  await writeTextFile("tokens.json", `${JSON.stringify(tokens, null, 2)}\n`);
  await writeTextFile("homepage.svg", homeSvg);
  await writeTextFile("projects.svg", projectsSvg);
  await writeTextFile("article.svg", articleSvg);
  await writeTextFile("README.md", manifest);
}

main();
