import { CreateProductDTO } from '../../dto/product';
import { ProductEntity } from '../../../domain/entities';
import { ProductRepository } from '../../../domain';
import { Validation } from '../../validators/validation';

export class CreateProductUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly validator: Validation<CreateProductDTO>
    ) {}

    async execute(data: CreateProductDTO): Promise<ProductEntity> {
        const validated = this.validator.validate(data);
        const product = await this.productRepository.create(validated);
        return product;
    }
}
