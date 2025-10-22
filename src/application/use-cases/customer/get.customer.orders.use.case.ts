import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { GetCustomerOrdersDto } from '../../dto/customer/get.customer.orders.dto';

export class GetCustomerOrdersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(dto: GetCustomerOrdersDto) {
    const result = await this.customerRepository.getOrders(dto);
    
    if (result.orders.length === 0) {
      return {
        orders: [],
        total: 0,
        page: dto.page,
        totalPages: 0,
        message: 'No orders found for this customer'
      };
    }

    return result;
  }
}