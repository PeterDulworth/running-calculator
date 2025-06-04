import type { CalculationMode, Distance, CalculationResult, PaceInfo } from './types';
import { formatTime } from './utils';

export function calculateResults(
  mode: CalculationMode,
  selectedDistance: Distance,
  hours: string,
  minutes: string,
  seconds: string
): CalculationResult {
  const totalSeconds = 
    (parseInt(hours) || 0) * 3600 + 
    (parseInt(minutes) || 0) * 60 + 
    (parseInt(seconds) || 0);

  if (totalSeconds <= 0) {
    return { mainResult: 'Please enter a valid time' };
  }

  if (mode === 'timeToPace') {
    // Calculate various paces
    const metersPerSecond = (selectedDistance.kilometers * 1000) / totalSeconds;
    
    const paces: PaceInfo[] = [
      {
        distance: '400m',
        time: formatTime(400 / metersPerSecond),
        distanceInMeters: 400
      },
      {
        distance: '800m (½ mile)',
        time: formatTime(800 / metersPerSecond),
        distanceInMeters: 800
      },
      {
        distance: '1km',
        time: formatTime(1000 / metersPerSecond),
        distanceInMeters: 1000
      },
      {
        distance: '1 mile',
        time: formatTime((1609.34 / metersPerSecond)),
        distanceInMeters: 1609.34
      }
    ];

    paces.sort((a, b) => (a.distanceInMeters || 0) - (b.distanceInMeters || 0));

    const mileSeconds = totalSeconds / selectedDistance.miles;
    const mileMinutes = Math.floor(mileSeconds / 60);
    const remainingSeconds = Math.round(mileSeconds % 60);

    return {
      mainResult: `${mileMinutes}:${remainingSeconds.toString().padStart(2, '0')} per mile`,
      paces
    };
  } else {
    // Calculate total time from pace
    const paceSeconds = 
      (parseInt(hours) || 0) * 3600 + 
      (parseInt(minutes) || 0) * 60 + 
      (parseInt(seconds) || 0);

    // paceSeconds is per mile, multiply by total miles for total time
    const totalTimeSeconds = Math.round(paceSeconds * selectedDistance.miles);
    
    const totalHours = Math.floor(totalTimeSeconds / 3600);
    const remainingMinutes = Math.floor((totalTimeSeconds % 3600) / 60);
    const remainingSecondsValue = Math.round(totalTimeSeconds % 60);
    
    const timeStr = totalHours > 0 
      ? `${totalHours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSecondsValue.toString().padStart(2, '0')}`
      : `${remainingMinutes}:${remainingSecondsValue.toString().padStart(2, '0')}`;

    return {
      mainResult: timeStr,
      totalDistance: {
        kilometers: `${selectedDistance.kilometers.toFixed(2)} km`,
        miles: `${selectedDistance.miles.toFixed(2)} miles`
      }
    };
  }
} 