import { Home, Admin1, Admin2, Admin3, Admin4, Admin5, Admin6 } from '../components/admin';
import { Client3, Client3Preview, Client3Signature, Client4 } from '../components/client';

export default [
  { path: '/admin/1', handler: Admin1 },
  { path: '/admin/2', handler: Admin2 },
  { path: '/admin/3', handler: Admin3 },
  { path: '/admin/4', handler: Admin4 },
  { path: '/admin/5', handler: Admin5 },
  { path: '/admin/6', handler: Admin6 },
  { path: '/talent', handler: Client3 },
  { path: '/talent/preview', handler: Client3Preview },
  { path: '/talent/signature', handler: Client3Signature },
  { path: '/talent/4', handler: Client4 },
  { path: '/admin', handler: Home }
];
