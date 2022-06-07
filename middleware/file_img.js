const fs = require('fs')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // '/files' это директория в которую будут сохранятся файлы 
    cb(null,`files/images/avatar/${req.session.userId.toString()}`)
  },
  filename: (req, file, cb) => {
// Возьмем оригинальное название файла, и под этим же названием сохраним его на сервере
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})

const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({ storage, fileFilter })