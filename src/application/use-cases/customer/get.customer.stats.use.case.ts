import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { GetCustomerStatsDto } from '../../dto/customer/get.customer.stats.dto';

export class GetCustomerStatsUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(dto: GetCustomerStatsDto) {
    const stats = await this.customerRepository.getStats(dto);
    
    if (!stats) {
      throw new Error('Customer statistics not found');
    }

    return {
      userId: dto.userId,
      period: dto.period,
      stats,
      generatedAt: new Date().toISOString()
    };
  }
}