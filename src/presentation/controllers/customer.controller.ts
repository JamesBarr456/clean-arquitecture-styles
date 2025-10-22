import { Request, Response } from 'express';
import { ZodAdapter } from '../../application/validators/zod.adapter';
import { CustomerRepository } from '../../domain/repositories/customer.repository';

// Importaciones directas por ahora
import { GetCustomerProfileUseCase } from '../../application/use-cases/customer/get.customer.profile.use.case';
import { GetCustomerOrdersUseCase } from '../../application/use-cases/customer/get.customer.orders.use.case';
import { GetCustomerStatsUseCase } from '../../application/use-cases/customer/get.customer.stats.use.case';
import { UpdateCustomerUseCase } from '../../application/use-cases/customer/update.customer.use.case';

import { getCustomerProfileSchema } from '../../application/dto/customer/get.customer.profile.dto';
import { getCustomerOrdersSchema, GetCustomerOrdersDto } from '../../application/dto/customer/get.customer.orders.dto';
import { getCustomerStatsSchema, GetCustomerStatsDto } from '../../application/dto/customer/get.customer.stats.dto';
import { updateCustomerSchema } from '../../application/dto/customer/update.customer.dto';

// Extender Request type para incluir user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
  };
}

export class CustomerController {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public getCustomerProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
        return;
      }

      const validator = new ZodAdapter(getCustomerProfileSchema);
      const validatedData = validator.validate({ userId });

      const useCase = new GetCustomerProfileUseCase(this.customerRepository);
      const customerProfile = await useCase.execute(validatedData);

      res.status(200).json({
        success: true,
        data: customerProfile,
        message: 'Customer profile retrieved successfully'
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Customer profile not found'
      });
    }
  };

  public getCustomerOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
        return;
      }

      const validator = new ZodAdapter(getCustomerOrdersSchema);
      const validatedData = validator.validate({ 
        userId, 
        ...req.query 
      });

      const useCase = new GetCustomerOrdersUseCase(this.customerRepository);
      const orders = await useCase.execute(validatedData as GetCustomerOrdersDto);

      res.status(200).json({
        success: true,
        data: orders,
        message: 'Customer orders retrieved successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve orders'
      });
    }
  };

  public getCustomerStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
        return;
      }

      const validator = new ZodAdapter(getCustomerStatsSchema);
      const validatedData = validator.validate({ 
        userId, 
        ...req.query 
      });

      const useCase = new GetCustomerStatsUseCase(this.customerRepository);
      const stats = await useCase.execute(validatedData as GetCustomerStatsDto);

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Customer statistics retrieved successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve statistics'
      });
    }
  };

  public updateCustomerProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
        return;
      }

      const validator = new ZodAdapter(updateCustomerSchema);
      const updateUseCase = new UpdateCustomerUseCase(
        this.customerRepository,
        validator
      );

      const updatedCustomer = await updateUseCase.execute(userId, req.body);

      res.status(200).json({
        success: true,
        data: updatedCustomer,
        message: 'Customer profile updated successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update customer profile'
      });
    }
  };
}