import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async getIdByTitle(name: string): Promise<string | undefined> {
    const categorySearched = await this.findOne(name);

    if (!categorySearched) {
      return undefined;
    }

    return categorySearched.id;
  }
}

export default CategoriesRepository;
