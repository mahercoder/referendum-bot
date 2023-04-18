const { Models } = require('../../models');
const { User } = Models;
const { logger } = require('../../utils');

module.exports = {
    name: `start`,
    action:
    async function(ctx){
        await User.findOrCreate({
            where: {
                id: ctx.from.id, 
                first_name: ctx.from.first_name,
                username: ctx.from.username
            }
        }).catch(err => {
            logger.error(err);
            console.log(err);
        });

        ctx.scene.enter('user-home');
    }
}

// const game = await Game.create();

// const game = await Game.findOne({ where: { id: 1 } });
// await Game.destroy({ where: { id: 1 } });
// await game.addUsers([user]);
// await game.removeUser(user);
// console.log( await game.getUsers() );