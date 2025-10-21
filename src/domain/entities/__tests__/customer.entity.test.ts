import {
    CustomerAddress,
    CustomerRiskProfile,
    CustomerStats,
    OrderSummary,
} from '../../types/customer.types';
import { UserRole, UserStatus } from '../../types/user.type';

import { CustomerEntity } from '../customer.entity';

describe('CustomerEntity', () => {
    let customer: CustomerEntity;

    beforeEach(() => {
        const stats: CustomerStats = {
            total_orders: 0,
            completed_orders: 0,
            cancelled_orders: 0,
            rejected_orders: 0,
            total_spent: 0,
            average_order_value: 0,
            pending_orders: 0,
        };

        const address: CustomerAddress = {
            street: 'Calle Falsa 123',
            locality: 'Springfield',
            city: 'Capital',
            province: 'Buenos Aires',
            postal_code: '1234',
            is_default: true,
        };

        const riskProfile: CustomerRiskProfile = {
            reliability_score: 80,
            has_issues: false,
        };

        customer = new CustomerEntity(
            '1', // id
            'Juan', // first_name
            'Pérez', // last_name
            'juan.perez@email.com', // email
            'password123', // password
            'active' as UserStatus, // status
            ['customer'] as UserRole[], // roles
            [], // orderHistory
            stats,
            address,
            riskProfile,
            '12345678', // dni
            { number: '123456789', country_code: '+54' }, // phone
            'avatar.png', // avatar
            new Date('2023-01-01'), // created_at
            new Date('2023-01-02'), // updated_at
            new Date('2023-01-03') // last_login
        );
    });

    describe('Creación de instancia', () => {
        it('debería crear una instancia correctamente', () => {
            expect(customer.first_name).toBe('Juan');
            expect(customer.last_name).toBe('Pérez');
            expect(customer.email).toBe('juan.perez@email.com');
            expect(customer.roles).toEqual(['customer']);
            expect(customer.status).toBe('active');
            expect(customer.orderHistory).toEqual([]);
        });
    });

    describe('Gestión de órdenes', () => {
        const mockOrder: OrderSummary = {
            orderId: '123',
            date: new Date(),
            total: 100,
            status: 'completed',
        };

        it('debería agregar una orden correctamente', () => {
            customer.addOrder(mockOrder);
            expect(customer.orderHistory.length).toBe(1);
            expect(customer.orderHistory[0]).toEqual(mockOrder);
        });

        it('debería obtener una orden por ID', () => {
            customer.addOrder(mockOrder);
            const foundOrder = customer.getOrderById('123');
            expect(foundOrder).toEqual(mockOrder);
        });

        it('debería obtener órdenes recientes', () => {
            const order1 = { ...mockOrder, orderId: '1', date: new Date('2023-01-01') };
            const order2 = { ...mockOrder, orderId: '2', date: new Date('2023-01-02') };
            customer.addOrder(order1);
            customer.addOrder(order2);

            const recentOrders = customer.getRecentOrders(1);
            expect(recentOrders.length).toBe(1);
            expect(recentOrders[0].orderId).toBe('2');
        });
    });

    describe('Gestión de estadísticas', () => {
        it('debería actualizar estadísticas al agregar órdenes', () => {
            const completedOrder: OrderSummary = {
                orderId: '1',
                date: new Date(),
                total: 100,
                status: 'completed',
            };

            customer.addOrder(completedOrder);
            expect(customer.stats.completed_orders).toBe(1);
            expect(customer.stats.total_spent).toBe(100);
            expect(customer.stats.average_order_value).toBe(100);
        });
    });

    describe('Gestión del perfil de riesgo', () => {
        it('debería actualizar el score de confiabilidad', () => {
            customer.updateReliabilityScore(90);
            expect(customer.risk_profile.reliability_score).toBe(90);
        });

        it('debería lanzar error al establecer score inválido', () => {
            expect(() => customer.updateReliabilityScore(101)).toThrow();
        });

        it('debería reportar y limpiar incidentes', () => {
            customer.reportIncident('Pago rechazado');
            expect(customer.risk_profile.has_issues).toBe(true);
            expect(customer.risk_profile.block_reason).toBe('Pago rechazado');

            customer.clearIncidents();
            expect(customer.risk_profile.has_issues).toBe(false);
            expect(customer.risk_profile.block_reason).toBeUndefined();
        });
    });

    describe('Gestión de dirección', () => {
        it('debería actualizar la dirección', () => {
            const newAddress: CustomerAddress = {
                street: 'Nueva Calle 456',
                locality: 'Nueva Localidad',
                city: 'Nueva Ciudad',
                province: 'Nueva Provincia',
                postal_code: '5678',
            };

            customer.updateAddress(newAddress);
            expect(customer.address.street).toBe('Nueva Calle 456');
            expect(customer.address.is_default).toBe(true);
        });

        it('debería formatear la dirección correctamente', () => {
            const formattedAddress = customer.getFormattedAddress();
            expect(formattedAddress).toBe(
                'Calle Falsa 123, Springfield, Capital, Buenos Aires (1234)'
            );
        });
    });

    describe('Análisis del cliente', () => {
        it('debería calcular el valor del cliente correctamente', () => {
            const highValueOrder: OrderSummary = {
                orderId: '1',
                date: new Date(),
                total: 1500,
                status: 'completed',
            };

            customer.addOrder(highValueOrder);
            expect(customer.getCustomerValue()).toBe('high');
        });

        it('debería determinar si el cliente es confiable', () => {
            expect(customer.isReliableCustomer()).toBe(true);

            customer.reportIncident('Problema');
            expect(customer.isReliableCustomer()).toBe(false);
        });
    });
});
