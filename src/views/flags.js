// Banderas como SVG inline (sin depender de fuente de emoji).

// Argentina: tres franjas (celeste, blanca, celeste) + sol.
export function flagAR() {
  return `<svg class="flag" viewBox="0 0 30 20" preserveAspectRatio="xMidYMid meet" aria-label="Argentina">
    <rect width="30" height="6.67" fill="#74ACDF"/>
    <rect y="6.67" width="30" height="6.66" fill="#fff"/>
    <rect y="13.33" width="30" height="6.67" fill="#74ACDF"/>
    <g fill="#F6B40E">
      <circle cx="15" cy="10" r="2"/>
      <g>
        <rect x="14.6" y="5.6" width="0.8" height="1.8"/>
        <rect x="14.6" y="12.6" width="0.8" height="1.8"/>
        <rect x="10.6" y="9.6" width="1.8" height="0.8"/>
        <rect x="17.6" y="9.6" width="1.8" height="0.8"/>
      </g>
    </g>
  </svg>`;
}

// USA: franjas rojas/blancas + cantón azul con estrellas.
export function flagUSA() {
  return `<svg class="flag" viewBox="0 0 30 20" preserveAspectRatio="xMidYMid meet" aria-label="USA">
    <rect width="30" height="20" fill="#fff"/>
    <g fill="#B22234">
      <rect width="30" height="1.54" y="0"/>
      <rect width="30" height="1.54" y="3.08"/>
      <rect width="30" height="1.54" y="6.15"/>
      <rect width="30" height="1.54" y="9.23"/>
      <rect width="30" height="1.54" y="12.31"/>
      <rect width="30" height="1.54" y="15.38"/>
      <rect width="30" height="1.54" y="18.46"/>
    </g>
    <rect width="12" height="10.77" fill="#3C3B6E"/>
    <g fill="#fff">
      <circle cx="2.5" cy="2" r="0.6"/><circle cx="6" cy="2" r="0.6"/><circle cx="9.5" cy="2" r="0.6"/>
      <circle cx="2.5" cy="5.4" r="0.6"/><circle cx="6" cy="5.4" r="0.6"/><circle cx="9.5" cy="5.4" r="0.6"/>
      <circle cx="2.5" cy="8.8" r="0.6"/><circle cx="6" cy="8.8" r="0.6"/><circle cx="9.5" cy="8.8" r="0.6"/>
    </g>
  </svg>`;
}
