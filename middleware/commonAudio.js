const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // '/files' это директория в которую будут сохранятся файлы
    cb(null,`files/audio/common`)
  },
  filename: (req, file, cb) => {
// Возьмем оригинальное название файла, и под этим же названием сохраним его на сервере
    cb(null, new Date().toISOString() + "-" + file.originalname)
  }
})

const types = [
  'audio/mpeg', 'audio/ogg', 'audio/mp3', 'audio/aac'
]

const fileFilter = (req, file, cb) => {
  
  
  if (types.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({ storage, fileFilter })