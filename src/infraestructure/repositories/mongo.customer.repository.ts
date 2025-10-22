import { CustomerEntity } from '../../domain/entities/customer.entity';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { GetCustomerOrdersDto, GetCustomerStatsDto, UpdateCustomerDto } from '../../application/dto/customer';
import { CustomerModel } from '../database/mongo/models/customer.model';

export class MongoCustomerRepository extends CustomerRepository {
  
  private toEntity(customerDoc: any): CustomerEntity {
    // Crear el CustomerEntity siguiendo el orden del constructor
    return CustomerEntity.createCustomer({
      orderHistory: customerDoc.orderHistory,
      stats: customerDoc.stats,
      address: customerDoc.address,
      risk_profile: customerDoc.risk_profile,
  
    });
  }

  async findByUserId(userId: string): Promise<CustomerEntity | null> {
    try {
      const customer = await CustomerModel
        .findOne({ user_id: userId })
        .populate('user_id')
        .exec();
      
      if (!customer) return null;
      return this.toEntity(customer);
    } catch (error) {
      throw new Error(`Error finding customer: ${error}`);
    }
  }

  async save(customer: CustomerEntity): Promise<CustomerEntity> {
    try {
      const customerData = {
        user_id: (customer as any).id, // Acceso temporal al id
        orderHistory: customer.orderHistory,
        stats: customer.stats,
        address: customer.address,
        risk_profile: customer.risk_profile
      };

      const newCustomer = new CustomerModel(customerData);
      const saved = await newCustomer.save();
      
      // Populate para obtener datos del usuario
      const populated = await CustomerModel
        .findById(saved._id)
        .populate('user_id')
        .exec();
      
      return this.toEntity(populated);
    } catch (error) {
      throw new Error(`Error saving customer: ${error}`);
    }
  }

  async update(userId: string, updateData: UpdateCustomerDto): Promise<CustomerEntity | null> {
    try {
      const updateFields: any = {};
      
      if (updateData.address) {
        updateFields.address = updateData.address;
      }
      
      if (updateData.risk_profile) {
        updateFields.risk_profile = updateData.risk_profile;
      }

      const updated = await CustomerModel
        .findOneAndUpdate(
          { user_id: userId },
          { $set: updateFields },
          { new: true }
        )
        .populate('user_id')
        .exec();

      if (!updated) return null;
      return this.toEntity(updated);
    } catch (error) {
      throw new Error(`Error updating customer: ${error}`);
    }
  }

  async getOrders(params: GetCustomerOrdersDto): Promise<{
    orders: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const customer = await CustomerModel
        .findOne({ user_id: params.userId })
        .exec();

      if (!customer) {
        return {
          orders: [],
          total: 0,
          page: params.page,
          totalPages: 0
        };
      }

      let filteredOrders = [...customer.orderHistory];

      // Filtrar por status si se proporciona
      if (params.status) {
        filteredOrders = filteredOrders.filter(order => order.status === params.status);
      }

      // Filtrar por rango de fechas
      if (params.startDate) {
        const startDate = new Date(params.startDate);
        filteredOrders = filteredOrders.filter(order => order.date >= startDate);
      }

      if (params.endDate) {
        const endDate = new Date(params.endDate);
        filteredOrders = filteredOrders.filter(order => order.date <= endDate);
      }

      // Ordenar por fecha (más recientes primero)
      filteredOrders.sort((a, b) => b.date.getTime() - a.date.getTime());

      // Paginación
      const total = filteredOrders.length;
      const totalPages = Math.ceil(total / params.limit);
      const startIndex = (params.page - 1) * params.limit;
      const endIndex = startIndex + params.limit;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

      return {
        orders: paginatedOrders,
        total,
        page: params.page,
        totalPages
      };
    } catch (error) {
      throw new Error(`Error getting customer orders: ${error}`);
    }
  }

  async getStats(params: GetCustomerStatsDto): Promise<any> {
    try {
      const customer = await CustomerModel
        .findOne({ user_id: params.userId })
        .exec();

      if (!customer) {
        throw new Error('Customer not found');
      }

      const baseStats = customer.stats;
      let filteredStats = { ...baseStats };

      // Filtrar estadísticas por período si no es 'all'
      if (params.period !== 'all') {
        const now = new Date();
        let startDate: Date;

        switch (params.period) {
          case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'quarterly':
            const quarter = Math.floor(now.getMonth() / 3);
            startDate = new Date(now.getFullYear(), quarter * 3, 1);
            break;
          case 'yearly':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(0); // Desde el inicio de los tiempos
        }

        // Filtrar órdenes por período y recalcular estadísticas
        const periodOrders = customer.orderHistory.filter(order => order.date >= startDate);
        
        filteredStats = {
          total_orders: periodOrders.length,
          completed_orders: periodOrders.filter(o => o.status === 'completed').length,
          cancelled_orders: periodOrders.filter(o => o.status === 'canceled').length,
          rejected_orders: periodOrders.filter(o => o.status === 'rejected').length,
          pending_orders: periodOrders.filter(o => ['pending', 'in_process', 'delivered'].includes(o.status)).length,
          total_spent: periodOrders
            .filter(o => o.status === 'completed')
            .reduce((sum, order) => sum + order.total, 0),
          average_order_value: 0,
          last_order_date: periodOrders.length > 0 
            ? periodOrders.sort((a, b) => b.date.getTime() - a.date.getTime())[0].date
            : undefined
        };

        if (filteredStats.completed_orders > 0) {
          filteredStats.average_order_value = filteredStats.total_spent / filteredStats.completed_orders;
        }
      }

      return {
        period: params.period,
        stats: filteredStats,
        customer_value: this.calculateCustomerValue(filteredStats.average_order_value),
        reliability_score: customer.risk_profile.reliability_score,
        has_issues: customer.risk_profile.has_issues
      };
    } catch (error) {
      throw new Error(`Error getting customer stats: ${error}`);
    }
  }

  async delete(userId: string): Promise<boolean> {
    try {
      const result = await CustomerModel.findOneAndDelete({ user_id: userId });
      return result !== null;
    } catch (error) {
      throw new Error(`Error deleting customer: ${error}`);
    }
  }

  private calculateCustomerValue(averageOrderValue: number): 'high' | 'medium' | 'low' {
    if (averageOrderValue > 1000) return 'high';
    if (averageOrderValue > 500) return 'medium';
    return 'low';
  }
}