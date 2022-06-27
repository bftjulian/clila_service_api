import { Hash } from '../models/hash.model';

export interface IHashRepository {
  create(hash: Hash): Promise<Hash>;
  createMany(hashes: Hash[]): Promise<Hash[]>;
  findByHash(hash: string): Promise<Hash | undefined>;
  getFreeHashes(count: number, hash_length: number): Promise<Hash[]>;
  setManyUsed(hashes: string[]): Promise<void>;
  getOneFreeHash(hash_length: number): Promise<Hash>;
  getFreeHashesCount(): Promise<number>;
  setUsedOrCreateUsed(hash: string): Promise<void>;
  setUsed(hash: string): Promise<void>;
  setUnused(hash: string): Promise<void>;
  isUsed(hash: string): Promise<boolean>;
  setAllUnusedByHash(hash: string[]): Promise<void>;
  getAllInUse(): Promise<Hash[]>;
}
