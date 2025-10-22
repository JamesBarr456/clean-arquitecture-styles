import { Schema, model } from 'mongoose';
import { CustomerStats, CustomerRiskProfile, CustomerAddress, OrderSummary } from '../../../../domain/types/customer.types';

const OrderSummarySchema = new Schema<OrderSummary>({
  orderId: { type: String, required: true },
  date: { type: Date, required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in_process', 'delivered', 'completed', 'canceled', 'rejected'],
    required: true 
  }
});

const CustomerStatsSchema = new Schema<CustomerStats>({
  total_orders: { type: Number, default: 0 },
  completed_orders: { type: Number, default: 0 },
  cancelled_orders: { type: Number, default: 0 },
  rejected_orders: { type: Number, default: 0 },
  total_spent: { type: Number, default: 0 },
  average_order_value: { type: Number, default: 0 },
  last_order_date: { type: Date },
  pending_orders: { type: Number, default: 0 }
});

const CustomerRiskProfileSchema = new Schema<CustomerRiskProfile>({
  reliability_score: { type: Number, required: true, min: 0, max: 100 },
  has_issues: { type: Boolean, default: false },
  last_incident_date: { type: Date },
  block_reason: { type: String }
});

const CustomerAddressSchema = new Schema<CustomerAddress>({
  street: { type: String, required: true },
  locality: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postal_code: { type: String },
  is_default: { type: Boolean, default: true }
});

const CustomerSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  orderHistory: { type: [OrderSummarySchema], default: [] },
  stats: { type: CustomerStatsSchema, required: true },
  address: { type: CustomerAddressSchema, required: true },
  risk_profile: { type: CustomerRiskProfileSchema, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Middleware para actualizar updated_at
CustomerSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

CustomerSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: new Date() });
  next();
});

export const CustomerModel = model('Customer', CustomerSchema);