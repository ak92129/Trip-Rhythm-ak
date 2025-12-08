export type Continent = 'Africa' | 'Asia' | 'Europe' | 'North America' | 'South America' | 'Oceania' | 'Antarctica';

// Comprehensive mapping of ISO country codes to continents
// Covers major travel destinations and common countries
export const countryToContinentMap: Record<string, Continent> = {
  // Africa
  DZ: 'Africa', // Algeria
  AO: 'Africa', // Angola
  BJ: 'Africa', // Benin
  BW: 'Africa', // Botswana
  BF: 'Africa', // Burkina Faso
  BI: 'Africa', // Burundi
  CM: 'Africa', // Cameroon
  CV: 'Africa', // Cape Verde
  CF: 'Africa', // Central African Republic
  TD: 'Africa', // Chad
  KM: 'Africa', // Comoros
  CG: 'Africa', // Congo
  CD: 'Africa', // Democratic Republic of the Congo
  CI: 'Africa', // Côte d'Ivoire
  DJ: 'Africa', // Djibouti
  EG: 'Africa', // Egypt
  GQ: 'Africa', // Equatorial Guinea
  ER: 'Africa', // Eritrea
  ET: 'Africa', // Ethiopia
  GA: 'Africa', // Gabon
  GM: 'Africa', // Gambia
  GH: 'Africa', // Ghana
  GN: 'Africa', // Guinea
  GW: 'Africa', // Guinea-Bissau
  KE: 'Africa', // Kenya
  LS: 'Africa', // Lesotho
  LR: 'Africa', // Liberia
  LY: 'Africa', // Libya
  MG: 'Africa', // Madagascar
  MW: 'Africa', // Malawi
  ML: 'Africa', // Mali
  MR: 'Africa', // Mauritania
  MU: 'Africa', // Mauritius
  MA: 'Africa', // Morocco
  MZ: 'Africa', // Mozambique
  NA: 'Africa', // Namibia
  NE: 'Africa', // Niger
  NG: 'Africa', // Nigeria
  RW: 'Africa', // Rwanda
  ST: 'Africa', // São Tomé and Príncipe
  SN: 'Africa', // Senegal
  SC: 'Africa', // Seychelles
  SL: 'Africa', // Sierra Leone
  SO: 'Africa', // Somalia
  ZA: 'Africa', // South Africa
  SS: 'Africa', // South Sudan
  SD: 'Africa', // Sudan
  SZ: 'Africa', // Eswatini
  TZ: 'Africa', // Tanzania
  TG: 'Africa', // Togo
  TN: 'Africa', // Tunisia
  UG: 'Africa', // Uganda
  EH: 'Africa', // Western Sahara
  ZM: 'Africa', // Zambia
  ZW: 'Africa', // Zimbabwe

  // Asia
  AF: 'Asia', // Afghanistan
  AM: 'Asia', // Armenia
  AZ: 'Asia', // Azerbaijan
  BH: 'Asia', // Bahrain
  BD: 'Asia', // Bangladesh
  BT: 'Asia', // Bhutan
  BN: 'Asia', // Brunei
  KH: 'Asia', // Cambodia
  CN: 'Asia', // China
  GE: 'Asia', // Georgia
  HK: 'Asia', // Hong Kong
  IN: 'Asia', // India
  ID: 'Asia', // Indonesia
  IR: 'Asia', // Iran
  IQ: 'Asia', // Iraq
  IL: 'Asia', // Israel
  JP: 'Asia', // Japan
  JO: 'Asia', // Jordan
  KZ: 'Asia', // Kazakhstan
  KP: 'Asia', // North Korea
  KR: 'Asia', // South Korea
  KW: 'Asia', // Kuwait
  KG: 'Asia', // Kyrgyzstan
  LA: 'Asia', // Laos
  LB: 'Asia', // Lebanon
  MO: 'Asia', // Macau
  MY: 'Asia', // Malaysia
  MV: 'Asia', // Maldives
  MN: 'Asia', // Mongolia
  MM: 'Asia', // Myanmar
  NP: 'Asia', // Nepal
  OM: 'Asia', // Oman
  PK: 'Asia', // Pakistan
  PS: 'Asia', // Palestine
  PH: 'Asia', // Philippines
  QA: 'Asia', // Qatar
  SA: 'Asia', // Saudi Arabia
  SG: 'Asia', // Singapore
  LK: 'Asia', // Sri Lanka
  SY: 'Asia', // Syria
  TW: 'Asia', // Taiwan
  TJ: 'Asia', // Tajikistan
  TH: 'Asia', // Thailand
  TL: 'Asia', // Timor-Leste
  TR: 'Asia', // Turkey
  TM: 'Asia', // Turkmenistan
  AE: 'Asia', // United Arab Emirates
  UZ: 'Asia', // Uzbekistan
  VN: 'Asia', // Vietnam
  YE: 'Asia', // Yemen

  // Europe
  AL: 'Europe', // Albania
  AD: 'Europe', // Andorra
  AT: 'Europe', // Austria
  BY: 'Europe', // Belarus
  BE: 'Europe', // Belgium
  BA: 'Europe', // Bosnia and Herzegovina
  BG: 'Europe', // Bulgaria
  HR: 'Europe', // Croatia
  CY: 'Europe', // Cyprus
  CZ: 'Europe', // Czech Republic
  DK: 'Europe', // Denmark
  EE: 'Europe', // Estonia
  FI: 'Europe', // Finland
  FR: 'Europe', // France
  DE: 'Europe', // Germany
  GR: 'Europe', // Greece
  HU: 'Europe', // Hungary
  IS: 'Europe', // Iceland
  IE: 'Europe', // Ireland
  IT: 'Europe', // Italy
  XK: 'Europe', // Kosovo
  LV: 'Europe', // Latvia
  LI: 'Europe', // Liechtenstein
  LT: 'Europe', // Lithuania
  LU: 'Europe', // Luxembourg
  MT: 'Europe', // Malta
  MD: 'Europe', // Moldova
  MC: 'Europe', // Monaco
  ME: 'Europe', // Montenegro
  NL: 'Europe', // Netherlands
  NO: 'Europe', // Norway
  PL: 'Europe', // Poland
  PT: 'Europe', // Portugal
  RO: 'Europe', // Romania
  RU: 'Europe', // Russia
  SM: 'Europe', // San Marino
  RS: 'Europe', // Serbia
  SK: 'Europe', // Slovakia
  SI: 'Europe', // Slovenia
  ES: 'Europe', // Spain
  SE: 'Europe', // Sweden
  CH: 'Europe', // Switzerland
  UA: 'Europe', // Ukraine
  GB: 'Europe', // United Kingdom
  VA: 'Europe', // Vatican City

  // North America
  AG: 'North America', // Antigua and Barbuda
  BS: 'North America', // Bahamas
  BB: 'North America', // Barbados
  BZ: 'North America', // Belize
  CA: 'North America', // Canada
  CR: 'North America', // Costa Rica
  CU: 'North America', // Cuba
  DM: 'North America', // Dominica
  DO: 'North America', // Dominican Republic
  SV: 'North America', // El Salvador
  GD: 'North America', // Grenada
  GT: 'North America', // Guatemala
  HT: 'North America', // Haiti
  HN: 'North America', // Honduras
  JM: 'North America', // Jamaica
  MX: 'North America', // Mexico
  NI: 'North America', // Nicaragua
  PA: 'North America', // Panama
  KN: 'North America', // Saint Kitts and Nevis
  LC: 'North America', // Saint Lucia
  VC: 'North America', // Saint Vincent and the Grenadines
  TT: 'North America', // Trinidad and Tobago
  US: 'North America', // United States

  // South America
  AR: 'South America', // Argentina
  BO: 'South America', // Bolivia
  BR: 'South America', // Brazil
  CL: 'South America', // Chile
  CO: 'South America', // Colombia
  EC: 'South America', // Ecuador
  GY: 'South America', // Guyana
  PY: 'South America', // Paraguay
  PE: 'South America', // Peru
  SR: 'South America', // Suriname
  UY: 'South America', // Uruguay
  VE: 'South America', // Venezuela

  // Oceania
  AU: 'Oceania', // Australia
  FJ: 'Oceania', // Fiji
  KI: 'Oceania', // Kiribati
  MH: 'Oceania', // Marshall Islands
  FM: 'Oceania', // Micronesia
  NR: 'Oceania', // Nauru
  NZ: 'Oceania', // New Zealand
  PW: 'Oceania', // Palau
  PG: 'Oceania', // Papua New Guinea
  WS: 'Oceania', // Samoa
  SB: 'Oceania', // Solomon Islands
  TO: 'Oceania', // Tonga
  TV: 'Oceania', // Tuvalu
  VU: 'Oceania', // Vanuatu

  // Antarctica
  AQ: 'Antarctica', // Antarctica
};

/**
 * Get the continent for a given country code.
 * Returns null if the country code is not found.
 */
export function getContinent(countryCode: string | null): Continent | null {
  if (!countryCode) return null;
  const normalized = countryCode.toUpperCase();
  return countryToContinentMap[normalized] || null;
}

/**
 * Check if two countries are on different continents.
 * Returns true if the countries are on different continents or if either is unknown.
 */
export function isCrossContinental(countryCode1: string | null, countryCode2: string | null): boolean {
  if (!countryCode1 || !countryCode2) return false;

  const continent1 = getContinent(countryCode1);
  const continent2 = getContinent(countryCode2);

  if (!continent1 || !continent2) return false;
  return continent1 !== continent2;
}
