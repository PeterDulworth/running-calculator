import type { Distance } from './types';

export const DISTANCES: Distance[] = [
  { name: 'mile', miles: 1, kilometers: 1.60934, displayName: 'Mile' },
  { name: '2mile', miles: 2, kilometers: 3.21868, displayName: '2 Mile' },
  { name: '3mile', miles: 3, kilometers: 4.82802, displayName: '3 Mile' },
  { name: '5k', miles: 3.10686, kilometers: 5, displayName: '5K' },
  { name: 'halfMarathon', miles: 13.1094, kilometers: 21.0975, displayName: 'Half Marathon' },
  { name: 'marathon', miles: 26.2188, kilometers: 42.195, displayName: 'Marathon' },
]; 