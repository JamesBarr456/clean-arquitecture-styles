import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { GetCustomerProfileDto } from '../../dto/customer/get.customer.profile.dto';
import { CustomerEntity } from '../../../domain/entities/customer.entity';

export class GetCustomerProfileUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(dto: GetCustomerProfileDto): Promise<CustomerEntity | null> {
    const customer = await this.customerRepository.findByUserId(dto.userId);
    
    if (!customer) {
      throw new Error('Customer profile not found');
    }

    return customer;
  }
}