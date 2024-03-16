const BlockedIpModel = require('../models/blockedIpModel');

const addBlockedIp = async (userIp) => {
  try {
    const newBlockedIp = await new BlockedIpModel(userIp);
    const blockedIp = await newBlockedIp.save();
    console.log('blockedIp from getBlockedIpt: ', blockedIp);
  } catch (error) {
    console.error('error in addBlockedIP: ', error.message);
    throw new Error('Failed to add Blocked IP to database');
  }
};

const updateBlockedIp = async (userIp, requestCount) => {
  try {
    const updatedRequestCount = await BlockedIpModel.findOneAndUpdate(
      { userIp },
      { requestCount },
      { upsert: true },
    );
    console.log('updatedRequestCount from updateBlockedIpt: ', updatedRequestCount);
  } catch (error) {
    console.error('error in addBlockedIP: ', error.message);
    throw new Error('Failed to add Blocked IP to database');
  }
};

const getBlockedIp = async (userIp) => {
  try {
    const blockedIp = await BlockedIpModel.findOne({ userIp });
    console.log('blockedIp from getBlockedIpt: ', blockedIp);
    if (!blockedIp) {
      return null;
    }
    return blockedIp;
  } catch (error) {
    console.error('Failed to retrieve ip from database, getBlockedIP: ', error.message);
    throw new Error('Failed to retrived IP from database');
  }
};

const deleteBlockedIp = async (userIp) => {
  try {
    const blockedIp = await BlockedIpModel.findOneAndDelete({ userIp });
    console.log('deleted blockedIp from deleteBlockedIpt: ', blockedIp);
    return 'successfuly deleted Blocked User Ip';
  } catch (error) {
    console.error('Failed to retrieve ip from database, getBlockedIP');
    throw new Error('Failed to retrived IP from database');
  }
};

module.exports = { addBlockedIp, updateBlockedIp, getBlockedIp, deleteBlockedIp };
