'use strict'

const { save } = require('nconf')
const successHandler = require('../utils/successHandler')
const userErrorHandler = require('../utils/userErrorHandler')
const errorHandler = require('../utils/errorHandler')

const Groop = require('../models/groops').groop
// const errorHandler = require('../utils/errorHandler')
// const successHandler = require('../utils/successHandler')
// const userErrorHandler = require('../utils/userErrorHandler')

exports.createGroop = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    const newGroop = new Groop({
      authorId: req.query.authorId,
      title: req.query.title,
      type: req.query.groopType
    })
    await newGroop.save()
    res.status(201).json('Groop created' + newGroop)
  }
}
exports.getGroops = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    const groops = await Groop.find()
    res.status(200).json(groops)
  }
};
exports.getGroopInfo = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    const groop = await Groop.findById(req.params.groopId)
    res.status(200).json(groop)
  }
};
exports.deleteGroop = async(req, res, next) => {
  res.status(200).json('Delete groop is riched')
};

exports.addFollower = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    const groop = await Groop.findById(req.params.groopId)
    if (groop) {
      if (groop.followers.includes(req.session.userId)) {
        res.status(400).json('Ви вже являєтесь підписником')
      } else {
        groop.followers.push(req.session.userId)
        await groop.save()
        res.status(201).json({message: 'Ласкаво просимо до групи'})
      }
    } else {
      res.status(404).json('Такої групи не існує')
    }
  };
}
exports.deleteFollower = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    const groop = await Groop.findById(req.params.groopId)
    if (groop) {
      if (!groop.followers.includes(req.session.userId)) {
        res.status(400).json('Ви вже являєтесь підписником')
      } else {
        groop.followers.pull(req.session.userId)
        await groop.save()
        res.status(200).json({ message: 'Ви відписались від цієї групи' })
      }
    } else {
      res.status(404).json('Такої групи не існує')
    }
  }
};