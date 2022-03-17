import convict from 'convict'
import dotenv from 'dotenv'
import * as redis from 'redis'

import {App} from './app'
import {configSchema} from './config/config'
import {TopSecretController} from './controllers/topsecret.controller'
import {TopSecretSplitController} from './controllers/topsecretsplit.controller'
import {SatelliteRepository} from './models/repositories/satellite.repository'

import {getMessage} from './services/message'

dotenv.config()

const config = convict(configSchema).getProperties()

console.log(config)

const redisClient = redis.createClient({
  url : `redis://${config.redis.host}:${config.redis.port}`,
  password : config.redis.password
});

const satelliteRepository = new SatelliteRepository()

const app = new App(config, [
  new TopSecretController(satelliteRepository),
  new TopSecretSplitController(redisClient as redis.RedisClientType, satelliteRepository)
])

redisClient.connect().then(() => {
  app.listen()
})
