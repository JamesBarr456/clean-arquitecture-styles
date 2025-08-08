import {
    CreateProduct,
    DeleteProduct,
    FindAllProducts,
    GetProduct,
    UpdateProduct,
} from '../../application';
import { Request, Response } from 'express';
import { ZodAdapter, ZodValidationError } from '../../application/validators/zod.adapter';
import {
    createProductSchema,
    productFiltersSchema,
    updateProductSchema,
} from '../../application/dto/product';

import { CustomError, ProductRepository } from '../../domain';

export class ProductController {
    constructor(private readonly productRepository: ProductRepository) {}

    public createProduct = async (req: Request, res: Response) => {
        try {
            const validator = new ZodAdapter(createProductSchema);
            const validated = validator.validate(req.body);

            const product = await new CreateProduct(this.productRepository).execute(validated);

            res.status(201).json({ message: 'Product created', payload: product });
        } catch (error: any) {
             if (error instanceof ZodValidationError) {
                const customError = CustomError.badRequest('Validation failed');
                res.status(customError.statusCode).json({
                    message: customError.message,
                    errors: error.issues,
                });
            }
            const customError = error instanceof CustomError
                ? error
                : CustomError.internalServer(error.message);
            res.status(customError.statusCode).json({
                message: customError.message,
                error: error.message,
            });
        }
    };

    public getProductById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const product = await new GetProduct(this.productRepository).execute(id);

            res.status(200).json({ message: 'Product found', payload: product });
        } catch (error: any) {
            const customError = error instanceof CustomError
                ? error
                : CustomError.internalServer(error.message);
            res.status(customError.statusCode).json({
                message: customError.message,
                error: error.message,
            });
        }
    };

    public findProducts = async (req: Request, res: Response) => {
        try {
            const validator = new ZodAdapter(productFiltersSchema);
            const validated = validator.validate(req.query);

            const products = await new FindAllProducts(this.productRepository).execute(validated);

            res.status(200).json({ message: 'Products found', payload: products });
        } catch (error: any) {
             const customError = error instanceof CustomError
                ? error
                : CustomError.notFound(error.message);
            res.status(customError.statusCode).json({
                message: customError.message,
                error: error.message,
            });
        }
    };

    public updateProducts = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const validator = new ZodAdapter(updateProductSchema);
            const validated = validator.validate(data);

            const product = await new UpdateProduct(this.productRepository).execute(id, validated);

             if (!product) {
                throw CustomError.notFound('Product not found');
            }
            res.status(200).json({ message: 'Product updated', payload: product });
        } catch (error: any) {
             const customError = error instanceof CustomError
                ? error
                : CustomError.internalServer(error.message);
            res.status(customError.statusCode).json({
                message: customError.message,
                error: error.message,
            });
        }
    };

    public deleteProduct = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const deleted = await new DeleteProduct(this.productRepository).execute(id);
            if (!deleted) {
                throw CustomError.notFound('Product not found');
            }
            res.status(200).json({ message: 'Product deleted' });
        } catch (error: any) {
            const customError = error instanceof CustomError
                ? error
                : CustomError.internalServer(error.message);
            res.status(customError.statusCode).json({
                message: customError.message,
                error: error.message,
            });
        }
    };
}
