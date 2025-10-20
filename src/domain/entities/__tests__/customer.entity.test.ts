import { CustomerEntity } from "../customer.entity";
import { UserStatus, UserRole } from "../../types/user.type";


describe('CustomerEntity', () => {
  it('debería crear una instancia correctamente', () => {
    const customer = new CustomerEntity(
      '1', // id
      'Juan', // first_name
      'Pérez', // last_name
      'juan.perez@email.com', // email
      'password123', // password
      'active' as UserStatus, // status
      'customer' as UserRole, // role
      '12345678', // dni
      { number: '123456789', country_code: '+54' }, // phone
      'avatar.png', // avatar
      new Date('2023-01-01'), // created_at
      new Date('2023-01-02'), // updated_at
      new Date('2023-01-03'), // last_login
      ['order1', 'order2'], // orderHistory
      2, // cancelledOrders
      1, // rejectedOrders
      150.5, // totalSpent
      [
        { address: 'Calle Falsa 123', locality: 'Springfield', isDefault: true },
        { address: 'Av. Siempre Viva 742', locality: 'Springfield' }
      ] // savedAddresses
    );
    expect(customer.first_name).toBe('Juan');
    expect(customer.last_name).toBe('Pérez');
    expect(customer.email).toBe('juan.perez@email.com');
    expect(customer.role).toBe('customer');
    expect(customer.status).toBe('active');
    expect(customer.dni).toBe('12345678');
    expect(customer.phone).toEqual({ number: '123456789', country_code: '+54' });
    expect(customer.id).toBe('1');
    expect(customer.avatar).toBe('avatar.png');
    expect(customer.created_at).toEqual(new Date('2023-01-01'));
    expect(customer.updated_at).toEqual(new Date('2023-01-02'));
    expect(customer.last_login).toEqual(new Date('2023-01-03'));
    expect(customer.orderHistory).toEqual(['order1', 'order2']);
    expect(customer.cancelledOrders).toBe(2);
    expect(customer.rejectedOrders).toBe(1);
    expect(customer.totalSpent).toBe(150.5);
    expect(customer.savedAddresses).toEqual([
      { address: 'Calle Falsa 123', locality: 'Springfield', isDefault: true },
      { address: 'Av. Siempre Viva 742', locality: 'Springfield' }
    ]);
  });
});
