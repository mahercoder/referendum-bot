const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { helpers } = require('../../../utils');
const { Models } = require('../../../models');
const { User } = Models;

const callback_data = {
    partner_channel: 'admin.home.partner_channel',
    publish_ad: 'admin.home.publish_ad',
    stats: 'admin.home.stats',
    exit: 'admin.home.exit',
}

function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.partner_channel), callback_data: callback_data.partner_channel }],
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
    ctx.replyWithHTML(caption, { reply_markup: keyboard })
});

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.partner_channel: {
            ctx.deleteMessage().catch( err => {});
            ctx.scene.enter('admin-home-partner_channel');
            break;
        }
        case callback_data.publish_ad: {
            ctx.deleteMessage().catch( err => {});
            ctx.scene.enter('admin-home-publish_ad');
            break;
        }
        case callback_data.stats: {
            const userCount = await User.count();
            const caption = ctx.i18n.t('admin.home.user_count', { userCount });

            ctx.deleteMessage().catch( err => {});
            
            await ctx.replyWithHTML(caption);
            await ctx.scene.reenter();

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