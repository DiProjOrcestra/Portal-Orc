// Small line-style icons used across the Painel Institucional page (MVV,
// Golden Circle and Planejamento Estratégico).
// Kept local to this page since they are not reused elsewhere yet.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  xmlns: 'http://www.w3.org/2000/svg',
};

export const CloverIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 12c0-2.5-2-4.5-4.5-4.5S3 9.5 3 12s2 4.5 4.5 4.5S12 14.5 12 12Z" />
    <path d="M12 12c0-2.5 2-4.5 4.5-4.5S21 9.5 21 12s-2 4.5-4.5 4.5S12 14.5 12 12Z" />
    <path d="M12 12c-2.5 0-4.5-2-4.5-4.5S9.5 3 12 3s4.5 2 4.5 4.5S14.5 12 12 12Z" />
    <path d="M12 21v-9" />
  </svg>
);

export const TargetIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const SunIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1M18.5 18.5l-2.1-2.1M7.6 7.6 5.5 5.5" />
  </svg>
);

export const ShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 3.2 19 5.8v5.4c0 4.4-2.9 7.9-7 8.8-4.1-.9-7-4.4-7-8.8V5.8Z" />
    <path d="M9 12.1l2.1 2.1L15.3 10" />
  </svg>
);

export const HeartIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 20.2s-7.6-4.6-9.9-9.2C.6 7.7 2.1 4.5 5.3 3.8c2-.4 3.9.5 5.1 2.1C11.7 4.3 13.6 3.4 15.6 3.8c3.2.7 4.7 3.9 3.2 7.2C16.6 15.6 12 20.2 12 20.2Z" />
  </svg>
);

export const EditIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0 0-3l-1-1a2.1 2.1 0 0 0-3 0L4 15v5Z" />
    <path d="M13.5 6.5l4 4" />
  </svg>
);

export const CompassIcon = TargetIcon;

export const DocumentIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M6.5 3.5h8L19 8v12a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
    <path d="M14 3.5V8h5" />
    <path d="M8.5 12.5h7M8.5 15.8h7M8.5 19h4.5" />
  </svg>
);

export const GearIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3.5v2.1M12 18.4v2.1M20.5 12h-2.1M5.6 12H3.5M17.7 6.3l-1.5 1.5M7.8 16.2l-1.5 1.5M17.7 17.7l-1.5-1.5M7.8 7.8 6.3 6.3" />
  </svg>
);

export const ChevronLeftIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M15 5.5 8.5 12l6.5 6.5" />
  </svg>
);

export const ChevronRightIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M9 5.5 15.5 12 9 18.5" />
  </svg>
);

// As três abaixo são aproximações no mesmo estilo de linha simples deste
// arquivo. No Figma o título usa "Bold Duotone / Notes / Clipboard Text" e a
// diretoria usa "Campaign" - ambos de um set de ícones duotone diferente do
// que já existe aqui; não temos o SVG original desses, só uma referência
// visual, então recriamos no estilo do site em vez de importar outro set.
export const ClipboardIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M7.5 4.5h9a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z" />
    <path d="M9.5 3.5h5a1 1 0 0 1 1 1V6h-7V4.5a1 1 0 0 1 1-1Z" />
    <path d="M8.8 10.5h6.4M8.8 13.8h6.4M8.8 17h4" />
  </svg>
);

export const FilterIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    <circle cx="9" cy="6.5" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="16" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="10.5" cy="17.5" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

export const CampaignIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3.5 10.2v3.6l3 .6v4.6a1.3 1.3 0 0 0 2.5 0v-4.1l7.5 1.5V8.2Z" />
    <path d="M16.5 9v6.4a3 3 0 0 0 0-6.4Z" />
  </svg>
);

export const PlusIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const WarningIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 4.5 21 19.5H3Z" />
    <path d="M12 10v4M12 16.5h.01" />
  </svg>
);

export const PersonIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5.5 19.5c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" />
  </svg>
);

export const ChecklistIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M6 4.5h12a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z" />
    <path d="m8.3 9 1.4 1.4L12.3 8" />
    <path d="M14 9h4M8.3 15l1.4 1.4L12.3 14" />
    <path d="M14 15h4" />
  </svg>
);

export const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ChevronDownIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M5.5 8.5 12 15l6.5-6.5" />
  </svg>
);
