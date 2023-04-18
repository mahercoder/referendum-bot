const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { helpers } = require('../../../../utils');

const callback_data = {
    del_channel: 'admin.partner_channel.selected_district.del_channel',
    back: 'admin.partner_channel.selected_district.back',
}

async function makeButtons(ctx){
    let buttons = [];

    const partnerChannels = ctx.session.selected_district.channel_ids;
    
    for(let i=0; i < partnerChannels.length; i++){
        try{
            const channel = await ctx.telegram.getChat(partnerChannels[i])
            const url = channel.username ? `https://t.me/${channel.username}` : channel.invite_link

            buttons.push([
                { text: channel.title, url: url },
                { text: ctx.i18n.t(callback_data.del_channel), callback_data: `${callback_data.del_channel}--${i}` }
            ]);

        } catch(err){
            if(err.code == 403){
                BotSettigs.removePartnerChannel(i)
            }
        }
    }

    buttons.push([{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }])

    return buttons;
}

const scene = new BaseScene('admin-home-partner_channel-selected_district');

scene.enter( async ctx => {
    const districtName = ctx.session.selected_district.name
    const caption = ctx.i18n.t('admin.partner_channel.selected_district.caption', { districtName })
    const keyboard = helpers.makeInlineKeyboard(await makeButtons(ctx));
    ctx.session.enteredMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data.split('--')[0]

    switch(action){
        case callback_data.del_channel: {
            const index = ctx.callbackQuery.data.split('--')[1]
            const districtId = ctx.session.selected_district.id
            
            const channel = await ctx.telegram.getChat(helpers.getChannels()[index])
            const url = channel.username ? `https://t.me/${channel.username}` : channel.invite_link

            helpers.removeDistrictChannel(districtId, index);

            await ctx.deleteMessage(ctx.session.enteredMessage.message_id).catch( err => {})
            ctx.scene.reenter();

            await ctx.replyWithHTML(
                ctx.i18n.t('admin.partner_channel.rejected_contract')
                + `<a href="${url}">${channel.title}</a>`,
                { disable_web_page_preview: true }
            )

            break;
        }
        case callback_data.back: {
            await ctx.deleteMessage().catch( err => {});
            ctx.scene.enter('admin-home-partner_channel-district_channels');
            break;
        }
    }
})

scene.on('message', async ctx => {

    try{
        if(!ctx.message.forward_from_chat){
            await ctx.deleteMessage().catch( err => {})
            await ctx.reply(ctx.i18n.t('admin.partner_channel.err_forward'))
            await ctx.deleteMessage(ctx.session.enteredMessage.message_id).catch( err => {})
            ctx.scene.reenter();
        } else {
            if(await helpers.isBotAdminHere(ctx, ctx.message.forward_from_chat.id)){
                const districtId = ctx.session.selected_district.id

                await ctx.deleteMessage(ctx.session.enteredMessage.message_id).catch( err => {})
                await ctx.deleteMessage().catch( err => {})
                
                helpers.addDistrictChannel(districtId, ctx.message.forward_from_chat.id)

                await ctx.reply(ctx.i18n.t('admin.partner_channel.accepted'))
                ctx.scene.reenter();
            } else {
                await ctx.deleteMessage().catch( err => {})
                await ctx.reply(ctx.i18n.t('admin.partner_channel.rejected'))
                await ctx.deleteMessage(ctx.session.enteredMessage.message_id).catch( err => {})
                ctx.scene.reenter();
            }
        }
    }catch(err){
        await ctx.deleteMessage().catch( err => {})
        await ctx.reply(ctx.i18n.t('admin.partner_channel.err_forward'))
        await ctx.deleteMessage(ctx.session.enteredMessage.message_id).catch( err => {})
        ctx.scene.reenter();
    }
})

module.exports = scene;