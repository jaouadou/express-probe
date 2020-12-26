module.exports = {
  testEnvironment: 'node',
  testTimeout: 50000,
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
}

process.env = Object.assign(process.env, {
  NODE_ENV: 'test',
  MONOG_URL_TEST: 'mongodb://db:27017/test',
})
