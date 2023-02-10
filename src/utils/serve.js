const fs = require('fs')
const path = require('path')
const envConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../env.json')))

const parseParams = () => {
    let { gateway_host } = envConfig
    return {
        backend_host: gateway_host
    }
}

module.exports = {
    parseParams
}
