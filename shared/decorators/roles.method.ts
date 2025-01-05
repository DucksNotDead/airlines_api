import { TRole } from '../types';
import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../const';

export const Roles = (...roles: TRole[]) => SetMetadata(ROLES_KEY, roles);