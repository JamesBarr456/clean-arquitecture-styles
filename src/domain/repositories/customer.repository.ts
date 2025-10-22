import { CustomerEntity } from '../entities/customer.entity';
import { GetCustomerOrdersDto, GetCustomerStatsDto, UpdateCustomerDto } from '../../application/dto/customer';

export abstract class CustomerRepository {
  abstract findByUserId(userId: string): Promise<CustomerEntity | null>;
  abstract save(customer: CustomerEntity): Promise<CustomerEntity>;
  abstract update(userId: string, updateData: UpdateCustomerDto): Promise<CustomerEntity | null>;
  abstract getOrders(params: GetCustomerOrdersDto): Promise<{
    orders: any[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  abstract getStats(params: GetCustomerStatsDto): Promise<any>;
  abstract delete(userId: string): Promise<boolean>;
}