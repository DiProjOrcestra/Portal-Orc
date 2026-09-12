// Mirrors com.orcestra.portal_orc.enums.DirectorateEnum.
// Labels follow the exact wording provided in the design (dropdown mockup).
export const DIRECTORATE_OPTIONS = [
  { value: 'DICOM', label: 'Diretoria de Comunicação de Marketing' },
  { value: 'DIBIS', label: 'Diretoria de Negócios' },
  { value: 'TOPS', label: 'Diretoria de Operações' },
  { value: 'DIPROJ', label: 'Diretoria de Projetos' },
  { value: 'DIREX', label: 'Diretoria Executiva' },
];

// `position` (cargo) is a free-text field on the backend (RegisterRequestDto.position);
// these options follow the exact wording provided in the design (dropdown mockup).
export const POSITION_OPTIONS = [
  'Assessoria',
  'Gerência',
  'Coordenadoria',
  'Vice-diretoria',
  'Diretoria',
  'Presidência',
];
