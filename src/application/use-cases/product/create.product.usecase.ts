import { ProductRepository } from "../../../domain";
import { ProductEntity } from "../../../domain/entities";
import { CreateProductDTO } from "../../dto/product";


export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(data: CreateProductDTO): Promise<ProductEntity> {
    const product = await this.productRepository.create(data);
    return product;
  }
}