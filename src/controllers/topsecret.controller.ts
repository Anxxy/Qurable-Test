import express from 'express'
import {body, param, validationResult} from 'express-validator';

import {SatelliteRepository} from '../models/repositories/satellite.repository'

import {BaseController} from './base.controller'

import {getLocation} from '../services/location'
import {getMessage} from '../services/message'

export class TopSecretController implements BaseController {
  public router: express.Router;
  private satelliteRepository: SatelliteRepository;

  constructor(satelliteRepository: SatelliteRepository) {
    this.router = express.Router();
    this.satelliteRepository = satelliteRepository;

    this.router.post('/topsecret', body('satellites').isArray(), this.topsecret)
  }

  topsecret = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors : errors.array()});
    }

    let satellites = await this.satelliteRepository.findAll();
    if (satellites.length > req.body.satellites.length) {
      return res.status(400).json(
          {errors : [ {msg : "There is not enough information."} ]});
    }

    let satellitesMap = new Map();
    let messages: string[][] = []

    for(let satellite of req.body.satellites) {
      satellitesMap.set(satellite.name, satellite);
    }

    let satelliteLocations = satellites.map((satellite) => {
      messages.push(satellitesMap.get(satellite.name).message)
      return {
        satellite: satellite,
        distance: satellitesMap.get(satellite.name).distance
      }
    })

    try {
      res.send({
        position: getLocation(satelliteLocations),
        message: getMessage(messages)
      });
    } catch (e: any) {
      res.status(400).json({errors : [ {msg : e.message} ]})
    }
  }
}
