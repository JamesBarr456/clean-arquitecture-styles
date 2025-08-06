import {
    CreateProduct,
    DeleteProduct,
    FindAllProducts,
    GetProduct,
    UpdateProduct,
} from '../../application';
import { Request, Response } from 'express';
import {
    createProductSchema,
    productFiltersSchema,
    updateProductSchema,
} from '../../application/dto/product';

import { ProductRepository } from '../../domain';
import { ZodAdapter } from '../../application/validators/zod.adapter';

export class ProductController {
    constructor(private readonly productRepository: ProductRepository) {}

    public createProduct = (req: Request, res: Response) => {
        const validator = new ZodAdapter(createProductSchema);
        const validated = validator.validate(req.body);

        new CreateProduct(this.productRepository)
            .execute(validated)
            .then(product => {
                res.status(201).json({ message: 'Product created', payload: product });
            })
            .catch((error: any) => {
                res.status(400).json({ message: 'Error creating product', error: error.message });
            });
    };

    public getProductById = (req: Request, res: Response) => {
        const { id } = req.params;

        new GetProduct(this.productRepository)
            .execute(id)
            .then(product => {
                if (!product) {
                    res.status(404).json({ message: 'Product not found' });
                }
                res.status(200).json({ message: 'Product found', payload: product });
            })
            .catch((error: any) => {
                res.status(500).json({ message: 'Error retrieving product', error: error.message });
            });
    };

    public findProducts = (req: Request, res: Response) => {
        const validator = new ZodAdapter(productFiltersSchema);
        const validated = validator.validate(req.query);

        new FindAllProducts(this.productRepository)
            .execute(validated)
            .then(products => {
                res.status(200).json({ message: 'Products found', payload: products });
            })
            .catch((error: any) => {
                res.status(404).json({ message: 'Products not found', error: error.message });
            });
    };

    public updateProducts = (req: Request, res: Response) => {
        const { id } = req.params;
        const data = req.body;
        const validator = new ZodAdapter(updateProductSchema);
        const validated = validator.validate(data);

        new UpdateProduct(this.productRepository)
            .execute(id, validated)
            .then(product => {
                if (!product) {
                    res.status(404).json({ message: 'Product not found' });
                }
                res.status(200).json({ message: 'Product updated', payload: product });
            })
            .catch((error: any) => {
                res.status(500).json({ message: 'Error updating product', error: error.message });
            });
    };

    public deleteProduct = (req: Request, res: Response) => {
        const { id } = req.params;

        new DeleteProduct(this.productRepository)
            .execute(id)
            .then(deleted => {
                if (!deleted) {
                    res.status(404).json({ message: 'Product not found' });
                }
                res.status(200).json({ message: 'Product deleted' });
            })
            .catch((error: any) => {
                res.status(500).json({ message: 'Error deleting product', error: error.message });
            });
    };
}
