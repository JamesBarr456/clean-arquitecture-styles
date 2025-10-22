import { OrderStatus } from './order.types';

export interface CustomerStats {
    total_orders: number;
    completed_orders: number;
    cancelled_orders: number;
    rejected_orders: number;
    total_spent: number;
    average_order_value: number;
    last_order_date?: Date;
    pending_orders: number; // ← Pedidos actuales en proceso
}

export interface CustomerRiskProfile {
    reliability_score: number; // 0-100
    has_issues: boolean;
    last_incident_date?: Date;
    block_reason?: string;
}

export interface CustomerAddress {
    street: string;
    number: string;
    apartment?: string;
    locality: string;
    city: string;
    province: string;
    postal_code?: string;
    is_default?: boolean;
    references?: string;
}

export interface OrderSummary {
    orderId: string;
    date: Date;
    total: number;
    status: OrderStatus;
}
