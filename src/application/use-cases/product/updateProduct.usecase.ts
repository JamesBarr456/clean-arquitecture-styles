import { ProductEntity } from '../../../domain/entities';
import { ProductRepository } from '../../../domain';


export class UpdateProductUseCase {
    constructor(
        private readonly productRepository: ProductRepository,

    ) {}

    async execute(id: string, data: Partial<ProductEntity>): Promise<ProductEntity | null> {
       
        const product = await this.productRepository.update(id, data);
        return product;
    }
}
