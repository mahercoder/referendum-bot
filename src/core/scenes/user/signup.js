const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { Models } = require('../../../models');
const { User } = Models;
const { helpers } = require('../../../utils');

const callback_data = {
    selected_district: 'user.signup.selected_district'
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

    return buttons;
}

const scene = new BaseScene('user-signup');

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.signup.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx));
    ctx.session.enteredMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data.split('--')[0]

    switch(action){
        case callback_data.selected_district: {
            await ctx.deleteMessage().catch( err => {});
            const districtIndex = +ctx.callbackQuery.data.split('--')[1]
            
            await User.update({ district_number: districtIndex }, { where: { id: ctx.from.id } })

            ctx.session.thisUser = (await User.findOne({ where: { id: ctx.from.id } })).dataValues;

            ctx.scene.enter('user-subscription');
            break;
        }
    }
})

module.exports = scene;