import { CashierPermissions, TodayStats } from '../../types/cashier.types';
import { UserRole, UserStatus } from '../../types/user.type';

import { CashierEntity } from '../cashier.entity';

describe('CashierEntity', () => {
    const baseProps = {
        id: '1',
        first_name: 'Ana',
        last_name: 'García',
        email: 'ana.garcia@email.com',
        password: 'securepass',
        status: 'active' as UserStatus,
        roles: ['customer', 'cashier'] as UserRole[],
        dni: '87654321',
        phone: { number: '987654321', country_code: '+34' },
        avatar: 'avatar2.png',
        created_at: new Date('2023-10-01'),
        updated_at: new Date('2023-10-15'),
        last_login: new Date('2023-10-20'),
        is_on_duty: true,
        performance_rating: 4.8,
        permissions: {
            canOpenRegister: true,
            canCloseRegister: true,
            canProcessSales: true,
            canApplyDiscounts: true,
            maxDiscountPercentage: 10,
        } as CashierPermissions,
        current_register_id: 'reg-001',
        current_shift_id: 'shift-001',
        today_stats: {
            totalSales: 5,
            totalAmount: 1000,
            averageTicket: 200,
            transactionsCount: 5,
        } as TodayStats,
        last_logout_at: new Date('2023-10-19'),
    };

    it('debería crear una instancia correctamente', () => {
        const cashier = new CashierEntity(
            baseProps.id,
            baseProps.first_name,
            baseProps.last_name,
            baseProps.email,
            baseProps.password,
            baseProps.status,
            baseProps.roles,
            baseProps.dni,
            baseProps.phone,
            baseProps.avatar,
            baseProps.created_at,
            baseProps.updated_at,
            baseProps.last_login,
            baseProps.is_on_duty,
            baseProps.performance_rating,
            baseProps.permissions,
            baseProps.current_register_id,
            baseProps.current_shift_id,
            baseProps.today_stats,
            baseProps.last_logout_at
        );
        expect(cashier.first_name).toBe('Ana');
        expect(cashier.last_name).toBe('García');
        expect(cashier.email).toBe('ana.garcia@email.com');
        expect(cashier.roles).toEqual(['customer', 'cashier']);
        expect(cashier.status).toBe('active');
        expect(cashier.is_on_duty).toBe(true);
        expect(cashier.performance_rating).toBe(4.8);
        expect(cashier.permissions?.canOpenRegister).toBe(true);
        expect(cashier.current_register_id).toBe('reg-001');
        expect(cashier.current_shift_id).toBe('shift-001');
        expect(cashier.today_stats?.totalSales).toBe(5);
        expect(cashier.last_logout_at).toEqual(new Date('2023-10-19'));
    });

    it('debería retornar el nombre completo', () => {
        const cashier = new CashierEntity(
            baseProps.id,
            baseProps.first_name,
            baseProps.last_name,
            baseProps.email,
            baseProps.password,
            baseProps.status,
            baseProps.roles
        );
        expect(cashier.getFullName()).toBe('Ana García');
    });

    it('debería validar correctamente los datos', () => {
        const cashier = new CashierEntity(
            baseProps.id,
            '', // nombre vacío
            '', // apellido vacío
            'noemail', // email inválido
            baseProps.password,
            baseProps.status,
            baseProps.roles
        );
        const result = cashier.validate();
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('El nombre es requerido');
        expect(result.errors).toContain('El apellido es requerido');
        expect(result.errors).toContain('Email válido es requerido');
    });
});
