import * as admin from 'firebase-admin';
import * as serviceAccount from './autofin-rent-fbd70-firebase-adminsdk-fje9a-401ae7bb24.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const messaging = admin.messaging();