const fs = require('fs')
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // '/files' это директория в которую будут сохранятся файлы 
    const mimetype = file.mimetype

    let path = 'images'
    if (mimetype === 'image/png' || mimetype === 'image/jpeg' || mimetype === 'image/jpg' || mimetype === 'image/webp') {
      path = 'images'
    } else if (mimetype === 'video/mp4' || mimetype === 'video/mov' || mimetype === 'video/mpeg4' || mimetype === 'video/flv' || mimetype === 'video/webm' || mimetype === 'video/asf' || mimetype === 'video/avi') {
      path = 'video'
    } else if (mimetype === 'audio/mpeg' || mimetype === 'audio/ogg' || mimetype === 'audio/mp3' || mimetype === 'audio/aac') {
      path = 'audio'
    }

    cb(null,`files/${path}/posts`)
  },
  filename: (req, file, cb) => {
// Возьмем оригинальное название файла, и под этим же названием сохраним его на сервере
    cb(null, new Date().toISOString() + "-" + file.originalname)
  }
})

const types = [
  'image/png', 'image/jpeg', 'image/jpg', 'image/webp',
  'video/mp4', 'video/mov', 'video/mpeg4', 'video/flv', 'video/webm', 'video/asf', 'video/avi',
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