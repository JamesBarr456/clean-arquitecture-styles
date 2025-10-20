

export type ShiftStatus = 'open' | 'closed' | 'reconciled';

export interface CashierPermissions {
  canOpenRegister: boolean;
  canCloseRegister: boolean;
  canProcessSales: boolean;
  canProcessReturns: boolean;
  canAddExpenses: boolean;
  canAddIncome: boolean;
  canViewReports: boolean;
  canEditProducts: boolean;
  canViewAllSales: boolean;
  canApplyDiscounts: boolean;
  maxDiscountPercentage?: number;
}

export interface TodayStats {
  totalSales: number;
  totalAmount: number;
  averageTicket: number;
  transactionsCount: number;
}

