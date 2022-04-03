/** @type { import('@jest/types').Config.InitialOptions } */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest-setup.ts'],
    clearMocks: true,
}
