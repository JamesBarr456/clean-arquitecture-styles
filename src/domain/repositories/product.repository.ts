import { ProductFilterOptions } from "../../application/dto/product";
import { ProductEntity } from "../entities";

export abstract class ProductRepository {
  abstract create(product: ProductEntity): Promise<ProductEntity>;
  abstract findById(id: string): Promise<ProductEntity | null>;
  abstract findAll(options:ProductFilterOptions): Promise<ProductEntity[]>;
  abstract update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity | null>;
  abstract delete(id: string): Promise<boolean>;

}
