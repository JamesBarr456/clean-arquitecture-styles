import { ProductEntity } from '../../../domain/entities';
import { ProductFilterOptionsDTO } from '../../dto/product';
import { ProductRepository } from '../../../domain';

export interface FindAllProductsUseCase {
    execute(options: ProductFilterOptionsDTO): Promise<ProductEntity[]>;
}

export class FindAllProducts implements FindAllProductsUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    execute(options: ProductFilterOptionsDTO): Promise<ProductEntity[]> {
        return this.productRepository.findAll(options);
    }
}
