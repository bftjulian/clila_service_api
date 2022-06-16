import { Hash } from '../../models/hash.model';
import { IHashRepository } from '../hash-repository.interface';

export class FakeHashRepository implements IHashRepository {
  private hashes: Hash[] = [];

  public async setUsedOrCreateUsed(hash: string): Promise<void> {
    const dataHash = this.hashes.find((h) => h.hash === hash);
    dataHash.in_use = true;
    dataHash.hash_length = 6;
  }

  public async setUsed(hash: string): Promise<void> {
    const dataHash = this.hashes.find((h) => h.hash === hash);
    dataHash.in_use = true;
    dataHash.hash_length = 6;
  }

  public async setUnused(hash: string): Promise<void> {
    const dataHash = this.hashes.find((h) => h.hash === hash);
    dataHash.in_use = false;
    dataHash.hash_length = 6;
  }

  public async isUsed(hash: string): Promise<boolean> {
    const findIndex = this.hashes.findIndex((h) => h.hash === hash);
    if (findIndex !== -1) {
      return false;
    }
    return true;
  }

  public async getFreeHashesCount(): Promise<number> {
    return 1;
  }

  public async create(hash: Hash): Promise<Hash> {
    const dataHash = { ...hash };
    this.hashes.push(dataHash);
    return dataHash;
  }

  public async createMany(hashes: Hash[]): Promise<Hash[]> {
    hashes.forEach((hash) => {
      this.hashes.push(hash);
    });
    return this.hashes;
  }

  public async findByHash(hash: string): Promise<Hash> {
    return this.hashes.find((h) => h.hash === hash);
  }

  public async setManyUsed(hashes: string[]): Promise<void> {
    hashes.forEach((hash) => {
      this.hashes.forEach((h) => {
        if (h.hash === hash) {
          h.in_use = true;
        }
      });
    });
  }

  public async getFreeHashes(
    count: number,
    hash_length: number,
  ): Promise<Hash[]> {
    return this.hashes.filter(
      (hash) => hash.in_use === false && hash.hash_length === hash_length,
    );
  }

  public async getOneFreeHash(hash_length: number): Promise<Hash> {
    return this.hashes.find(
      (hash) => hash.in_use === false && hash.hash_length === hash_length,
    );
  }
}
