'use strict'

const response = require('../response')
const db = require('../settings/db_mongo')

var express = require('express');
var router = express.Router();
const User = require('../models/user').user
const HttpError = require('../error');
const { ConnectionPoolClearedEvent } = require('mongodb');
const fs = require('fs')
const path = require('path');
const { is } = require('express/lib/request');

exports.setFollow = async(req, res, next) => {
  if (req.session.userId) {

    let newOwnerFollowersArray = []
    let newFriendFollowersArray = []

    const owner = await User.findById(req.session.userId)
    const friend = await User.findById(req.query.userId)

    let isOwnerInDbUser = false
    let isUserInDbOwner = false
    
    await owner.followers.forEach(a => {
      if (a.userId == friend._id) isUserInDbOwner = true
      if (isUserInDbOwner && a.friendStatus == 'query-for-answer') {
        newOwnerFollowersArray.push({userId: a.userId, friendStatus: 'followed'})
      } else { 
        newOwnerFollowersArray.push({userId: a.userId, friendStatus: a.friendStatus})
      }
    });
    await friend.followers.forEach(a => {
      if (a.userId == owner._id) isOwnerInDbUser = true
      if (isOwnerInDbUser && a.friendStatus == 'pending-for-answer') {
        newFriendFollowersArray.push({ userId: a.userId, friendStatus: 'followed' })
      } else {
        newFriendFollowersArray.push({ userId: a.userId, friendStatus: a.friendStatus })
      }
    });
    
    !isUserInDbOwner && newOwnerFollowersArray.push({ userId: req.query.userId, friendStatus: 'pending-for-answer' })
    !isOwnerInDbUser && newFriendFollowersArray.push({ userId: owner._id, friendStatus: 'query-for-answer' })

      User.findOneAndUpdate({ _id: req.session.userId },
        { followers: newOwnerFollowersArray },
        (err, user) => {
    
        if (err) next(err)
        res.json(res.data)
    
        })
      User.findOneAndUpdate({ _id: friend._id },
        { followers: newFriendFollowersArray },
        (err, user) => {
        
        if (err) next(err)
        res.json(res.data)
  
      })
    
  }
}

exports.deleteFollow = async(req, res, next) => {
  if (req.session.userId) {

    let newOwnerFollowersArray = []
    let newFriendFollowersArray = []

    const owner = await User.findById(req.session.userId)
    const friend = await User.findById(req.query.userId)
    
    await owner.followers.forEach(a => {
      if (a.userId != friend._id) {
        newOwnerFollowersArray.push({userId: a.userId, friendStatus: a.friendStatus})
      } else { 
        return
      }
    });
    await friend.followers.forEach(a => {
      if ((a.userId != owner._id && a.friendStatus == 'pending-for-answer') || (a.userId != owner._id && a.friendStatus == 'followed')) {
        newFriendFollowersArray.push({ userId: a.userId, friendStatus: a.friendStatus })
      } else {
        return
      }
    });
    
      User.findOneAndUpdate({ _id: req.session.userId },
        { followers: newOwnerFollowersArray },
        (err, user) => {
    
        if (err) next(err)
        res.json(res.data)
    
        })
      User.findOneAndUpdate({ _id: friend._id },
        { followers: newFriendFollowersArray },
        (err, user) => {
        
        if (err) next(err)
        res.json(res.data)
  
      })
    
  }
}
exports.getFollow = async (req, res, next) => {
  let followerData = ''
  if (req.session.userId) {

    const owner = await User.findById(req.session.userId)

    
    
    owner.followers.forEach(a => {
      if (a.userId == req.query.userId) {
        followerData = (a.friendStatus)
      } else {
        return
      }
      
    })
  }
  res.json(followerData)
}

