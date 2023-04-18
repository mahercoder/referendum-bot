module.exports = {
    name: `admin`,
    action:
    async function(ctx){
        ctx.scene.enter('admin-home');
    }
}