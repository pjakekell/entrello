import * as loglevel from 'loglevel'

loglevel.setLevel(process.env.NODE_ENV === 'production' ? 'warn' : 'debug')

export default loglevel