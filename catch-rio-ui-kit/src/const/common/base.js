// Levels of zIndex
export const zIndexLevels = {
  one: 100,
  two: 200,
  three: 300,
  four: 400,
  five: 500,
  six: 600,
  seven: 700,
  eight: 800,
  nine: 900,
  ten: 999,
};

export const zIndex = {
  modal: zIndexLevels.nine,
  toast: zIndexLevels.ten,
  nav: zIndexLevels.eight,
  autocomplete: zIndexLevels.one,
  monthPicker: zIndexLevels.one,
};

export const transitions = {
  subtleBounce: '.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  subtleBounceSlow: '.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
};

// bank vendor offical primary colors
export const vendorColors = {
  bankOfAmerica: '#EE2A24',
  capitalOne: '#004879',
  chase: '#047AC0',
  citibank: '#013B6F',
  wellsFargo: '#BA0B26',
  tdBank: '#3DAE2A',
  fidelity: '#115D34',
  prudential: '#07639D',
  merrillLynch: '#042564',
  charlesSchwab: '#429FDA',
  tdAmeritrade: '#3DAE2A',
  vanguard: '#8A2424',
  ally: '#380543',
  simple: '#4395F7',
};

export const bankColorNames = {
  'Bank of America': vendorColors.bankOfAmerica,
  'Capital One': vendorColors.capitalOne,
  'Chase Bank': vendorColors.chase,
  Citi: vendorColors.citibank,
  'Wells Fargo': vendorColors.wellsFargo,
  'TD Bank': vendorColors.tdBank,
  Fidelity: vendorColors.fidelity,
  Prudential: vendorColors.prudential,
  'Merrill Lynch': vendorColors.merrillLynch,
  'Charles Schwab': vendorColors.charlesSchwab,
  'TD Ameritrade': vendorColors.tdBank,
  Vanguard: vendorColors.vanguard,
  Simple: vendorColors.simple,
  Ally: vendorColors.ally,
  'Bank of Internet': vendorColors.bankOfInternet,
};

export const media = {
  PhoneOnly: 599,
  TabletPortraitUp: 600,
  TabletLandscapeUp: 900,
  desktopUp: 1024,
};

export default {
  zIndexLevels,
  zIndex,
  transitions,
  media,
  vendorColors,
  bankColorNames,
};
