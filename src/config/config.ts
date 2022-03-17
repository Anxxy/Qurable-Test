interface Server {
  host: string,
  port: number
}

interface Redis {
  host: string,
  port: number,
  password: string
}

export interface Config {
  server: Server,
  redis: Redis
}

export const configSchema = {
  server: {
    host: {
      format: String,
      default: 'localhost',
      env: 'HOST'
    },
    port: {
      format: Number,
      default: 3000,
      env: 'PORT'
    },
  },
  redis: {
    host: {
      format: String,
      default: '',
      env: 'REDIS_HOST'
    },
    port: {
      format: Number,
      default: 0,
      env: 'REDIS_PORT'
    },
    password: {
      format: String,
      default: '',
      env: 'REDIS_PASSWORD'
    },
  },
}
