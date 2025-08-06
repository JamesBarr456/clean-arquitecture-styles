import { ProductEntity } from '../../../domain/entities';
import { ProductFilterOptionsDTO } from '../../dto/product';
import { ProductRepository } from '../../../domain';

export class FindAllProductsUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    async execute(options: ProductFilterOptionsDTO): Promise<ProductEntity[]> {
        const products = await this.productRepository.findAll(options);
        return products;
    }
}
