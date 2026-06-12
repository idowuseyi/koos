'use server';

import { getAuthUser } from '@/lib/auth/get-user';
import { getRequestsByUserId, getBrandsByUserId, createRequest } from '@/lib/db/queries';

export async function getRequestsAction() {
  const { dbUser } = await getAuthUser();
  if (!dbUser) throw new Error('Not authenticated');

  return getRequestsByUserId(dbUser.id);
}

export async function getUserBrandsAction() {
  const { dbUser } = await getAuthUser();
  if (!dbUser) throw new Error('Not authenticated');

  return getBrandsByUserId(dbUser.id);
}

export async function createRequestAction(data: {
  brandId: string;
  subject: string;
  message: string;
}) {
  const { dbUser } = await getAuthUser();
  if (!dbUser) throw new Error('Not authenticated');

  return createRequest({
    brandId: data.brandId,
    userId: dbUser.id,
    contactName: `${dbUser.firstName} ${dbUser.lastName}`,
    contactEmail: dbUser.email,
    subject: data.subject,
    message: data.message,
  });
}
