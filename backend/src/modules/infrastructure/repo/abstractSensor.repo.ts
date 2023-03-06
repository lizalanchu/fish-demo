import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractSensor } from '../model';

@Injectable()
export class AbstractSensorRepo {
  constructor(
    @InjectRepository(AbstractSensor)
    private readonly repo: Repository<AbstractSensor>,
  ) {}

  async getAll(): Promise<AbstractSensor[]> {
    return await this.repo.find();
  }

  async createOnePlain(
    newAbstractSensor: Pick<AbstractSensor, PlainKeysAllowedToModify>,
  ): Promise<
    Pick<
      AbstractSensor,
      PlainKeysAllowedToModify | PlainKeysGeneratedAfterInsert
    >
  > {
    const createdAbstractSensor = await this.repo.insert(newAbstractSensor);
    console.log('createdAbstractSensor: ', createdAbstractSensor);
    createdAbstractSensor;
    return {} as any;
  }

  async createManyPlain(
    newAbstractSensors: Pick<AbstractSensor, PlainKeysAllowedToModify>[],
  ): Promise<
    Pick<
      AbstractSensor,
      PlainKeysAllowedToModify | PlainKeysGeneratedAfterInsert
    >[]
  > {
    const createdAbstractSensor = await this.repo.insert(newAbstractSensors);
    console.log('createdAbstractSensor: ', createdAbstractSensor);
    createdAbstractSensor;
    return {} as any;
  }
}

type PlainKeysGeneratedAfterInsert = 'id' | 'createdAt' | 'updatedAt';

type PlainKeysAllowedToModify = 'modelName';
