import { IUser } from '../models/User';
declare const userRepository: {
    findAll(): Promise<IUser[]>;
    findById(id: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    create(userData: {
        username: string;
        password_hash: string;
        email: string;
        phone?: string;
        full_name?: string;
        role?: "admin" | "customer";
    }): Promise<IUser>;
    updateLastLogin(id: string): Promise<IUser | null>;
    delete(id: string): Promise<boolean>;
};
export default userRepository;
//# sourceMappingURL=userRepository.d.ts.map