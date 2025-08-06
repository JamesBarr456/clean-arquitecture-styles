import { ProductEntity } from '../../../domain/entities';
import { ProductRepository } from '../../../domain';

export class GetProductByIdUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    async execute(id: string): Promise<ProductEntity | null> {
        if (!id) {
            throw new Error('Product ID is required');
        }

        const product = await this.productRepository.findById(id);

        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }
        return product;
    }
}
