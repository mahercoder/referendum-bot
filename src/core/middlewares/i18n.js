const TelegrafI18n = require('telegraf-i18n');
const path = require('path');

const i18n = new TelegrafI18n({
  useSession: true,
  defaultLanguage: 'uz',
  directory: path.join(__dirname, '..', '..','/locales'),
});

module.exports = i18n.middleware();
