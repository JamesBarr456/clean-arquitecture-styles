import { Request, Response } from 'express';
import {
    createProductSchema,
    productFiltersSchema,
    updateProductSchema,
} from '../../application/dto/product';

import { MongoProductRepository } from '../../infraestructure/repositories/mongo.product.repository';

import { ZodAdapter } from '../../application/validators/zod.adapter';
import { CreateProductUseCase, DeleteProductUseCase, FindAllProductsUseCase, GetProductByIdUseCase, UpdateProductUseCase } from '../../application';



export class ProductController {
    private readonly productRepository = new MongoProductRepository();
    private readonly createProductUseCase = new CreateProductUseCase(this.productRepository);
    private readonly getProductByIdUseCase = new GetProductByIdUseCase(this.productRepository);
    private readonly deleteProductUseCase = new DeleteProductUseCase(this.productRepository);
    private readonly updateProductUseCase = new UpdateProductUseCase(this.productRepository);
    private readonly findAllProductsUseCase = new FindAllProductsUseCase(this.productRepository);
    
    public createProduct = async (req: Request, res: Response) => {
        const validator = new ZodAdapter(createProductSchema);
        const validated  = validator.validate(req.body);
       
        try {
            const products = await this.createProductUseCase.execute(validated);
            res.status(200).json({ message: 'Product created', payload: products });
        } catch (error: any) {
            res.status(404).json({ message: 'Product not found' });
        }
    };
    public getProductById = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const product = await this.getProductByIdUseCase.execute(id);
            res.status(200).json({ message: 'Product found', payload: product });
        } catch (error: any) {
            res.status(404).json({ message: 'Product not found' });
        }
    };

    public findProducts = async (req: Request, res: Response) => {
        const validator = new ZodAdapter(productFiltersSchema);
        const validated = validator.validate(req.query);
        try {
            const products = await this.findAllProductsUseCase.execute(validated);
            res.status(200).json({ message: 'Products found', payload: products });
        } catch (error: any) {
            res.status(404).json({ message: 'Products not found' });
        }
    };

    public updateProducts = async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = req.body;
        const validator = new ZodAdapter(updateProductSchema);
        const validated = validator.validate(data);
        try {
            const products = await this.updateProductUseCase.execute(id, validated);
            res.status(200).json({ message: 'Product updated', payload: products });
        } catch (error: any) {
            res.status(404).json({ message: 'Products not found' });
        }
    };

    public deleteProduct = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const product = await this.deleteProductUseCase.execute(id);
            res.status(200).json({ message: 'Product deleted', payload: product });
        } catch (error: any) {
            res.status(404).json({ message: 'Product not found' });
        }
    };
}
