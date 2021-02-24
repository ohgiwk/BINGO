module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'test/tsconfig.test.json',
    },
  },
}
