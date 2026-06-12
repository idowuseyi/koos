import {
  boolean,
  customType,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const citext = customType<{ data: string }>({
  dataType() {
    return "citext";
  },
});

export const providerEnum = pgEnum("provider", ["email", "google"]);

export const onboardingTypeEnum = pgEnum("onboarding_type", [
  "manual",
  "document",
]);

export const onboardingStatusEnum = pgEnum("onboarding_status", [
  "draft",
  "in_progress",
  "completed",
]);

export const brandContextSectionEnum = pgEnum("brand_context_section", [
  "account_info",
  "business_overview",
  "audience",
  "brand_foundation",
  "products_services",
  "campaign_setup",
  "social_media",
  "review",
]);

export const productServiceTypeEnum = pgEnum("product_service_type", [
  "product",
  "service",
]);

export const campaignTypeEnum = pgEnum("campaign_type", [
  "product_campaign",
  "service_campaign",
]);

export const campaignDurationEnum = pgEnum("campaign_duration", [
  "7",
  "14",
  "30",
  "60",
  "90",
]);

export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "generated",
  "exported",
]);

export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
]);

export const requestStatusEnum = pgEnum("request_status", [
  "open",
  "in_progress",
  "resolved",
  "closed",
]);

export const assetTypeEnum = pgEnum("asset_type", [
  "logo",
  "image",
  "document",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: citext("email").notNull().unique(),
  passwordHash: text("password_hash"),
  provider: providerEnum("provider").notNull().default("email"),
  avatarUrl: text("avatar_url"),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  onboardingType: onboardingTypeEnum("onboarding_type")
    .notNull()
    .default("manual"),
  onboardingStatus: onboardingStatusEnum("onboarding_status")
    .notNull()
    .default("draft"),
  completionPercentage: integer("completion_percentage").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const brandContexts = pgTable("brand_contexts", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  section: brandContextSectionEnum("section").notNull(),
  dataJson: jsonb("data_json").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productsServices = pgTable("products_services", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  type: productServiceTypeEnum("type").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price"),
  benefits: text("benefits").array(),
  faqs: jsonb("faqs"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const offers = pgTable("offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  priceRange: text("price_range"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  type: campaignTypeEnum("type").notNull(),
  duration: campaignDurationEnum("duration").notNull(),
  generatedPlan: jsonb("generated_plan"),
  title: text("title"),
  status: campaignStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => chatConversations.id, { onDelete: "cascade" }),
  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const professionalRequests = pgTable("professional_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: requestStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const brandAssets = pgTable("brand_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  assetType: assetTypeEnum("asset_type").notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
