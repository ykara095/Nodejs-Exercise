const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['en', 'tr'], // Desteklediğimiz diller
    defaultLocale: 'en',   // Hiçbir dil belirtilmezse varsayılan dil
    directory: path.join(__dirname, '../locales'), // Sözlük dosyalarımızın yeri
    autoReload: true,      // JSON dosyaları değiştiğinde sunucuyu kapatmadan algıla
    updateFiles: false     // Kendi kendine yeni key'ler oluşturmasın
});

module.exports = i18n;
