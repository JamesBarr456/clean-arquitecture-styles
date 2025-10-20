import { CashierPermissions, TodayStats } from "../types/cashier.types";
import { UserRole, UserStatus } from "../types/user.type";
import { UserEntity } from "./user.entity";

export class CustomerEntity extends UserEntity {
  constructor(
  
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    status: UserStatus,
    role: UserRole,
    dni?: string,
    phone?: { number: string; country_code: string },
    avatar?: string,
    created_at?: Date,
    updated_at?: Date,
    last_login?: Date,
    public is_on_duty: boolean = false,
    public performance_rating?: number,
    public permissions?: CashierPermissions,
    public current_register_id?: string,
    public current_shift_id?: string,
    public today_stats?: TodayStats,
    public last_logout_at?: Date
        
        

  ) {
    super(first_name, last_name, email, password, role = "cashier", status = "active", id, dni, phone, avatar, created_at, updated_at, last_login);
}

// Obtener nombre completo
    getFullName(): string {
        return `${this.first_name} ${this.last_name}`;
    }

    // Verificar si tiene un permiso específico
    hasPermission(permission: keyof CashierPermissions): boolean {
        return !!this.permissions?.[permission];
    }

    // Verificar si puede aplicar un descuento específico
    canApplyDiscount(percentage: number): boolean {
        if (!this.permissions?.canApplyDiscounts) return false;
        if (!this.permissions.maxDiscountPercentage) return true;
        return percentage <= this.permissions.maxDiscountPercentage;
    }

    // Abrir turno
    openShift(registerId: string, shiftId: string): void {
        if (this.is_on_duty) {
            throw new Error('El cajero ya tiene un turno abierto');
        }
        if (!this.hasPermission('canOpenRegister')) {
            throw new Error('El cajero no tiene permisos para abrir caja');
        }

        this.current_register_id = registerId;
        this.current_shift_id = shiftId;
        this.is_on_duty = true;
        this.updated_at = new Date();
    }

    // Cerrar turno
    closeShift(): void {
        if (!this.is_on_duty) {
            throw new Error('El cajero no tiene un turno abierto');
        }
        if (!this.hasPermission('canCloseRegister')) {
            throw new Error('El cajero no tiene permisos para cerrar caja');
        }

        this.current_register_id = undefined;
        this.current_shift_id = undefined;
        this.is_on_duty = false;
        this.last_logout_at = new Date();
        this.updated_at = new Date();
    }

    // Actualizar estadísticas del día
    updateTodayStats(stats: Partial<TodayStats>): void {
        this.today_stats = {
            ...this.today_stats,
            totalSales: stats.totalSales ?? this.today_stats?.totalSales ?? 0,
            totalAmount: stats.totalAmount ?? this.today_stats?.totalAmount ?? 0,
            averageTicket: stats.averageTicket ?? this.today_stats?.averageTicket ?? 0,
            transactionsCount: stats.transactionsCount ?? this.today_stats?.transactionsCount ?? 0
        };
        this.updated_at = new Date();
    }

    // Registrar venta
    registerSale(amount: number): void {
        if (!this.hasPermission('canProcessSales')) {
            throw new Error('El cajero no tiene permisos para procesar ventas');
        }

        const currentStats = this.today_stats || {
            totalSales: 0,
            totalAmount: 0,
            averageTicket: 0,
            transactionsCount: 0
        };

        const newTransactionCount = currentStats.transactionsCount + 1;
        const newTotalAmount = currentStats.totalAmount + amount;

        this.updateTodayStats({
            totalSales: currentStats.totalSales + 1,
            totalAmount: newTotalAmount,
            transactionsCount: newTransactionCount,
            averageTicket: newTotalAmount / newTransactionCount
        });
    }

    // Resetear estadísticas del día (para ejecutar al inicio de cada día)
    resetTodayStats(): void {
        this.today_stats = {
            totalSales: 0,
            totalAmount: 0,
            averageTicket: 0,
            transactionsCount: 0
        };
        this.updated_at = new Date();
    }


    // Actualizar permisos
    updatePermissions(permissions: Partial<CashierPermissions>): void {
        this.permissions = {
            ...this.permissions,
            ...permissions
        } as CashierPermissions;
        this.updated_at = new Date();
    }

   
    // Validar cajero
    validate(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!this.first_name?.trim()) {
            errors.push('El nombre es requerido');
        }

        if (!this.last_name?.trim()) {
            errors.push('El apellido es requerido');
        }

        if (!this.email?.includes('@')) {
            errors.push('Email válido es requerido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}