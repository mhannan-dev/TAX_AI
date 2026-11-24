import type { Organization } from './domain';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type ToastTone = 'success' | 'error';

export interface ToastFlash {
    message: string;
    tone: ToastTone;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    organization: Organization | null;
    approvalsCount: number;
};
