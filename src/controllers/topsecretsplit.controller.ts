import express from "express";
import { body, param, validationResult } from 'express-validator';
import * as redis from "redis";

import { SatelliteRepository } from '../models/repositories/satellite.repository';

import { BaseController } from "./base.controller";

import { getLocation } from '../services/location';
import { getMessage } from '../services/message';

export class TopSecretSplitController implements BaseController {
  public router: express.Router;
  private redisClient: redis.RedisClientType;
  private satelliteRepository: SatelliteRepository;

  constructor(redisClient: redis.RedisClientType,
    satelliteRepository: SatelliteRepository) {
    this.router = express.Router();
    this.redisClient = redisClient;
    this.satelliteRepository = satelliteRepository;

    this.router.post("/topsecret_split/:satelliteName",
      param('satelliteName').isAlpha(),
      body('distance').isNumeric().toFloat(),
      body('message').isArray(), this.topsecretsplit);

    this.router.get("/topsecret_split", this.getTopSecretSplit);
  }

  topsecretsplit = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const satellites = await this.satelliteRepository.findByName(req.params.satelliteName);

    if (satellites.length < 1) {
      return res.status(400).json({
        errors: [{
          msg: "Invalid satellite name provided"
        }]
      });
    }

    this.redisClient.set(req.params.satelliteName, JSON.stringify(req.body));
    res.send({});
  };

  getTopSecretSplit = async (req: express.Request, res: express.Response) => {
    const satellites = await this.satelliteRepository.findAll();
    const satellitesData = [];
    const messages: string[][] = [];

    for (let satellite of satellites) {
      let data = await this.redisClient.get(satellite.name);
      if (data != null) {
        let parsedData = JSON.parse(data);
        satellitesData.push({ satellite: satellite, distance: parsedData.distance });
        messages.push(parsedData.message);
        // this.redisClient.del(satellite.name)
      } else {
        return res.status(400).json({
          errors: [{
            msg: "There is not enough information."
          }]
        });
      }
    }

    try {
      res.send({
        position: getLocation(satellitesData),
        message: getMessage(messages)
      });
    } catch (e: any) {
      res.status(400).json({ errors: [{ msg: e.message }] });
    }
  }
}
