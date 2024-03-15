const mongoose = require('mongoose');

const { Schema } = mongoose;

const blockedIpSchema = new Schema({
  userIp: String,
  lastBlockedTime: {
    type: Date,
    default: null,
  },
  blockCount: Number,
  requestCount: Number,
});

const BlockedIp = mongoose.model('BlockedIp', blockedIpSchema);

module.exports = BlockedIp;
