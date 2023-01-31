/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    transformIgnorePatterns: ['/node_modules/(?!(react-bootstrap-tagsinput))'], 
    //react-bootstrap-tagsinput 제외하고 node_modules 안에 있는 라이브러리들 트랜스폼 하지 말 것
}

module.exports = config;