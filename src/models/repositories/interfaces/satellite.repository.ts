import {Satellite} from '../../satellite'

export interface SatelliteRepositoryInterface {
  findAll(): Promise<Satellite[]>
  findByName(name: string): Promise<Satellite[]>
}
