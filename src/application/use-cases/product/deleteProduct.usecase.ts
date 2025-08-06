import { ProductRepository } from '../../../domain';

export class DeleteProductUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    async execute(id: string): Promise<boolean> {
        return await this.productRepository.delete(id);
    }
}
