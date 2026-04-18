export type User = {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string | null;
    admin: boolean;
    rol?: 'cliente' | 'funcionario' | 'admin';
    confirmado: boolean;
    avatar?: string;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
    isAdmin: boolean;
    isFuncionario: boolean;
    rol: 'cliente' | 'funcionario' | 'admin';
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
