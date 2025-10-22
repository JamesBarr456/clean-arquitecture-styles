import { UserEntity } from '../user.entity';
import { UserRole, UserStatus } from '../../types/user.type';

describe('UserEntity', () => {
    describe('create factory method', () => {
        it('should create a user with required fields', () => {
            const userData = {
                email: 'test@example.com',
                password: 'hashedPassword123',
                first_name: 'John',
                last_name: 'Doe',
            };

            const user = UserEntity.create(userData);

            expect(user.email).toBe(userData.email);
            expect(user.password).toBe(userData.password);
            expect(user.first_name).toBe(userData.first_name);
            expect(user.last_name).toBe(userData.last_name);
            expect(user.user_id).toBeDefined();
            expect(user.created_at).toBeInstanceOf(Date);
            expect(user.updated_at).toBeInstanceOf(Date);
        });

        it('should create a user with default values when optional fields are not provided', () => {
            const userData = {
                email: 'test@example.com',
                password: 'hashedPassword123',
            };

            const user = UserEntity.create(userData);

            expect(user.first_name).toBe('');
            expect(user.last_name).toBe('');
            expect(user.dni).toBe('');
            expect(user.roles).toEqual(['customer']);
            expect(user.status).toBe('active');
            expect(user.phone).toEqual({ country_code: '', number: '' });
            expect(user.avatar).toBe('');
        });

        it('should create a user with custom roles and status', () => {
            const userData = {
                email: 'admin@example.com',
                password: 'hashedPassword123',
                roles: ['admin', 'seller'] as UserRole[],
                status: 'inactive' as UserStatus,
            };

            const user = UserEntity.create(userData);

            expect(user.roles).toEqual(['admin', 'seller']);
            expect(user.status).toBe('inactive');
        });

        it('should generate unique user_id for each user', () => {
            const userData = {
                email: 'test@example.com',
                password: 'hashedPassword123',
            };

            const user1 = UserEntity.create(userData);
            const user2 = UserEntity.create(userData);

            expect(user1.user_id).not.toBe(user2.user_id);
            expect(user1.user_id).toBeDefined();
            expect(user2.user_id).toBeDefined();
        });
    });

    describe('business methods', () => {
        let user: UserEntity;

        beforeEach(() => {
            user = UserEntity.create({
                email: 'test@example.com',
                password: 'hashedPassword123',
                first_name: 'John',
                last_name: 'Doe',
            });
        });

        it('should check if user has a specific role', () => {
            expect(user.hasRole('customer')).toBe(true);
            expect(user.hasRole('admin')).toBe(false);
        });

        it('should add a new role to user', () => {
            user.addRole('admin');

            expect(user.hasRole('admin')).toBe(true);
            expect(user.roles).toContain('admin');
            expect(user.updated_at).toBeInstanceOf(Date);
        });

        it('should not add duplicate roles', () => {
            const initialRolesLength = user.roles.length;
            user.addRole('customer'); // Already has this role

            expect(user.roles.length).toBe(initialRolesLength);
        });

        it('should remove a role from user', () => {
            user.addRole('admin');
            user.removeRole('admin');

            expect(user.hasRole('admin')).toBe(false);
            expect(user.roles).not.toContain('admin');
        });

        it('should get user full name', () => {
            expect(user.getFullName()).toBe('John Doe');
        });

        it('should update password and touch updated_at', () => {
            const oldUpdatedAt = user.updated_at;
            const newPassword = 'newHashedPassword';

            // Simular pasar un poco de tiempo
            setTimeout(() => {
                user.updatePassword(newPassword);

                expect(user.password).toBe(newPassword);
                expect(user.updated_at?.getTime()).toBeGreaterThan(oldUpdatedAt?.getTime() || 0);
            }, 1);
        });

        it('should get password', () => {
            expect(user.getPassword()).toBe('hashedPassword123');
        });
    });
});
