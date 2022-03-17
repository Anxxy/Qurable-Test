import {Satellite} from '../satellite'

import {SatelliteRepositoryInterface} from './interfaces/satellite.repository'

export class SatelliteRepository implements SatelliteRepositoryInterface {
  satellites = [
    {
      name: "Kenobi",
      x: -500,
      y: -200
    },
    {
      name: "Skywalker",
      x: 100,
      y: -100
    },
    {
      name: "Sato",
      x: 500,
      y: 100
    },
  ]

  public async findAll(): Promise<Satellite[]> {
    return this.satellites
  }

  public async findByName(name: string): Promise<Satellite[]> {
    return this.satellites.filter(s => s.name == name)
  }
}
