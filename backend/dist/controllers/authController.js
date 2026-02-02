import authService from '../services/authService.js';
export class AuthController {
    async register(req, res) {
        try {
            console.log('📝 Register request received:', {
                body: req.body,
                headers: req.headers
            });
            const { username, email, password, phone, full_name } = req.body;
            if (!username || !email || !password) {
                console.log('❌ Validation failed: missing required fields');
                res.status(400).json({
                    error: {
                        message: 'Username, email and password are required',
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                console.log('❌ Validation failed: invalid email format');
                res.status(400).json({
                    error: {
                        message: 'Invalid email format',
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }
            // Validate password length
            if (password.length < 6) {
                console.log('❌ Validation failed: password too short');
                res.status(400).json({
                    error: {
                        message: 'Password must be at least 6 characters long',
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }
            console.log('✅ Validation passed, calling authService.register');
            const { token, user } = await authService.register({
                username,
                email,
                password,
                phone,
                full_name
            });
            console.log('✅ User registered successfully:', user.username);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
            res.status(201).json({ user, token });
        }
        catch (error) {
            console.error('❌ Error in register:', error);
            const err = error;
            if (err.message.includes('already exists')) {
                res.status(409).json({
                    error: {
                        message: err.message,
                        code: 'CONFLICT'
                    }
                });
                return;
            }
            res.status(500).json({
                error: {
                    message: err.message || 'Registration failed',
                    code: 'INTERNAL_ERROR'
                }
            });
        }
    }
    async login(req, res) {
        try {
            console.log('🔐 Login attempt:', {
                username: req.body.username,
                hasPassword: !!req.body.password
            });
            const { username, password } = req.body;
            if (!username || !password) {
                res.status(400).json({
                    error: {
                        message: 'Username and password are required',
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }
            const { token, user } = await authService.login(username, password);
            console.log('✅ Login successful:', user.username);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
            res.json({ user, token });
        }
        catch (error) {
            console.error('❌ Login failed:', error);
            const err = error;
            res.status(401).json({
                error: {
                    message: err.message || 'Login failed',
                    code: 'UNAUTHORIZED'
                }
            });
        }
    }
    async logout(_req, res) {
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    }
    async verify(req, res) {
        try {
            const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                res.status(401).json({
                    error: {
                        message: 'No token provided',
                        code: 'UNAUTHORIZED'
                    }
                });
                return;
            }
            const decoded = authService.verifyToken(token);
            // Get full user data from database
            const user = await authService.getUserById(decoded.id);
            if (!user) {
                res.status(401).json({
                    error: {
                        message: 'User not found',
                        code: 'UNAUTHORIZED'
                    }
                });
                return;
            }
            res.json({ valid: true, user });
        }
        catch (error) {
            res.status(401).json({
                error: {
                    message: 'Invalid token',
                    code: 'UNAUTHORIZED'
                }
            });
        }
    }
}
export default new AuthController();
