import {Satellite} from '../models/satellite';

interface Point {
  x: number,
  y: number
}

export interface SatelliteLocation {
  satellite: Satellite,
  distance: number
}

function roundUpToOne(n: number): number {
  return Math.round((n + Number.EPSILON) * 10) / 10
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function getIntersection(x1: number, y1: number, r1: number, x2: number,
                         y2: number, r2: number): Point[] {
  const R = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

  if (!(Math.abs(r1 - r2) <= R && R <= r1 + r2)) {
    return [];
  }

  const R2 = Math.pow(R, 2)
  const R4 = Math.pow(R, 4)
  const r12 = Math.pow(r1, 2)
  const r22 = Math.pow(r2, 2)

  const r12mr22 = (r12 - r22)
  const r12pr22 = (r12 + r22)

  const a = r12mr22 / (2 * R2) 
  const c = Math.sqrt(2 * r12pr22 / R2 - Math.pow(r12mr22, 2) / R4 - 1);

  const fx = (x1+x2) / 2 + a * (x2 - x1);
  const gx = c * (y2 - y1) / 2;
  const fy = (y1+y2) / 2 + a * (y2 - y1);
  const gy = c * (x1 - x2) / 2;

  return [
    {
      x: fx + gx,
      y: fy + gy
    },
    {
      x: fx - gx,
      y: fy - gy
    },
  ]
}

export function getLocation(distances: SatelliteLocation[]): Point {
  if(distances.length < 3)
    throw new Error("There is not enough information.")

  const intersectionPoints = getIntersection(
    distances[0].satellite.x,
    distances[0].satellite.y,
    distances[0].distance,
    distances[1].satellite.x,
    distances[1].satellite.y,
    distances[1].distance,
  )

  if(intersectionPoints.length == 0)
    throw new Error("There is no intersection")

  const distance1 = distance(
    intersectionPoints[0].x,
    intersectionPoints[0].y,
    distances[2].satellite.x,
    distances[2].satellite.y
  )

  const distance2 = distance(
    intersectionPoints[1].x,
    intersectionPoints[1].y,
    distances[2].satellite.x,
    distances[2].satellite.y
  )

  if(roundUpToOne(distance1) === roundUpToOne(distances[2].distance)) {
    return {
      x: roundUpToOne(intersectionPoints[0].x), 
      y: roundUpToOne(intersectionPoints[0].y)
    }
  }

  if(roundUpToOne(distance2) === roundUpToOne(distances[2].distance)) {
    return {
      x: roundUpToOne(intersectionPoints[1].x), 
      y: roundUpToOne(intersectionPoints[1].y)
    }
  }

  throw new Error("There is no intersection")
}
