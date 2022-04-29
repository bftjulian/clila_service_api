import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hash } from '../../models/hash.model';
import { Model } from 'mongoose';
import { IHashRepository } from '../hash-repository.interface';
import { ObjectId } from 'mongodb';

@Injectable()
export class HashRepository implements IHashRepository {
  constructor(@InjectModel('Hash') private readonly hashModel: Model<Hash>) {}

  public async setUsed(hash: string): Promise<void> {
    await this.hashModel.updateOne(
      { hash },
      { in_use: true, hash_length: hash.length },
      { upsert: true },
    );
  }

  public async setUnused(hash: string): Promise<void> {
    await this.hashModel.updateOne(
      { hash },
      { in_use: false, hash_length: hash.length },
      { upsert: true },
    );
  }

  public async isUsed(hash: string): Promise<boolean> {
    const usedHash = await this.hashModel.findOne({ hash, in_use: true });

    return !!usedHash;
  }

  public async getFreeHashesCount(): Promise<number> {
    return this.hashModel.countDocuments({ in_use: false });
  }

  public async create(hash: Hash): Promise<Hash> {
    return this.hashModel.create(hash);
  }

  public async createMany(hashes: Hash[]): Promise<Hash[]> {
    return this.hashModel.insertMany(hashes, { ordered: false });
  }

  public async findByHash(hash: string): Promise<Hash> {
    return this.hashModel.findOne({ hash });
  }

  public async setManyUsed(hashes: string[]): Promise<void> {
    await this.hashModel.updateMany(
      { hash: { $in: hashes } },
      { in_use: true },
    );
  }

  public async getFreeHashes(
    count: number,
    hash_length: number,
  ): Promise<Hash[]> {
    return this.hashModel
      .find({ in_use: false, hash_length })
      .select('hash _id')
      .limit(count);
  }

  public async getOneFreeHash(hash_length: number): Promise<Hash> {
    return this.hashModel
      .findOne({ in_use: false, hash_length })
      .select('hash _id');
  }
}
