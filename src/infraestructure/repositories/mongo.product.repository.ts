import { ProductFilterOptions } from "../../application/dto/product";
import { ProductRepository } from "../../domain";
import { ProductEntity } from "../../domain/entities";
import { ProductModel } from "../database/mongo/models";

export class MongoProductRepository extends ProductRepository {
  async create(product: ProductEntity): Promise<ProductEntity> {
    const createdProduct = await ProductModel.create(product);
    return createdProduct.toObject();
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await ProductModel.findById(id);
    return product ? product.toObject() : null;
  }

  async findAll(options: ProductFilterOptions): Promise<ProductEntity[]> {
  const {
    page = 1,
    limit = 10,
    sort = 'created_at',
    order = 'asc',
    max_price,
    min_price,
    brand,
    category,
    genre,
    name,
    has_discount,
    is_active,
    size,
    sku
  } = options;

  const skip = (page - 1) * limit;
  const sortOrder = order === 'asc' ? 1 : -1;

 const filter: Record<string, any> = {
    ...(name && { name: { $regex: new RegExp(name, 'i') } }),
    ...(sku && { sku }),
    ...(brand && { brand }),
    ...(Array.isArray(category) && category.length > 0 && { category: { $in: category } }),
    ...(Array.isArray(genre) && genre.length > 0 && { genre: { $in: genre } }),
    ...(Array.isArray(size) && size.length > 0 && { size: { $in: size } }),
    ...(typeof is_active === 'boolean' && { is_active }),
    ...(has_discount === true && { has_discount: true }),
    ...((typeof min_price === 'number' || typeof max_price === 'number') && {
      sale_price: {
        ...(typeof min_price === 'number' && { $gte: min_price }),
        ...(typeof max_price === 'number' && { $lte: max_price }),
      }
    })
  };
  const products = await ProductModel.find(filter)
    .sort({ [sort]: sortOrder })
    .skip(skip)
    .limit(limit)
    .exec();

  return products.map(p => p.toObject());
}

  async update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity | null> {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, product, {
      new: true,
      runValidators: true
    });
    return updatedProduct ? updatedProduct.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id);
    return result !== null;
  }
}