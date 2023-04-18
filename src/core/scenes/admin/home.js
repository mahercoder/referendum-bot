const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { helpers } = require('../../../utils');

const callback_data = {
    game_control: 'admin.home.game_control',
    partner_channel: 'admin.home.partner_channel',
    publish_ad: 'admin.home.publish_ad',
    stats: 'admin.home.stats',
    exit: 'admin.home.exit',
}

function makeButtons(ctx){
    return [
        [
            { text: ctx.i18n.t(callback_data.game_control), callback_data: callback_data.game_control }, 
            { text: ctx.i18n.t(callback_data.partner_channel), callback_data: callback_data.partner_channel }
        ],
        [
            { text: ctx.i18n.t(callback_data.publish_ad), callback_data: callback_data.publish_ad }, 
            { text: ctx.i18n.t(callback_data.stats), callback_data: callback_data.stats }
        ],
        [{ text: ctx.i18n.t(callback_data.exit), callback_data: callback_data.exit }],
    ]
}

const scene = new BaseScene('admin-home');

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.home.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx));
    ctx.reply(caption, { reply_markup: keyboard })
});

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.game_control: {
            ctx.deleteMessage().catch( err => {});
            ctx.scene.enter('admin-home-game_control');
            break;
        }
        case callback_data.partner_channel: {
            // ctx.reply(ctx.i18n.t(callback_data.uzbek_movies));
            break;
        }
        case callback_data.publish_ad: {
            // ctx.reply(ctx.i18n.t(callback_data.translated_movies));
            break;
        }
        case callback_data.stats: {
            // ctx.reply(ctx.i18n.t(callback_data.serials));
            break;
        }
        case callback_data.exit: {
            ctx.deleteMessage().catch( err => {});
            ctx.scene.enter('user-home');
            break;
        }
    }
});

module.exports = scene;