const { doesNotMatch } = require('assert');
const Bull = require('bull');
const dotenv  = require('dotenv');

dotenv.config();

class SomeQueue {
  constructor(queueName) {
    this.queue = new Bull(queueName, { redisConnect: { url: process.env.REDIS_URI } });
    this.queue.process(this.processJob.bind(this));

    this.queue.on('failed', this.handleFailedJob.bind(this));
    this.queue.on('completed', this.handleCompletedJob.bind(this));
    this.queue.on('error', this.handleErrorJob.bind(this));
    this.queue.on('progress', this.handleProgressJob.bind(this));
    this.queue.on('drained', this.handleDrainedJob.bind(this));
    this.queue.on('stalled', this.handleStalledJob.bind(this));
  }
  async addJob(jobToAdd, priority = 0, delay = 0, removeOnComplete = false) {
    // jobToAdd format validation
    if (typeof jobToAdd !== 'object' || !jobToAdd) {
      throw new Error('Invalid jobData format, data must be an object');
    }
    await this.queue.add(jobToAdd, {
      // Jobs with higher priority values are processed before jobs with lower priorities.
      priority,  // Higher priority gets processed sooner
      // allows you to schedule the job for processing after a specific delay
      // (in milliseconds). The job will be added to the queue but won't be
      // processed until the delay period is over.
      delay, // Delay processing for 5 seconds
      // this will return the job's id, allows tracking of a specific job
      removeOnComplete, // removes the job from the queue once it's successfully processed.
      attempts: 5, // Retry up to 5 times on failure
      // Exponential backoff increases the delay between retries,
      // preventing overwhelming workers with retries.
      backoff: { type: 'exponential', delay: 1000 }, // Exponential backoff for retries
    });
  }
  async addBulkJobs(listOfJobs, priority = 0, delay = 0, removeOnComplete = true) {
    if (!Array.isArray(listOfJobs) || !listOfJobs) {
      throw new Error('Invalid Jobdata format, data must be an array of objects');
    }

    const validJobs = listOfJobs.filter((object) => {
      typeof object === 'object';
    });
    if (!validJobs.name || !validJobs.data || typeof validJobs.data !== 'object') {
      throw new Error('Invalid Jobdata format, data must be an array of objects');
    }
    await this.queue.addBulk(validJobs, {
      priority,
      delay,
      removeOnComplete,
      attempts,
      backoff: { type: 'exponential', delay: 1000 },
    });
  }
  async processJob(jobDataToProcess, done) {
    console.log('processing: ', jobDataToProcess.data);
    // simulate processing a job
    if (Math.random() < 0.1) {
      // when job fails
      throw new Error('Failed to process job');
    }
    // Job processed successfully (assuming successful email sending)
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
      console.log('Emails sent successfully: ', jobDataToProcess.data);
    });
    done();
  }
  async handleFailedJob(job, err) {
    if (job.attemptsMade < 3) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.retryJob(job);
    } else {
      console.error('job reached maximum retries: ', job.id);
      await job.moveToFailed({message: err.message });
    }
  }
  async retryJob(jobDataToRetry) {
    console.log('retrying the job: ', jobDataToRetry.id);
    jobDataToRetry.retry();
  }
  async handleCompletedJob(job, result) {
    console.log('job ID: ', job.id);
    console.log('job completed: ', result);
  }
  async handleStalledJob(job) {
    console.log('Job stalled: ', job.id);
  }
  async handleErrorJob(error) {
    console.error(error.message);
  }
  async handleProgressJob(job, progress) {
    console.log('job ID: ', job.id);
    consolelog('job progress: ', progress);
  }
  async handleDrainedJob() {
    console.log('all jobs processed');
  }
  async close() {
    this.queue.close();
  }
}

module.exports = SomeQueue;
