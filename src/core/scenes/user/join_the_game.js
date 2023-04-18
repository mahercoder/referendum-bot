const { Scenes } = require('telegraf');
const { WizardScene } = Scenes;
const { helpers } = require('../../../utils');
const { Models } = require('../../../models');
const { User, Game } = Models;

const formQuestions = {
    get_fullname: 'user.join_the_game.get_fullname',
    get_phone: 'user.join_the_game.get_phone',
    my_number: 'user.join_the_game.my_number',
    checking: 'user.join_the_game.checking',
    yes: 'user.join_the_game.yes',
    no: 'user.join_the_game.no',
    accepted_info: 'user.join_the_game.accepted_info',
    rejected_info: 'user.join_the_game.rejected_info',
    phone_exists: 'user.join_the_game.phone_exists',
    invalid_phone: 'user.join_the_game.invalid_phone',
    none_name: 'user.join_the_game.none_name',
    none_phone: 'user.join_the_game.none_phone',
    gamenotfound: 'user.join_the_game.gamenotfound'
}

function makeButtons(ctx){
    return [
        [
            { text: ctx.i18n.t(formQuestions.no), callback_data: formQuestions.no }, 
            { text: ctx.i18n.t(formQuestions.yes), callback_data: formQuestions.yes }
        ]
    ]
}

async function isInGame(userId){
    // const user = await User.findOne({ where: { id: userId } });
    const [ game ] = await Game.findAll();
    const users = await game.getUsers();

    for(let i=0; i < users.length; i++){
        if(users[i].id === userId){
            return users[i];
        }
    }
    
    return null;
}

/**
 * Creating new participant or update exists.
 * @param {String} fullname 
 * @param {String} phone_number
 * @returns {Void}
 */
async function createGameOrUpdate(userId, fullname, phone_number){
    try{
        const user = await User.findOne({ where: { id: userId }});
        const games = await Game.findAll();
        let currentGame = null;
    
        if(games.length > 0){
            currentGame = games[0];
        } else {
            currentGame = await Game.create();
        }
    
        await currentGame.addUsers([user]);
        const order_number = (await currentGame.getUsers()).length;
        await User.update({ fullname, phone_number, order_number }, { where: { id: user.id }});

        return order_number;
    } catch( err ) {
        console.log(err)
    }
}

const scene = new WizardScene(
    'user-home-join_the_game',
    
    // Enter
    async (ctx) => {
        const games = await Game.findAll();
        if(games.length === 0){
            ctx.wizard.state.sEnterMessage = await ctx.replyWithHTML(ctx.i18n.t(formQuestions.gamenotfound));
            await ctx.scene.enter('user-home');
        } else {
            ctx.wizard.state.sEnterMessage = await ctx.replyWithHTML(ctx.i18n.t(formQuestions.get_fullname));
            ctx.wizard.next();
        }
    },

    // Get fullname
    async (ctx) => {
        if(ctx.message.text){
            ctx.wizard.state.fullname = ctx.message.text;
        } else {
            ctx.wizard.state.fullname = ctx.i18n.t(formQuestions.none_name);
        }
    
        const caption = ctx.i18n.t(formQuestions.get_phone);
        const keyboard = {
            one_time_keyboard: true,
            resize_keyboard: true,
            keyboard: [[{ text: ctx.i18n.t(formQuestions.my_number), request_contact: true }]]
        };

        ctx.wizard.state.sGetFullnameMessage = [];
        ctx.wizard.state.sGetFullnameMessage[0] = ctx.message;
        ctx.wizard.state.sGetFullnameMessage[1] = await ctx.replyWithHTML(caption, { reply_markup: keyboard });
        
        ctx.wizard.next();
    },

    // Get phone_number
    async (ctx) => {
        if(ctx.message.contact){
            ctx.wizard.state.phone = ctx.message.contact.phone_number;
        } else {
            ctx.wizard.state.phone = ctx.i18n.t(formQuestions.none_phone);
        }

        const caption = ctx.i18n.t(formQuestions.checking, { fullname: ctx.wizard.state.fullname, phone_number: ctx.wizard.state.phone });
        const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx));

        ctx.wizard.state.sGetPhoneMessage = [];
        ctx.wizard.state.sGetPhoneMessage[0] = ctx.message;
        ctx.wizard.state.sGetPhoneMessage[1] = await ctx.replyWithHTML(caption, { reply_markup: keyboard });
        
        ctx.wizard.next();
    },
    
    // Get order_number
    async (ctx) => {
        try{
            const action = ctx.callbackQuery.data;
            
            if(ctx.wizard.state.phone === ctx.i18n.t(formQuestions.none_phone)){
                const caption = ctx.i18n.t(formQuestions.invalid_phone);
                ctx.replyWithHTML(caption);
            } else {
                switch(action){
                    case formQuestions.yes: {
                        const isExistInGame = await isInGame(ctx.from.id);
                        if(isExistInGame){
                            const caption = ctx.i18n.t(formQuestions.phone_exists);
                            ctx.replyWithHTML(caption);
                        } else {
                            const order_number = await createGameOrUpdate(ctx.from.id, ctx.wizard.state.fullname, ctx.wizard.state.phone);
                            const caption = ctx.i18n.t(formQuestions.accepted_info, { orderNumber: order_number });
                            ctx.replyWithHTML(caption);
                        }
                        break;
                    }
    
                    case formQuestions.no: {
                        const caption = ctx.i18n.t(formQuestions.rejected_info);
                        await ctx.replyWithHTML(caption);
                        break;
                    }
                }
            }

            await ctx.deleteMessage(ctx.wizard.state.sEnterMessage.message_id).catch( err => {});
            await ctx.deleteMessage(ctx.wizard.state.sGetFullnameMessage[0].message_id).catch( err => {});
            await ctx.deleteMessage(ctx.wizard.state.sGetFullnameMessage[1].message_id).catch( err => {});
            await ctx.deleteMessage(ctx.wizard.state.sGetPhoneMessage[0].message_id).catch( err => {});
            await ctx.deleteMessage(ctx.wizard.state.sGetPhoneMessage[1].message_id).catch( err => {});
        
            await ctx.scene.enter('user-home');
        } catch(err){
            logger.error(err);
        }

    }
);

module.exports = scene;