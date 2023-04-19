const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { helpers } = require('../../../utils');

const callback_data = {
    shape_1: 'user.select_shape.shape_1',
    shape_2: 'user.select_shape.shape_2',
    shape_3: 'user.select_shape.shape_3',
    shape_4: 'user.select_shape.shape_4'
}

function makeButtons(ctx){
    return [
        [
            { text: ctx.i18n.t(callback_data.shape_1), callback_data: callback_data.shape_1 }, 
            { text: ctx.i18n.t(callback_data.shape_2), callback_data: callback_data.shape_2 }
        ],
        [
            { text: ctx.i18n.t(callback_data.shape_3), callback_data: callback_data.shape_3 }, 
            { text: ctx.i18n.t(callback_data.shape_4), callback_data: callback_data.shape_4 }
        ]
    ]
}

const scene = new BaseScene('user-home');

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.home.caption');
    ctx.replyWithHTML(caption);
});

scene.on('photo', async ctx => {
    try{
        const photos = ctx.message.photo;
        const { file_id } = photos.reduce((acc, cur) => cur.file_size > acc.file_size ? cur : acc);
        const fileLink = await ctx.telegram.getFileLink(file_id);

        const fileName = `${ctx.from.id}-${Date.now().toString()}.jpg`;
        const dirName = path.join(__dirname, '..', '..', '..', '/temp', `/${fileName}`);

        ctx.session.fileName = dirName;

        const writer = fs.createWriteStream(dirName);
        
        axios({
            method: 'get', url: fileLink, responseType: 'stream'
        }).then( async response => {
            response.data.pipe(writer);
            writer.on('finish', () => {
                const caption = ctx.i18n.t('user.select_shape.caption');
                const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx));
                const photoPath = path.join(__dirname, '..', '..', '..', '/assets/temp.jpg');
                ctx.replyWithPhoto({ source: photoPath }, {
                    caption, 
                    reply_markup: keyboard ,
                    parse_mode: 'HTML'
                });
            });
        })
    }catch(err){
        console.log(err);
    }
});

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.shape_1: {
            const imgShape1 = path.join(__dirname, '..', '..', '..', '/assets/1.png');
            const readyImagePath = path.join(__dirname, '..', '..', '..', '/temp', `/${ctx.from.id}-${Date.now().toString()}.jpg`);
            helpers.makeImage([ ctx.session.fileName, imgShape1 ], readyImagePath, async () => {
                const caption = ctx.i18n.t('user.select_shape.ready');
                
                await ctx.deleteMessage().catch();
                await ctx.replyWithPhoto({ source: readyImagePath });

                fs.unlinkSync(ctx.session.fileName);
                fs.unlinkSync(readyImagePath);

                await ctx.reply(caption);

                // await ctx.scene.leave();
            });
            break;
        }
        case callback_data.shape_2: {
            const imgShape1 = path.join(__dirname, '..', '..', '..', '/assets/2.png');
            const readyImagePath = path.join(__dirname, '..', '..', '..', '/temp', `/${ctx.from.id}-${Date.now().toString()}.jpg`);
            helpers.makeImage([ ctx.session.fileName, imgShape1 ], readyImagePath, async () => {
                const caption = ctx.i18n.t('user.select_shape.ready');
                
                await ctx.deleteMessage().catch();
                await ctx.replyWithPhoto({ source: readyImagePath });

                fs.unlinkSync(ctx.session.fileName);
                fs.unlinkSync(readyImagePath);

                await ctx.reply(caption);

                // await ctx.scene.leave();
            });
            break;
        }
        case callback_data.shape_3: {
            const imgShape1 = path.join(__dirname, '..', '..', '..', '/assets/3.png');
            const readyImagePath = path.join(__dirname, '..', '..', '..', '/temp', `/${ctx.from.id}-${Date.now().toString()}.jpg`);
            helpers.makeImage([ ctx.session.fileName, imgShape1 ], readyImagePath, async () => {
                const caption = ctx.i18n.t('user.select_shape.ready');

                await ctx.deleteMessage().catch();
                await ctx.replyWithPhoto({ source: readyImagePath });

                fs.unlinkSync(ctx.session.fileName);
                fs.unlinkSync(readyImagePath);

                await ctx.reply(caption);

                // await ctx.scene.leave();
            });
            break;
        }
        case callback_data.shape_4: {
            const imgShape1 = path.join(__dirname, '..', '..', '..', '/assets/4.png');
            const readyImagePath = path.join(__dirname, '..', '..', '..', '/temp', `/${ctx.from.id}-${Date.now().toString()}.jpg`);
            helpers.makeImage([ ctx.session.fileName, imgShape1 ], readyImagePath, async () => {
                const caption = ctx.i18n.t('user.select_shape.ready');

                await ctx.deleteMessage().catch();
                await ctx.replyWithPhoto({ source: readyImagePath });

                fs.unlinkSync(ctx.session.fileName);
                fs.unlinkSync(readyImagePath);

                await ctx.reply(caption);

                // await ctx.scene.leave();
            });
            break;
        }
    }
});

module.exports = scene;