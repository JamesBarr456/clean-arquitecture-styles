import { CreateProductDTO } from '../../dto/product';
import { ProductEntity } from '../../../domain/entities';
import { ProductRepository } from '../../../domain';

export interface CreateProductUseCase {
    execute(data: CreateProductDTO): Promise<ProductEntity>;
}

export class CreateProduct implements CreateProductUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    execute(data: CreateProductDTO): Promise<ProductEntity> {
        return this.productRepository.create(data);
    }
}
