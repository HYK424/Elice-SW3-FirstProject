import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('categories', CategorySchema);

export class CategoryModel {
  static async create(categoryInfo) {
    const newCategory = await Category.create(categoryInfo);
    return newCategory;
  }

  static async findDuplicate({ name, id }) {
    const category = await Category.findOne({ $or: [{ name }, { id }] });
    return category;
  }

  static async findAll() {
    const categories = await Category.find({});
    return categories;
  }

  static async findById(categoryId) {
    const category = await Category.findOne({ id: categoryId });
    return category;
  }

  static async countProducts(categoryId) {
    const productCount = await Category.aggregate([
      {
        $match: {
          id: categoryId,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'name',
          foreignField: 'category',
          as: 'products',
        },
      },
      {
        $unwind: {
          path: '$products',
        },
      },
      {
        $count: 'products',
      },
    ]);
    console.log(productCount);
    return productCount;
  }

  static async update(categoryId, updateInfo) {
    const filter = { id: categoryId };
    const option = { returnOriginal: false };

    const updatedCategory = await Category.findOneAndUpdate(
      filter,
      updateInfo,
      option,
    );
    return updatedCategory;
  }

  static async delete(categoryId) {
    const filter = { id: categoryId };
    const result = await Category.findOneAndRemove(filter);
    return result;
  }
}
