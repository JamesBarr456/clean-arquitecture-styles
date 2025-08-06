import { ProductEntity } from '../../../domain/entities';
import { ProductRepository } from '../../../domain';

export interface GetProductUseCase {
    execute(id: string): Promise<ProductEntity | null>;
}

export class GetProduct implements GetProductUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    execute(id: string): Promise<ProductEntity | null> {
        return this.productRepository.findById(id);
    }
}
