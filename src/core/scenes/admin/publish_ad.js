const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { helpers } = require('../../../utils');
const { Models } = require('../../../models');
const { User } = Models;

const callback_data = {
    yes: 'admin.publish_ad.yes',
    no: 'admin.publish_ad.no',
    back: 'admin.publish_ad.back'
}

function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }],
    ]
}

function makeVerificationButtons(ctx){
    return [[
        { text: ctx.i18n.t(callback_data.yes), callback_data: callback_data.yes },
        { text: ctx.i18n.t(callback_data.no), callback_data: callback_data.no }
    ]]
}

const scene = new BaseScene('admin-home-publish_ad');

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.publish_ad.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx));
    ctx.session.enteredMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
});

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.yes: {
            ctx.deleteMessage(ctx.session.verificationMsg.message_id).catch(err=>{});
            
            User
            .findAll()
            .then( async users => {
                const userCount = users.length;
                let receiverCount = 0;
                let stopperCount = 0;

                for(let i=0; i < users.length; i++){
                    try{
                        if(users[i].id != ctx.from.id){
                            await ctx.telegram.copyMessage(
                                users[i].id,
                                ctx.from.id,
                                ctx.session.adMsgAgreement.message_id
                            )
                        }
                        receiverCount++;
                    }catch(err){}
                }

                stopperCount = userCount - receiverCount;
                const reportCaption = ctx.i18n.t('admin.publish_ad.report', { userCount, receiverCount, stopperCount });
                await ctx.replyWithHTML(reportCaption);
                await ctx.scene.enter('admin-home');
            })
            .catch(err => {})

            break;
        }
        case callback_data.no: {
            await ctx.deleteMessage(ctx.session.adMsgAgreement.message_id).catch(err=>{});
            await ctx.deleteMessage(ctx.session.verificationMsg.message_id).catch(err=>{});
            ctx.scene.reenter();
            break;
        }
        case callback_data.back: {
            await ctx.deleteMessage().catch( err => {});
            await ctx.scene.enter('admin-home');

            break;
        }
    }
});

scene.on('message', async ctx => {
    try{
        ctx.session.adsMsg = ctx.message;
        await ctx.deleteMessage(ctx.session.enteredMessage.message_id).catch(err=>{})
        const caption = ctx.i18n.t('admin.publish_ad.agreement');
        const keyboard = helpers.makeInlineKeyboard(makeVerificationButtons(ctx));
        ctx.session.adMsgAgreement = await ctx.telegram.copyMessage(ctx.chat.id, ctx.from.id, ctx.session.adsMsg.message_id);
        await ctx.deleteMessage(ctx.session.adsMsg.message_id).catch(err=>{});

        // Verification Form!
        ctx.session.verificationMsg = await ctx.replyWithHTML(caption, { reply_markup: keyboard });
    }catch(err){
        console.log(err)
        const caption = ctx.i18n.t('admin.publish_ad.rejected');
        await ctx.replyWithHTML(caption);
        await ctx.scene.reenter();
    }
});

module.exports = scene;