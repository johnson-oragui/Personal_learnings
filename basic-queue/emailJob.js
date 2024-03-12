const BullQueue = require('./BullQueue/BullQueue');

const emailQueue = new BullQueue('emailQueue');

const emailAddresses = ['user1@example.com', 'user2@example.com', 'user3@example.com'];

emailAddresses.forEach(async (email) => {
  await emailQueue.addJob({ emails: emailAddresses });
});

setTimeout(async () => {
  await emailQueue.close();
}, 1000 * emailAddresses.length);
