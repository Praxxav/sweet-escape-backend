export declare function generateToken(userId: number, role: string): string;
export declare function verifyToken(token: string): {
    userId: number;
    role: string;
};
