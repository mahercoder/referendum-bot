const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)

const commands = (() => {
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

        const command = require(
            module_name
        )

        all.push({
          name: command.name,
          action: command.action
        })
    })

    return all
})();

module.exports = async bot => {

    commands.forEach(async cmd => {
        if(cmd.name && cmd.action){
            bot.command(cmd.name, cmd.action)
        }
    })
    
}