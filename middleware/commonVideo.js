const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // '/files' это директория в которую будут сохранятся файлы
    cb(null,`files/video/common`)
  },
  filename: (req, file, cb) => {
// Возьмем оригинальное название файла, и под этим же названием сохраним его на сервере
    cb(null, new Date().toISOString() + "-" + file.originalname)
  }
})

const types = [
  'video/mp4', 'video/mov', 'video/mpeg4', 'video/flv',
  'video/webm', 'video/asf', 'video/avi', 'video/mkv'
]

const fileFilter = (req, file, cb) => {
  
  
  if (types.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({ storage, fileFilter })