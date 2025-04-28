import { DataSource, In } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { TransactionService } from '../entities/transaction-service.entity';
import { transactionServiceSeed } from './data/transaction-service.seed.data';

export class TransactionServiceSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource, _factoryManager: SeederFactoryManager): Promise<any> {
    const repository = dataSource.getRepository(TransactionService);

    const transactionServices = await repository.find({
      where: {
        name: In(transactionServiceSeed.map((item) => item.name)),
      },
    });

    const transactionServicesToSave = transactionServiceSeed.filter(
      (item) => !transactionServices.find((service) => service.name === item.name)
    );

    if (transactionServicesToSave.length > 0) {
      await repository.save(transactionServicesToSave);
    }
  }
}
