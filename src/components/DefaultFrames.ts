/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Beautiful SVG templates with transparent cutouts to render as default frames
export const DEFAULT_VERTICAL_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="1200" height="1500">
  <!-- Outer dark blue frame with inner cutout using fill-rule odd-even -->
  <path fill="#0a1128" fill-rule="evenodd" d="M 0 0 h 1200 v 1500 h -1200 z M 80 140 h 1040 v 1160 h -1040 z" />
  
  <!-- Outer borders -->
  <rect x="15" y="15" width="1170" height="1470" rx="10" fill="none" stroke="#dc2626" stroke-width="8" />
  <rect x="25" y="25" width="1150" height="1450" rx="6" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.6" />
  
  <!-- Inner border around the photo cutout -->
  <rect x="76" y="136" width="1048" height="1168" fill="none" stroke="#dc2626" stroke-width="6" />
  <rect x="70" y="130" width="1060" height="1180" rx="4" fill="none" stroke="#0a1128" stroke-width="4" />
  
  <!-- Decorative Header -->
  <!-- Moon -->
  <path d="M 120 75 A 25 25 0 1 0 160 55 A 20 20 0 1 1 120 75 Z" fill="#fef08a" />
  
  <!-- Stars -->
  <g fill="#ffffff" opacity="0.8">
    <path d="M 280 45 l 2.5 5 l 5 2.5 l -5 2.5 l -2.5 5 l -2.5 -5 l -5 -2.5 l 5 -2.5 z" />
    <path d="M 920 55 l 2 4.5 l 4.5 2 l -4.5 2 l -2 4.5 l -2 -4.5 l -4.5 -2 l 4.5 -2 z" />
    <path d="M 100 100 l 1.5 3.5 l 3.5 1.5 l -3.5 1.5 l -1.5 3.5 l -1.5 -3.5 l -3.5 -1.5 l 3.5 -1.5 z" opacity="0.5" />
    <path d="M 1080 90 l 1.5 3.5 l 3.5 1.5 l -3.5 1.5 l -1.5 3.5 l -1.5 -3.5 l -3.5 -1.5 l 3.5 -1.5 z" opacity="0.5" />
  </g>
  
  <!-- Title: KUZOLA MUKUCALA -->
  <text x="600" y="80" font-family="'Inter', sans-serif" font-weight="900" font-size="46" fill="#ffffff" text-anchor="middle" letter-spacing="5">
    KUZOLA MUKUCALA
  </text>
  <text x="600" y="112" font-family="'Inter', sans-serif" font-weight="700" font-size="18" fill="#dc2626" text-anchor="middle" letter-spacing="8">
    ACAMPAMENTO JUVENIL
  </text>

  <!-- Decorative Footer -->
  <!-- Camping Tent in corner -->
  <g transform="translate(130, 1345)" fill="none" stroke="#dc2626" stroke-width="4">
    <polygon points="0,60 50,0 100,60" fill="#0b1329" stroke="#dc2626" stroke-width="4" />
    <polygon points="20,60 50,25 80,60" fill="#dc2626" opacity="0.3" />
    <line x1="50" y1="25" x2="50" y2="60" stroke="#dc2626" />
  </g>

  <!-- Pine trees in other corner -->
  <g transform="translate(970, 1340)" fill="#166534" opacity="0.95">
    <polygon points="25,0 0,40 50,40" fill="#dc2626" opacity="0.2" />
    <polygon points="25,0 0,40 50,40" />
    <polygon points="25,15 5,55 45,55" />
    <rect x="21" y="55" width="8" height="12" fill="#78350f" />
  </g>
  <g transform="translate(1025, 1355)" fill="#15803d" opacity="0.8">
    <polygon points="15,0 0,25 30,25" />
    <polygon points="15,10 3,35 27,35" />
    <rect x="12" y="35" width="6" height="8" fill="#78350f" />
  </g>

  <!-- Campfire in the center -->
  <g transform="translate(600, 1355)">
    <!-- Logs -->
    <rect x="-35" y="25" width="70" height="10" rx="3" transform="rotate(-15)" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
    <rect x="-35" y="25" width="70" height="10" rx="3" transform="rotate(15)" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
    <!-- Fire flames -->
    <path d="M -15 20 C -20 5, -5 -20, -5 -20 C -5 -20, 8 -5, 4 10 C 4 10, 16 -8, 16 -8 C 16 -8, 24 10, 12 22 Z" fill="#f97316" />
    <path d="M -8 20 C -12 8, -2 -8, -2 -8 C -2 -8, 6 0, 4 10 C 4 10, 10 -2, 10 -2 C 10 -2, 14 10, 8 22 Z" fill="#ef4444" />
    <path d="M -4 20 C -6 12, 0 4, 0 4 C 0 4, 4 8, 2 16 Z" fill="#facc15" />
  </g>

  <!-- Slogan -->
  <text x="600" y="1445" font-family="'Inter', sans-serif" font-weight="800" font-size="26" fill="#ffffff" text-anchor="middle" letter-spacing="3">
    AMOR QUE CONSTRÓI
  </text>
  <text x="600" y="1472" font-family="'Inter', sans-serif" font-weight="600" font-size="14" fill="#ef4444" text-anchor="middle" letter-spacing="5">
    KUZOLA MUKUCALA
  </text>
