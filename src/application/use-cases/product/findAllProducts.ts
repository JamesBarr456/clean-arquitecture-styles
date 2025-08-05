import { ProductRepository } from "../../../domain";
import { ProductEntity } from "../../../domain/entities";


export class FindAllProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(data: CreateProductDTO): Promise<ProductEntity> {
    const product = await this.productRepository.create(data);
    return product;
  }
}