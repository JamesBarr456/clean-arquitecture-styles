import { CreateProductDTO } from '../../dto/product';
import { ProductEntity } from '../../../domain/entities';
import { ProductRepository } from '../../../domain';


export class CreateProductUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
    ) {}
    async execute(data: CreateProductDTO): Promise<ProductEntity> {
        const product = await this.productRepository.create(data);
        return product;
    }
}