</svg>
`.trim();

export const DEFAULT_HORIZONTAL_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <!-- Outer dark blue frame with inner cutout using fill-rule odd-even -->
  <path fill="#0a1128" fill-rule="evenodd" d="M 0 0 h 1080 v 1080 h -1080 z M 70 120 h 940 v 810 h -940 z" />
  
  <!-- Outer borders -->
  <rect x="15" y="15" width="1050" height="1050" rx="10" fill="none" stroke="#dc2626" stroke-width="6" />
  <rect x="23" y="23" width="1034" height="1034" rx="6" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.6" />
  
  <!-- Inner border around the photo cutout -->
  <rect x="66" y="116" width="948" height="818" fill="none" stroke="#dc2626" stroke-width="5" />
  <rect x="61" y="111" width="958" height="828" rx="4" fill="none" stroke="#0a1128" stroke-width="3" />
  
  <!-- Decorative Header -->
  <!-- Moon -->
  <path d="M 110 65 A 20 20 0 1 0 145 45 A 16 16 0 1 1 110 65 Z" fill="#fef08a" />
  
  <!-- Stars -->
  <g fill="#ffffff" opacity="0.8">
    <path d="M 260 40 l 2 4 l 4 2 l -4 2 l -2 4 l -2 -4 l -4 -2 l 4 -2 z" />
    <path d="M 820 40 l 2 4 l 4 2 l -4 2 l -2 4 l -2 -4 l -4 -2 l 4 -2 z" />
    <path d="M 80 80 l 1.5 3 l 3 1.5 l -3 1.5 l -1.5 3 l -1.5 -3 l -3 -1.5 l 3 -1.5 z" opacity="0.5" />
    <path d="M 1000 80 l 1.5 3 l 3 1.5 l -3 1.5 l -1.5 3 l -1.5 -3 l -3 -1.5 l 3 -1.5 z" opacity="0.5" />
  </g>
  
  <!-- Title: KUZOLA MUKUCALA -->
  <text x="540" y="70" font-family="'Inter', sans-serif" font-weight="900" font-size="40" fill="#ffffff" text-anchor="middle" letter-spacing="4">
    KUZOLA MUKUCALA
  </text>
  <text x="540" y="100" font-family="'Inter', sans-serif" font-weight="700" font-size="15" fill="#dc2626" text-anchor="middle" letter-spacing="6">
    ACAMPAMENTO JUVENIL
  </text>

  <!-- Decorative Footer -->
  <!-- Camping Tent in corner -->
  <g transform="translate(110, 950)" fill="none" stroke="#dc2626" stroke-width="4">
    <polygon points="0,50 40,0 80,50" fill="#0b1329" stroke="#dc2626" stroke-width="4" />
    <polygon points="15,50 40,20 65,50" fill="#dc2626" opacity="0.3" />
    <line x1="40" y1="20" x2="40" y2="50" stroke="#dc2626" />
  </g>

  <!-- Pine trees in other corner -->
  <g transform="translate(890, 945)" fill="#166534" opacity="0.95">
    <polygon points="20,0 0,35 40,35" />
    <polygon points="20,12 4,48 36,48" />
    <rect x="17" y="48" width="6" height="10" fill="#78350f" />
  </g>
  <g transform="translate(940, 955)" fill="#15803d" opacity="0.8">
    <polygon points="15,0 0,25 30,25" />
    <polygon points="15,10 3,35 27,35" />
    <rect x="12" y="35" width="6" height="8" fill="#78350f" />
  </g>

  <!-- Campfire in the center -->
  <g transform="translate(540, 960)">
    <!-- Logs -->
    <rect x="-30" y="22" width="60" height="8" rx="2.5" transform="rotate(-15)" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
    <rect x="-30" y="22" width="60" height="8" rx="2.5" transform="rotate(15)" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
    <!-- Fire flames -->
    <path d="M -12 18 C -16 4, -4 -16, -4 -16 C -4 -16, 6 -4, 3 8 C 3 8, 13 -6, 13 -6 C 13 -6, 20 8, 10 18 Z" fill="#f97316" />
    <path d="M -6 18 C -10 6, -2 -6, -2 -6 C -2 -6, 5 0, 3 8 C 3 8, 8 -2, 8 -2 C 8 -2, 11 8, 6 18 Z" fill="#ef4444" />
    <path d="M -3 18 C -5 10, 0 3, 0 3 C 0 3, 3 6, 1 13 Z" fill="#facc15" />
  </g>

  <!-- Slogan -->
  <text x="540" y="1035" font-family="'Inter', sans-serif" font-weight="800" font-size="22" fill="#ffffff" text-anchor="middle" letter-spacing="3">
    AMOR QUE CONSTRÓI
  </text>
  <text x="540" y="1055" font-family="'Inter', sans-serif" font-weight="600" font-size="12" fill="#ef4444" text-anchor="middle" letter-spacing="5">
    KUZOLA MUKUCALA
  </text>
</svg>
`.trim();

// Convert SVG text content directly to clean Data URL
export function svgToDataUrl(svgString: string): string {
  // Use encodeURIComponent to support non-ASCII chars cleanly
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}
