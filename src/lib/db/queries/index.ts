import { eq, desc, and, sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import {
  users,
  brands,
  brandContexts,
  productsServices,
  campaigns,
  chatConversations,
  chatMessages,
  professionalRequests,
} from '@/lib/db/schema';
import type { brandContextSectionEnum, requestStatusEnum } from '@/lib/db/schema';

// ── Users ───────────────────────────────────────────────────────────

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user ?? null;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user ?? null;
}

export async function updateUserProfile(
  id: string,
  data: Partial<Pick<typeof users.$inferInsert, 'firstName' | 'lastName' | 'avatarUrl' | 'preferences'>>,
) {
  const [updated] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return updated;
}

// ── Brands ───────────────────────────────────────────────────────────

export async function getBrandsByUserId(userId: string) {
  return db.select().from(brands).where(eq(brands.userId, userId)).orderBy(desc(brands.createdAt));
}

export async function getBrandById(id: string) {
  const [brand] = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
  return brand ?? null;
}

export async function createBrand(data: typeof brands.$inferInsert) {
  const [brand] = await db.insert(brands).values(data).returning();
  return brand;
}

export async function updateBrand(
  id: string,
  data: Partial<Pick<typeof brands.$inferInsert, 'name' | 'onboardingStatus' | 'completionPercentage' | 'onboardingType'>>,
) {
  const [updated] = await db
    .update(brands)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(brands.id, id))
    .returning();
  return updated;
}

// ── Brand Contexts ───────────────────────────────────────────────────

export async function getAllBrandContexts(brandId: string) {
  return db.select().from(brandContexts).where(eq(brandContexts.brandId, brandId));
}

export async function getBrandContext(brandId: string, section: typeof brandContextSectionEnum.enumValues[number]) {
  const [ctx] = await db
    .select()
    .from(brandContexts)
    .where(and(eq(brandContexts.brandId, brandId), eq(brandContexts.section, section)))
    .limit(1);
  return ctx ?? null;
}

export async function upsertBrandContext(
  brandId: string,
  section: typeof brandContextSectionEnum.enumValues[number],
  dataJson: Record<string, unknown>,
) {
  const existing = await getBrandContext(brandId, section);

  if (existing) {
    const [updated] = await db
      .update(brandContexts)
      .set({ dataJson, updatedAt: new Date() })
      .where(eq(brandContexts.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(brandContexts)
    .values({ brandId, section, dataJson })
    .returning();
  return created;
}

// ── Products & Services ────────────────────────────────────────────

export async function getProductsServicesByBrandId(brandId: string) {
  return db.select().from(productsServices).where(eq(productsServices.brandId, brandId));
}

export async function insertProductService(data: typeof productsServices.$inferInsert) {
  const [item] = await db.insert(productsServices).values(data).returning();
  return item;
}

export async function deleteProductsServicesByBrandId(brandId: string) {
  return db.delete(productsServices).where(eq(productsServices.brandId, brandId));
}

// ── Campaigns ───────────────────────────────────────────────────────

export async function getCampaignsByUserId(userId: string) {
  const userBrands = await getBrandsByUserId(userId);
  if (userBrands.length === 0) return [];

  const brandIds = userBrands.map((b) => b.id);

  return db
    .select({
      campaign: campaigns,
      brandName: brands.name,
    })
    .from(campaigns)
    .innerJoin(brands, eq(campaigns.brandId, brands.id))
    .where(sql`${campaigns.brandId} IN ${brandIds}`)
    .orderBy(desc(campaigns.createdAt));
}

export async function getCampaignById(id: string) {
  const [row] = await db
    .select({
      campaign: campaigns,
      brandName: brands.name,
    })
    .from(campaigns)
    .innerJoin(brands, eq(campaigns.brandId, brands.id))
    .where(eq(campaigns.id, id))
    .limit(1);
  return row ?? null;
}

export async function createCampaign(data: typeof campaigns.$inferInsert) {
  const [campaign] = await db.insert(campaigns).values(data).returning();
  return campaign;
}

export async function updateCampaign(
  id: string,
  data: Partial<Pick<typeof campaigns.$inferInsert, 'title' | 'status' | 'generatedPlan'>>,
) {
  const [updated] = await db
    .update(campaigns)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(campaigns.id, id))
    .returning();
  return updated;
}

// ── Chat ────────────────────────────────────────────────────────────

export async function getRecentConversations(userId: string, limit = 10) {
  return db
    .select()
    .from(chatConversations)
    .where(eq(chatConversations.userId, userId))
    .orderBy(desc(chatConversations.updatedAt))
    .limit(limit);
}

export async function getConversationMessages(conversationId: string) {
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.conversationId, conversationId))
    .orderBy(chatMessages.createdAt);
}

export async function createConversation(data: typeof chatConversations.$inferInsert) {
  const [conv] = await db.insert(chatConversations).values(data).returning();
  return conv;
}

export async function createMessage(data: typeof chatMessages.$inferInsert) {
  const [msg] = await db.insert(chatMessages).values(data).returning();
  return msg;
}

// ── Professional Requests ───────────────────────────────────────────

export async function getRequestsByUserId(userId: string) {
  const userBrands = await getBrandsByUserId(userId);
  if (userBrands.length === 0) return [];

  const brandIds = userBrands.map((b) => b.id);

  return db
    .select({
      request: professionalRequests,
      brandName: brands.name,
    })
    .from(professionalRequests)
    .innerJoin(brands, eq(professionalRequests.brandId, brands.id))
    .where(sql`${professionalRequests.brandId} IN ${brandIds}`)
    .orderBy(desc(professionalRequests.createdAt));
}

export async function createRequest(data: typeof professionalRequests.$inferInsert) {
  const [req] = await db.insert(professionalRequests).values(data).returning();
  return req;
}

export async function updateRequestStatus(id: string, status: typeof requestStatusEnum.enumValues[number]) {
  const [updated] = await db
    .update(professionalRequests)
    .set({ status, updatedAt: new Date() })
    .where(eq(professionalRequests.id, id))
    .returning();
  return updated;
}
