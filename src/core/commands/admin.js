const { helpers } = require('../../utils');

module.exports = {
    name: `admin`,
    action:
    async function(ctx){
        if(helpers.isOwner(ctx.from.id) || helpers.isAdmin(ctx.from.id)){
            ctx.scene.enter('admin-home');
        }
    }
}