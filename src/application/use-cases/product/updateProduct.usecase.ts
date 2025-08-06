import { ProductEntity } from '../../../domain/entities';
import { ProductRepository } from '../../../domain';
import { UpdateProductdDTO } from '../../dto/product';
import { Validation } from '../../validators/validation';

export class UpdateProductUseCase {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly validator: Validation<UpdateProductdDTO>
    ) {}

    async execute(id: string, data: Partial<ProductEntity>): Promise<ProductEntity | null> {
        const validated = this.validator.validate(data);
        const product = await this.productRepository.update(id, validated);
        return product;
    }
}
