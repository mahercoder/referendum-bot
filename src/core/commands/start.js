const { Models } = require('../../models');
const { User } = Models;
const { logger, helpers } = require('../../utils');

module.exports = {
    name: `start`,
    action:
    async function(ctx){
        User.findOrCreate({
            where: {
                id: ctx.from.id, 
                first_name: ctx.from.first_name,
                username: ctx.from.username
            }
        })
        .then( ([user, created]) => {
            ctx.session.thisUser = user.dataValues;
            
            ctx.scene.enter('user-signup');
            // if(created || !user.district_number){
            // } else {
            //     ctx.scene.enter('user-subscription');
            // }
        })
        .catch(err => {
            logger.error(err);
            console.log(err);
        });

        // if(helpers.isSubscribed(ctx, [])){
        //     ctx.scene.enter('user-home');
        // }

    }
}
