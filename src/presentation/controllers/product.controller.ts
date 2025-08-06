import { Request, Response } from 'express';
import {
    createProductSchema,
    productFiltersSchema,
    updateProductSchema,
} from '../../application/dto/product';

import { MongoProductRepository } from '../../infraestructure/repositories/mongo.product.repository';
import { ProductEntity } from '../../domain/entities';
import { ZodAdapter } from '../../application/validators/zod.adapter';

export class ProductController {
    private readonly productRepository = new MongoProductRepository();
    private toEntity(product: any): ProductEntity {
        return new ProductEntity(
            product.sku,
            product.brand,
            product.name,
            product.size,
            product.genre,
            product.cost_price,
            product.sale_price,
            product.stock,
            product.has_discount,
            product.discount_percentage,
            product._id.toString(),
            product.description,
            product.category,
            product.image,
            product.is_active,
            product.created_at,
            product.updated_at
        );
    }
    public createProduct = async (req: Request, res: Response) => {
        const validator = new ZodAdapter(createProductSchema);
        const validated = validator.validate(req.body);
        const product = this.toEntity(validated);

        try {
            const products = await this.productRepository.create(product);
            res.status(200).json({ message: 'Product created', payload: products });
        } catch (error: any) {
            res.status(404).json({ message: 'Product not found' });
        }
    };
    public getProductById = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const product = await this.productRepository.findById(id);
            res.status(200).json({ message: 'Product found', payload: product });
        } catch (error: any) {
            res.status(404).json({ message: 'Product not found' });
        }
    };

    public findProducts = async (req: Request, res: Response) => {
        const validator = new ZodAdapter(productFiltersSchema);
        const validated = validator.validate(req.query);
        try {
            const products = await this.productRepository.findAll(validated);
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
            const products = await this.productRepository.update(id, validated);
            res.status(200).json({ message: 'Product updated', payload: products });
        } catch (error: any) {
            res.status(404).json({ message: 'Products not found' });
        }
    };

    public deleteProduct = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const product = await this.productRepository.delete(id);
            res.status(200).json({ message: 'Product deleted', payload: product });
        } catch (error: any) {
            res.status(404).json({ message: 'Product not found' });
        }
    };
}
