import { ProductEntity } from '../../../domain/entities';
import { ProductRepository } from '../../../domain';
import { UpdateProductdDTO } from '../../dto/product';

export interface UpdateProductUseCase {
    execute(id: string, data: UpdateProductdDTO): Promise<ProductEntity | null>;
}

export class UpdateProduct implements UpdateProductUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    execute(id: string, data: UpdateProductdDTO): Promise<ProductEntity | null> {
        return this.productRepository.update(id, data);
    }
}
