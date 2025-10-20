import { UserRole, UserStatus } from "../types/user.type";
import { UserEntity} from "./user.entity";


export class CustomerEntity extends UserEntity {
  constructor(
  
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    status:UserStatus,
    role: UserRole,
     dni?: string,
    phone?:  { number: string; country_code: string },
    avatar?: string,
    created_at?: Date,
    updated_at?: Date,
    last_login?: Date,
    public orderHistory: string[] = [],
    public cancelledOrders: number = 0,
    public rejectedOrders: number = 0,
    public totalSpent: number = 0,
    public savedAddresses: Array<{
      address: string;
      locality: string;
      isDefault?: boolean;
    }> = [],
   
  ) {
    super(first_name, last_name, email, password, role = "customer", status = "active" , id, dni, phone, avatar, created_at, updated_at, last_login);
  }
}