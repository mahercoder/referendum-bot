const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { helpers } = require('../../../../utils');

const callback_data = {
    selected_district: 'admin.partner_channel.district_channels.item',
    back: 'admin.partner_channel.district_channels.back',
}

function makeButtons(ctx){
    let buttons = [];

    const districts = helpers.getDistricts();
    
    for(let i=0; i < districts.length; i++){
        try{
            const districtName = districts[i].name

            buttons.push(
                { text: districtName, callback_data: `${callback_data.selected_district}--${i}` }
            );

        } catch(err){
            if(err.code == 403){
                BotSettigs.removePartnerChannel(i)
            }
        }
    }
    buttons = helpers.matrixify(buttons, 2);
    buttons.push([{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }])

    return buttons;
}

const scene = new BaseScene('admin-home-partner_channel-district_channels');

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.partner_channel.district_channels.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx));
    ctx.session.enteredMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data.split('--')[0]

    switch(action){
        case callback_data.selected_district: {
            await ctx.deleteMessage().catch( err => {});
            const districtIndex = +ctx.callbackQuery.data.split('--')[1]
            ctx.session.selected_district = helpers.getDistricts()[districtIndex]
            ctx.scene.enter('admin-home-partner_channel-selected_district');
            break;
        }
        case callback_data.back: {
            await ctx.deleteMessage().catch( err => {});
            ctx.scene.enter('admin-home-partner_channel');
            break;
        }
    }
})

module.exports = scene;