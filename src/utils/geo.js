import { mean, rgb } from 'd3';
import { multiply as mix } from 'color-blend'

import styles from '../utils/styles';

export const euroCountries = [
  'Belgium',
  'Germany',
  'Ireland',
  'Spain',
  'France',
  'Italy',
  'Luxembourg',
  'Netherlands',
  'Austria',
  'Portugal',
  'Finland',
  'Greece',
  'Slovenia',
  'Cyprus',
  'Malta',
  'Slovakia',
  'Estonia',
  'Latvia',
  'Lithuania',
  'Euro Area'
];

export const useCapitalCountries = [
  'United States of America',
  'Israel',
  'Palestine',
  'Lebanon',
  'Canada',
  'Euro Area',
  'Germany',
];

export const clusterSetup = [
  /*{
    id: 0,
    name: 'Eastern Carribean',
    countries: [
      'Saint Kitts and Nevis',
      'Antigua and Barbuda',
      'Saint Lucia',
      'Grenada',
      'Montserrat',
      'Dominica',
      'Saint Vincent and the Grenadines',
    ],
    centroid: [-64, 15],
  },
  {
    id: 1,
    name: 'Eastern Mediterranean',
    countries: [
      'Israel',
      'Lebanon',
      'Palestine'
    ],
    centroid: [35, 33]
  },*/
  {
    id: 2,
    name: 'Europe',
    countries: [
      'France',
      'Italy',
      'Spain',
      'Belgium',
      'Switzerland',
      'Netherlands',
      'Germany',
      'Ireland',
      'Luxembourg',
      'Netherlands',
      'Austria',
      'Portugal', 
      'Finland', 
      'Greece', 
      'Slovenia', 
      'Cyprus', 
      'Malta', 
      'Slovakia', 
      'Estonia', 
      'Latvia', 
      'Lithuania',
      'Euro Area',
      'United Kingdom',
      'Denmark'
    ],
    centroid: [3.0, 46.0]
  }
];

export const geoMean = (coords) => {
  const x = mean(coords, (d) => d[0]);
  const y = mean(coords, (d) => d[1]);
  return [x || 0, y || 0];
};

export const getMinus = (coord1, coord2) => {
  return [coord1[0] - coord2[0], coord1[1] - coord2[1]];
};

export const getColorFromCountries = (countries, colorCat) => {
  if (!countries.length) return styles.darkgray;

  const uniqueColors = [...new Set(countries.map(d => d.categories[colorCat].color))];
  if (uniqueColors.length === 1) return uniqueColors[0];

  const rgbUniqueColors = uniqueColors.map(d => rgb(d)).map(d => ({r: d.r, g: d.g, b: d.b, a: d.opacity}));
  const mixed = mix(...rgbUniqueColors);
  const hex = rgb(mixed.r, mixed.g, mixed.b, mixed.a).formatHex();
  return hex;
};

export const countryGroups = [
  {
    id: 'G7',
    name: 'G7',
    items: [
      'Canada',
      'Euro Area',
      'France',
      'Germany',
      'Italy',
      'Japan',
      'United Kingdom',
      'United States of America'
    ]
  },
  {
    id: 'G20',
    name: 'G20',
    items: [
      'Argentina',
      'Australia',
      'Brazil',
      'Canada',
      'China',
      'France',
      'Germany',
      'India',
      'Indonesia',
      'Italy',
      'Japan',
      'South Korea',
      'Mexico',
      'Russia',
      'Saudi Arabia',
      'South Africa',
      'Turkey',
      'United Kingdom',
      'United States of America',
      'Euro Area'
    ]
  },
  {
    id: 'OECD',
    name: 'OECD',
    items: [
      'Austria',
      'Belgium',
      'Czech Republic',
      'Denmark',
      'Estonia',
      'Finland',
      'France',
      'Germany',
      'Greece',
      'Hungary',
      'Iceland',
      'Ireland',
      'Italy',
      'Latvia',
      'Lithuania',
      'Luxembourg',
      'Netherlands',
      'Norway',
      'Poland',
      'Portugal',
      'Slovakia',
      'Slovenia',
      'Spain',
      'Sweden',
      'Switzerland',
      'United Kingdom',
      'Euro Area',
      'Canada',
      'Chile',
      'Colombia',
      'Mexico',
      'United States of America',
      'Australia',
      'Japan',
      'South Korea',
      'New Zealand',
      'Israel',
      'Turkey'
    ]
  }
];