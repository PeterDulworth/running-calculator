export type Distance = {
  name: string;
  miles: number;
  kilometers: number;
  displayName: string;
}

export type PaceInfo = {
  distance: string;
  time: string;
  distanceInMeters?: number;
}

export type CalculationResult = {
  mainResult: string;
  paces?: PaceInfo[];
  totalDistance?: {
    kilometers: string;
    miles: string;
  };
}

export type CalculationMode = 'timeToPace' | 'paceToTime'; 