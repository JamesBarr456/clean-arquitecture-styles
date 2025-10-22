import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { UpdateCustomerDto } from '../../dto/customer/update.customer.dto';
import { Validation } from '../../validators/validation';

export class UpdateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly validator: Validation<UpdateCustomerDto>
  ) {}

  async execute(userId: string, updateData: UpdateCustomerDto) {
    // Validar los datos de entrada
    const validatedData = this.validator.validate(updateData);
    
    if (!validatedData) {
      throw new Error('Invalid update data provided');
    }

    // Verificar que el customer existe
    const existingCustomer = await this.customerRepository.findByUserId(userId);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    // Actualizar el customer
    const updatedCustomer = await this.customerRepository.update(userId, validatedData);
    
    if (!updatedCustomer) {
      throw new Error('Failed to update customer');
    }

    return updatedCustomer;
  }
}