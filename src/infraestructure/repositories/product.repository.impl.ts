import { ProductDatasource } from '../../domain/datasources';
import { ProductEntity } from '../../domain/entities';
import { ProductFilterOptionsDTO } from '../../application/dto/product';
import { ProductRepository } from '../../domain';

export class ProductRepositoryImpl implements ProductRepository {
    constructor(private readonly datasource: ProductDatasource) {}
    // Implementación de los métodos definidos en ProductRepository
    create(product: ProductEntity): Promise<ProductEntity> {
        return this.datasource.create(product);
    }
    findById(id: string): Promise<ProductEntity | null> {
        return this.datasource.findById(id);
    }
    findAll(options: ProductFilterOptionsDTO): Promise<ProductEntity[]> {
        return this.datasource.findAll(options);
    }
    update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity | null> {
        return this.datasource.update(id, product);
    }
    delete(id: string): Promise<boolean> {
        return this.datasource.delete(id);
    }
}
