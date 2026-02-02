import { User, RegisterRequest } from '../types/index.js';
export declare class AuthService {
    private readonly JWT_SECRET;
    private readonly JWT_EXPIRES_IN;
    register(data: RegisterRequest): Promise<{
        token: string;
        user: Omit<User, 'password_hash'>;
    }>;
    login(username: string, password: string): Promise<{
        token: string;
        user: Omit<User, 'password_hash'>;
    }>;
    verifyToken(token: string): {
        id: string;
        username: string;
        role: string;
    };
    getUserById(id: string): Promise<Omit<User, 'password_hash'> | null>;
    hashPassword(password: string): Promise<string>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=authService.d.ts.map