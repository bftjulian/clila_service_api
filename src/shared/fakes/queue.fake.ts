import { Job, JobCounts, JobId, JobOptions, JobStatus, Queue } from 'bull';
import { v4 } from 'uuid';

export class FakeJob {
  constructor(public data, public opts, private queue: FakeQueue) {
    this.id = opts.jobId;
  }

  public id: string;
  private progressNumber = 0;
  attemptsMade: number;
  processedOn?: number;
  finishedOn?: number;
  timestamp: number;
  name: string;
  stacktrace: string[];
  returnvalue: any;
  failedReason?: string;
  progress();
  progress(value: any): Promise<void>;
  progress(value?: any): any {
    this.progressNumber = value;
  }

  async remove(): Promise<void> {
    await this.queue.remove(this.id);
  }
}

export class FakeQueue {
  private queue = {};
  private ids = {};
  name: string;

  async remove(jobId: JobId): Promise<void> {
    const name = this.ids[jobId];
    if (!name) return;

    const index = this.queue[name].findIndex((j) => j.id === jobId);
    if (index < 0) return;

    this.queue[name].splice(index, 1);
    delete this.ids[jobId];
  }

  async add(name: any, data?: any, opts?: any): Promise<FakeJob> {
    if (!this.queue[name]) this.queue[name] = [];
    if (!opts.jobId) opts.jobId = v4();

    this.ids[opts.jobId] = name;

    const job = new FakeJob(data, opts, this);
    this.queue[name].push(job);

    return job;
  }

  async addBulk(
    jobs: { name?: string; data: any; opts?: Omit<JobOptions, 'repeat'> }[],
  ): Promise<Job[]> {
    const jobsToInsert = jobs.reduce((acc, job) => {
      if (!acc) acc = {};
      if (!acc[job.name]) acc[job.name] = [];
      job.opts.jobId = v4();
      this.ids[job.opts.jobId] = job.name;
      acc[job.name].push(new FakeJob(job.data, job.opts, this));
      return acc;
    }, {});

    Object.keys(jobsToInsert).forEach((name) => {
      if (!this.queue[name]) this.queue[name] = [];
      this.queue[name].push(...jobsToInsert[name]);
    });

    return Object.keys(jobsToInsert).map((name) => jobsToInsert[name]);
  }

  async getJob(jobId: JobId): Promise<Job<any>> {
    const name = this.ids[jobId];
    if (!name) return null;
    const job = this.queue[name].find((j) => j.id === jobId);

    return job;
  }
  async getJobCounts(): Promise<JobCounts> {
    return {
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
      waiting: 0,
    };
  }
}
