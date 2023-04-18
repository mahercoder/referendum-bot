const { Models } = require('../../models');
const { User } = Models;
const { logger, helpers } = require('../../utils');

module.exports = {
    name: `start`,
    action:
    async function(ctx){
        const [ d1, d2 ] = await User.findOrCreate({
            where: {
                id: ctx.from.id, 
                first_name: ctx.from.first_name,
                username: ctx.from.username
            }
        }).catch(err => {
            logger.error(err);
            console.log(err);
        });

        if(helpers.isSubscribed(ctx, [])){
            ctx.scene.enter('user-home');
        }

    }
}
