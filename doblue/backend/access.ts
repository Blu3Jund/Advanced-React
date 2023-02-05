// Access control returns yes or no value depending on the users session

import { ListAccessArgs } from './types';
import { permissionsList } from './schemas/fields';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check if someone meets a criteria.
export const permissions = {
  ...generatedPermissions,
};

// Rule based function
// Rules can return a boolean or a filter which limits which products they can CRUD
export const rules = {
  canManageProducts({ session }): ListAccessArgs {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Does the user have permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. if not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canOrder({ session }): ListAccessArgs {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Does the user have permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. if not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }): ListAccessArgs {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Does the user have permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. if not, do they own this item?
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true; // User can read everything
    }
    // User should only see available products (based on status field)
    return { status: 'AVAILABLE' };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // Otherwise the user may update themselves!
    return { id: session.itemId };
  },
};
