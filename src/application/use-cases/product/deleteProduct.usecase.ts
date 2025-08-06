import { ProductRepository } from '../../../domain';

export interface DeleteProductUseCase {
    execute(id: string): Promise<boolean>;
}

export class DeleteProduct implements DeleteProductUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    execute(id: string): Promise<boolean> {
        return this.productRepository.delete(id);
    }
}
