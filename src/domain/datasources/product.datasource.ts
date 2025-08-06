import { ProductEntity } from '../entities';
import { ProductFilterOptionsDTO } from '../../application/dto/product';

export abstract class ProductDatasource {
    abstract create(product: ProductEntity): Promise<ProductEntity>;
    abstract findById(id: string): Promise<ProductEntity | null>;
    abstract findAll(options: ProductFilterOptionsDTO): Promise<ProductEntity[]>;
    abstract update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity | null>;
    abstract delete(id: string): Promise<boolean>;
}
