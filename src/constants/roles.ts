export const ROLES = {
    USER: 'USER',
    CANTEEN_STAFF: 'CanteenStaff',
    MANAGER: 'MANAGER',
    ADMIN: 'ADMIN',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
    [ROLES.USER]: 'User',
    [ROLES.CANTEEN_STAFF]: 'Staff',
    [ROLES.MANAGER]: 'Manager',
    [ROLES.ADMIN]: 'Admin',
};
