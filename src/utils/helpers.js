const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Constants = require('./constants.json');

const TEMP_PATH = path.join(__dirname, '..', '/temp')

// [/temp] mavjud bo'lmasa uni ochadi
if(!fs.existsSync(TEMP_PATH)){
     fs.mkdirSync(TEMP_PATH)
}

Constants.tempPath = TEMP_PATH;

/**
 * Example: matrixify([1,2,3,4,5,6,7,8], 3) === [[1,2,3][4,5,6][7,8]]
 * 
 * @param arr 
 * @param dimen 
 */
function matrixify(arr, dimen){
    let matrix = [], i, k;

    for(i=0, k=-1; i < arr.length; i++){
        if(i % dimen === 0){
            k++;
            matrix[k] = [];
        }
        matrix[k].push(arr[i]);
    }

    return matrix;
}

function getTempPath(){
    return Configuration.tempPath;
}

function getChannels(){
    return Constants.channel_ids;
}

function addChannel(chat_id){
    Constants.channel_ids.push(chat_id);

    fs.writeFileSync(path.join(__dirname, '/constants.json'), JSON.stringify(Constants));
}

function removeChannel(index){
    Constants.channel_ids.splice(index, 1);
    fs.writeFileSync(path.join(__dirname, '/constants.json'), JSON.stringify(Constants));
}

function addDistrictChannel(district_id, chat_id){
    Constants.districts[district_id].channel_ids.push(chat_id);
    fs.writeFileSync(path.join(__dirname, '/constants.json'), JSON.stringify(Constants));
}

function getDistrictChannels(district_id){
    return Constants.districts[district_id].channel_ids;
}

/**
 * ButtonObject -> { text: 'some text', callback_data: 'some_text' }
 * @param {Array<ButtonObject>} buttons
 * @return {Array<InlineKeyboardButton>}
 */
function makeInlineKeyboard(buttons){
    const inline_keyboard = [];
    for(let i=0; i < buttons.length; i++){
        inline_keyboard.push(buttons[i]);
    }
    return {
        inline_keyboard: inline_keyboard
    };
}

// Ushbu intervaldagi [min, max] tasodifiy sonlarni qaytaradi
function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// images => Array: ['image/path/img.jpg', 'image/path/img2/png']
async function makeImage(images, readyImagePath, callback = ()=>{}){
    // Rasmlarni yuklash va 1080x1080 ga o'lchamlarni qayta ishlash
    const resizedImages = await Promise.all(images.map(image => 
    sharp(image).resize({ width: 1080, height: 1080 }).toBuffer()
    ));

    // Birlashtiriladigan rasmlar ro'yxatini yaratish
    const compositeImages = resizedImages.map(buffer => ({ input: buffer }));

    // Rasmlarni birlashtirish
    await sharp({
        create: {
            width: 1080,
            height: 1080,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    })
    .composite(compositeImages)
    .toFile(readyImagePath)
    .then( () => callback() )
}

module.exports = {
    matrixify,
    
    makeInlineKeyboard,
    getRandomNumber,
    makeImage,

    getTempPath,
    getChannels,
    addChannel,
    removeChannel,
    addDistrictChannel,
    getDistrictChannels
}