import { DataSource, In } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { TransactionCategory } from '../entities/transaction-category.entity';
import { transactionCategorySeed } from './data/transaction-category.seed.data';

export class TransactionCategorySeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource, _factoryManager: SeederFactoryManager): Promise<any> {
    const repository = dataSource.getRepository(TransactionCategory);

    const transactionCategories = await repository.find({
      where: {
        name: In(transactionCategorySeed.map((item) => item.name)),
      },
    });

    const transactionCategoriesToSave = transactionCategorySeed.filter(
      (item) => !transactionCategories.find((category) => category.name === item.name)
    );

    if (transactionCategoriesToSave.length > 0) {
      await repository.save(transactionCategoriesToSave);
    }
  }
}
