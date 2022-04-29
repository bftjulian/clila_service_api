import * as _cluster from 'cluster';
import { Injectable } from '@nestjs/common';
import * as os from 'os';
const numCPUs = os.cpus().length;

const cluster = _cluster as unknown as _cluster.Cluster;

@Injectable()
export class AppClusterService {
  static clusterize(callback: Function): void {
    if (cluster.isPrimary) {
      console.log(`Master server started on ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting`);
        cluster.fork();
      });
    } else {
      console.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
