import {
    CustomerAddress,
    CustomerRiskProfile,
    CustomerStats,
    OrderSummary,
} from '../types/customer.types';




export class CustomerEntity {
    constructor(
        public orderHistory: OrderSummary[] = [],
        public stats: CustomerStats,
        public address: CustomerAddress,
        public risk_profile: CustomerRiskProfile, 
    ) {
       
    }

    public addOrder(order: OrderSummary): void {
        this.orderHistory.push(order);
        this.updateStats(order);
    }

    public getOrderById(orderId: string): OrderSummary | undefined {
        return this.orderHistory.find(order => order.orderId === orderId);
    }

    public getRecentOrders(limit: number = 5): OrderSummary[] {
        return [...this.orderHistory]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, limit);
    }

    private updateStats(newOrder: OrderSummary): void {
        this.stats.total_orders++;
        this.stats.last_order_date = newOrder.date;

        switch (newOrder.status) {
            case 'completed':
                this.stats.completed_orders++;
                this.stats.total_spent += newOrder.total;
                break;
            case 'canceled':
                this.stats.cancelled_orders++;
                break;
            case 'rejected':
                this.stats.rejected_orders++;
                break;
            case 'pending':
            case 'in_process':
            case 'delivered':
                this.stats.pending_orders++;
                break;
        }

        if (this.stats.completed_orders > 0) {
            this.stats.average_order_value = this.stats.total_spent / this.stats.completed_orders;
        }
    }

    public updateReliabilityScore(score: number): void {
        if (score < 0 || score > 100)
            throw new Error('Reliability score must be between 0 and 100');
        this.risk_profile.reliability_score = score;
    }

    public reportIncident(reason: string): void {
        this.risk_profile.has_issues = true;
        this.risk_profile.last_incident_date = new Date();
        this.risk_profile.block_reason = reason;
    }

    public clearIncidents(): void {
        this.risk_profile.has_issues = false;
        this.risk_profile.last_incident_date = undefined;
        this.risk_profile.block_reason = undefined;
    }

    public updateAddress(newAddress: CustomerAddress): void {
        this.address = {
            ...newAddress,
            is_default: this.address?.is_default || true,
        };
    }

    public getFormattedAddress(): string {
        const { street, locality, city, province, postal_code } = this.address;
        return `${street}, ${locality}, ${city}, ${province}${postal_code ? ` (${postal_code})` : ''}`;
    }

    public getCustomerValue(): 'high' | 'medium' | 'low' {
        const averageOrderValue = this.stats.average_order_value;
        if (averageOrderValue > 1000) return 'high';
        if (averageOrderValue > 500) return 'medium';
        return 'low';
    }

    public isReliableCustomer(): boolean {
        return this.risk_profile.reliability_score > 70 && !this.risk_profile.has_issues;
    }

    public static createCustomer(data: {
        orderHistory?: OrderSummary[],
        stats: CustomerStats,
        address: CustomerAddress,
        risk_profile: CustomerRiskProfile,
    }): CustomerEntity {
        return new CustomerEntity(
            data.orderHistory || [],
            data.stats,
            data.address,
            data.risk_profile
        );
    }
   
}