const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { Models } = require('../../../models');
const { User } = Models;
const { helpers } = require('../../../utils');

const callback_data = {
    subscribed: 'user.subscription.subscribed'
}

async function makeButtons(ctx){
    let buttons = [];

    const districtIndex = ctx.session.thisUser.district_number;
    const partnerChannels = [
        ...helpers.getDistricts()[districtIndex].channel_ids,
        ...helpers.getChannels()
    ];
    
    for(let i=0; i < partnerChannels.length; i++){
        try{
            const channel = await ctx.telegram.getChat(partnerChannels[i])
            const url = channel.username ? `https://t.me/${channel.username}` : channel.invite_link

            buttons.push([
                { text: channel.title, url: url }
            ]);

        } catch(err){
            if(err.code == 403){
                BotSettigs.removePartnerChannel(i)
            }
        }
    }

    buttons.push([{ text: ctx.i18n.t(callback_data.subscribed), callback_data: callback_data.subscribed }])

    return buttons;
}

const scene = new BaseScene('user-subscription');

scene.enter( async ctx => {
    const districtIndex = ctx.session.thisUser.district_number;
    const partnerChannels = [
        ...helpers.getDistricts()[districtIndex].channel_ids,
        ...helpers.getChannels()
    ];
    if(partnerChannels.length > 0){
        const caption = ctx.i18n.t('user.subscription.caption')
        const keyboard = helpers.makeInlineKeyboard(await makeButtons(ctx));
        ctx.session.enteredMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
    } else {
        ctx.scene.enter('user-home');
    }
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data.split('--')[0]

    switch(action){
        case callback_data.subscribed: {
            await ctx.deleteMessage().catch( err => {});

            const districtIndex = ctx.session.thisUser.district_number;
            const partnerChannels = [
                ...helpers.getDistricts()[districtIndex].channel_ids,
                ...helpers.getChannels()
            ];

            const isSubscribed = await helpers.isSubscribed(ctx, partnerChannels);

            if(isSubscribed){
                ctx.scene.enter('user-home');
            } else {
                ctx.scene.reenter();
            }
            
            break;
        }
    }
})

module.exports = scene;