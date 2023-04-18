const sharp = require('sharp');

// Rasmlar manzillarini ro'yxatda saqlash
const images = [
  './image1.jpg',
  './image2.png'
];

(async () => {
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
  .toFile('final.jpg')
  .then( () => console.log('Done!'))
})();