const { Models } = require('../../models');
const { User } = Models;
const { logger, helpers } = require('../../utils');

module.exports = {
    name: `start`,
    action:
    async function(ctx){
        try{
            let user = await User.findOne({ where: { id: ctx.from.id }});
            
            if(user == null){
                user = await User.create({ id: ctx.from.id, first_name: ctx.from.first_name, username: ctx.from.username });
            }
    
            ctx.session.thisUser = user.dataValues;
    
            ctx.scene.enter('user-signup');
        }catch(err){
            console.log(err);
            logger.error(err);
        }
    }
}
