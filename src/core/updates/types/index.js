const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)

const updateTypes = (() => {
    let all = []
      
    fs.readdirSync(path.resolve(__dirname))
      .filter(file => {
        return  (file.indexOf('.') !== 0) && 
                (file !== basename) && 
                (file !== 'index.js') &&
                (file.slice(-3) === '.js')
    })
    .forEach(file => {
        const module_name = path.resolve(__dirname) + '/' + file.split('.js')[0]

        const update = require(
            module_name
        )

        all.push({
          name: update.name,
          action: update.action
        })
    })

    return all
})();

module.exports = updateTypes