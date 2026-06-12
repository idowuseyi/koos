"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createBrandDraft,
  saveBrandProgress,
  submitBrandOnboarding,
} from "@/app/(dashboard)/brands/new/actions";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  [key: string]: string;
}

const STEP_ICONS: Record<number, string> = {
  1: "person",
  2: "business",
  3: "group",
  4: "diamond",
  5: "palette",
  6: "inventory_2",
  7: "campaign",
  8: "task_alt",
};

const STEP_TITLES: Record<number, string> = {
  1: "Account Information",
  2: "Business Overview",
  3: "Target Audience",
  4: "Brand Foundation",
  5: "Brand Personality",
  6: "Products & Services",
  7: "Campaign Setup",
  8: "Review & Submit",
};

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<FormData>({});
  const [products, setProducts] = useState<
    { name: string; type: string; price: string; benefits: string }[]
  >([{ name: "", type: "", price: "", benefits: "" }]);
  const [services, setServices] = useState<
    { name: string; type: string; price: string; benefits: string }[]
  >([{ name: "", type: "", price: "", benefits: "" }]);
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);

  const totalSteps = 8;
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  const updateField = useCallback((key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    },
    [],
  );

  const isStepComplete = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return !!(
            formData.contactName &&
            formData.companyName &&
            formData.companyEmail
          );
        case 2:
          return !!(formData.businessSummary && formData.businessType);
        case 3:
          return !!formData.primaryAudience;
        case 4:
          return !!(
            formData.brandPositioning &&
            formData.missionStatement
          );
        case 5:
          return !!formData.brandVoiceDescription;
        case 6:
          return products.some((p) => p.name) || services.some((s) => s.name);
        case 7:
          return !!(
            formData.campaignObjective &&
            formData.targetGoals
          );
        case 8:
          return true;
        default:
          return false;
      }
    },
    [formData, products, services],
  );

  const getCompletedSteps = useCallback((): number[] => {
    const completed: number[] = [];
    for (let i = 1; i < currentStep; i++) {
      if (isStepComplete(i)) {
        completed.push(i);
      }
    }
    return completed;
  }, [currentStep, isStepComplete]);

  const addProduct = useCallback(() => {
    setProducts((prev) => [
      ...prev,
      { name: "", type: "", price: "", benefits: "" },
    ]);
  }, []);

  const removeProduct = useCallback(
    (index: number) => {
      setProducts((prev) => prev.filter((_, i) => i !== index));
    },
    [],
  );

  const updateProduct = useCallback(
    (index: number, field: string, value: string) => {
      setProducts((prev) =>
        prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
      );
    },
    [],
  );

  const addService = useCallback(() => {
    setServices((prev) => [
      ...prev,
      { name: "", type: "", price: "", benefits: "" },
    ]);
  }, []);

  const removeService = useCallback(
    (index: number) => {
      setServices((prev) => prev.filter((_, i) => i !== index));
    },
    [],
  );

  const updateService = useCallback(
    (index: number, field: string, value: string) => {
      setServices((prev) =>
        prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
      );
    },
    [],
  );

  const getSectionData = useCallback(
    (step: number): { section: "account_info" | "business_overview" | "audience" | "brand_foundation" | "products_services" | "campaign_setup" | "social_media" | "review"; dataJson: Record<string, unknown> } | null => {
      switch (step) {
        case 1:
          return {
            section: "account_info",
            dataJson: {
              contactName: formData.contactName,
              companyName: formData.companyName,
              companyEmail: formData.companyEmail,
              companyPhone: formData.companyPhone,
              companyWebsite: formData.companyWebsite,
            },
          };
        case 2:
          return {
            section: "business_overview",
            dataJson: {
              businessSummary: formData.businessSummary,
              businessType: formData.businessType,
              industry: formData.industry,
              competitors: formData.competitors,
              uniqueValue: formData.uniqueValue,
            },
          };
        case 3:
          return {
            section: "audience",
            dataJson: {
              primaryAudience: formData.primaryAudience,
              secondaryAudience: formData.secondaryAudience,
              audienceAge: formData.audienceAge,
              audienceLocation: formData.audienceLocation,
              audienceInterests: formData.audienceInterests,
            },
          };
        case 4:
          return {
            section: "brand_foundation",
            dataJson: {
              brandPositioning: formData.brandPositioning,
              missionStatement: formData.missionStatement,
              visionStatement: formData.visionStatement,
              coreValues: formData.coreValues,
            },
          };
        case 5:
          return {
            section: "brand_foundation",
            dataJson: {
              brandVoiceDescription: formData.brandVoiceDescription,
              toneFormal: formData.toneFormal,
              toneFriendly: formData.toneFriendly,
              toneBold: formData.toneBold,
              tonePlayful: formData.tonePlayful,
            },
          };
        case 6:
          return {
            section: "products_services",
            dataJson: {
              products: products.filter((p) => p.name),
              services: services.filter((s) => s.name),
            },
          };
        case 7:
          return {
            section: "campaign_setup",
            dataJson: {
              campaignObjective: formData.campaignObjective,
              targetGoals: formData.targetGoals,
              campaignDuration: formData.campaignDuration,
              budgetRange: formData.budgetRange,
            },
          };
        default:
          return null;
      }
    },
    [formData, products, services],
  );

  const ensureBrand = useCallback(async () => {
    if (brandId) return brandId;
    const name =
      formData.companyName || formData.brandName || "New Brand";
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const brand = await createBrandDraft(user.id, name);
    setBrandId(brand.id);
    return brand.id;
  }, [brandId, formData.companyName, formData.brandName]);

  const handleSaveProgress = useCallback(() => {
    startTransition(async () => {
      const id = await ensureBrand();
      const sectionData = getSectionData(currentStep);
      if (sectionData) {
        await saveBrandProgress(id, {
          section: sectionData.section,
          dataJson: sectionData.dataJson,
          completionPercentage: Math.round(
            ((getCompletedSteps().length) / totalSteps) * 100,
          ),
        });
      }
    });
  }, [currentStep, ensureBrand, getSectionData, getCompletedSteps]);

  const handleSubmit = useCallback(() => {
    startTransition(async () => {
      const id = await ensureBrand();
      const allSections = [1, 2, 3, 4, 5, 6, 7]
        .map((s) => getSectionData(s))
        .filter((s): s is NonNullable<typeof s> => s !== null);

      const allProducts = products
        .filter((p) => p.name)
        .map((p) => ({
          type: "product" as const,
          name: p.name,
          description: p.benefits || undefined,
          price: p.price || undefined,
          benefits: p.benefits ? [p.benefits] : undefined,
        }));

      const allServices = services
        .filter((s) => s.name)
        .map((s) => ({
          type: "service" as const,
          name: s.name,
          description: s.benefits || undefined,
          price: s.price || undefined,
          benefits: s.benefits ? [s.benefits] : undefined,
        }));

      await submitBrandOnboarding(id, {
        sections: allSections,
        products: allProducts,
        services: allServices,
      });

      router.push(`/brands/${id}`);
    });
  }, [ensureBrand, getSectionData, products, services, router]);

  function renderStep1() {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-primary text-2xl">
              person
            </span>
            <h3 className="font-heading text-lg font-semibold text-on-surface">
              Account Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">
                Contact Name <span className="text-error">*</span>
              </label>
              <Input
                placeholder="John Doe"
                value={formData.contactName || ""}
                onChange={(e) => updateField("contactName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">
                Company Name <span className="text-error">*</span>
              </label>
              <Input
                placeholder="Acme Inc."
                value={formData.companyName || ""}
                onChange={(e) => updateField("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">
                Company Email <span className="text-error">*</span>
              </label>
              <Input
                type="email"
                placeholder="contact@acme.com"
                value={formData.companyEmail || ""}
                onChange={(e) => updateField("companyEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">
                Phone
              </label>
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-primary text-2xl">
              business
            </span>
            <h3 className="font-heading text-lg font-semibold text-on-surface">
              Business Overview
            </h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Business Summary <span className="text-error">*</span>
            </label>
            <Textarea
              placeholder="Describe your business, what it does, and its value proposition..."
              rows={4}
              value={formData.businessSummary || ""}
              onChange={(e) => updateField("businessSummary", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">
                Business Type <span className="text-error">*</span>
              </label>
              <Select
                value={formData.businessType || ""}
                onValueChange={(val) => updateField("businessType", val ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B2B">B2B</SelectItem>
                  <SelectItem value="B2C">B2C</SelectItem>
                  <SelectItem value="D2C">D2C</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">
                Business Stage
              </label>
              <Select
                value={formData.businessStage || ""}
                onValueChange={(val) => updateField("businessStage", val ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Startup">Startup</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Key Offers
            </label>
            <Input
              placeholder="e.g., SaaS Platform, Consulting, Training"
              value={formData.keyOffers || ""}
              onChange={(e) => updateField("keyOffers", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-primary text-2xl">
              group
            </span>
            <h3 className="font-heading text-lg font-semibold text-on-surface">
              Target Audience
            </h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Primary Audience <span className="text-error">*</span>
            </label>
            <Textarea
              placeholder="Describe your ideal customer demographics, psychographics, behaviors..."
              rows={4}
              value={formData.primaryAudience || ""}
              onChange={(e) => updateField("primaryAudience", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Pain Points
            </label>
            <Textarea
              placeholder="What problems does your audience face that your brand solves?"
              rows={3}
              value={formData.painPoints || ""}
              onChange={(e) => updateField("painPoints", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Customer Language
            </label>
            <Input
              placeholder="Words, phrases, or terminology your customers use"
              value={formData.customerLanguage || ""}
              onChange={(e) => updateField("customerLanguage", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Secondary Audiences
            </label>
            <Input
              placeholder="Other audience segments you serve"
              value={formData.secondaryAudiences || ""}
              onChange={(e) =>
                updateField("secondaryAudiences", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    );
  }

  function renderStep4() {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-primary text-2xl">
              diamond
            </span>
            <h3 className="font-heading text-lg font-semibold text-on-surface">
              Brand Foundation
            </h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Brand Positioning <span className="text-error">*</span>
            </label>
            <Textarea
              placeholder="How does your brand stand out in the market?"
              rows={3}
              value={formData.brandPositioning || ""}
              onChange={(e) => updateField("brandPositioning", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Mission Statement <span className="text-error">*</span>
            </label>
            <Textarea
              placeholder="Why does your brand exist? What purpose does it serve?"
              rows={3}
              value={formData.missionStatement || ""}
              onChange={(e) => updateField("missionStatement", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Vision Statement
            </label>
            <Textarea
              placeholder="Where is your brand headed? What future are you building toward?"
              rows={3}
              value={formData.visionStatement || ""}
              onChange={(e) => updateField("visionStatement", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Core Values
            </label>
            <Input
              placeholder="e.g., Innovation, Integrity, Customer-First"
              value={formData.coreValues || ""}
              onChange={(e) => updateField("coreValues", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  function renderStep5() {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-primary text-2xl">
              palette
            </span>
            <h3 className="font-heading text-lg font-semibold text-on-surface">
              Brand Personality
            </h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-on-surface-variant">
                  Professional
                </label>
                <span className="text-xs text-on-surface-variant">
                  {formData.sliderProfessional || "50"}%
                </span>
                <label className="text-sm font-medium text-on-surface-variant">
                  Playful
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.sliderProfessional || "50"}
                onChange={(e) =>
                  updateField("sliderProfessional", e.target.value)
                }
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #138BC8 ${
                    Number(formData.sliderProfessional || 50)
                  }%, var(--surface-container-high) ${
                    Number(formData.sliderProfessional || 50)
                  }%)`,
                }}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-on-surface-variant">
                  Minimalist
                </label>
                <span className="text-xs text-on-surface-variant">
                  {formData.sliderMinimalist || "50"}%
                </span>
                <label className="text-sm font-medium text-on-surface-variant">
                  Bold
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.sliderMinimalist || "50"}
                onChange={(e) =>
                  updateField("sliderMinimalist", e.target.value)
                }
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #138BC8 ${
                    Number(formData.sliderMinimalist || 50)
                  }%, var(--surface-container-high) ${
                    Number(formData.sliderMinimalist || 50)
                  }%)`,
                }}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-on-surface-variant">
                  Accessible
                </label>
                <span className="text-xs text-on-surface-variant">
                  {formData.sliderAccessible || "50"}%
                </span>
                <label className="text-sm font-medium text-on-surface-variant">
                  Premium
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.sliderAccessible || "50"}
                onChange={(e) =>
                  updateField("sliderAccessible", e.target.value)
                }
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #138BC8 ${
                    Number(formData.sliderAccessible || 50)
                  }%, var(--surface-container-high) ${
                    Number(formData.sliderAccessible || 50)
                  }%)`,
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Brand Voice Description <span className="text-error">*</span>
            </label>
            <Textarea
              placeholder="Describe how your brand communicates — tone, style, formality level..."
              rows={3}
              value={formData.brandVoiceDescription || ""}
              onChange={(e) =>
                updateField("brandVoiceDescription", e.target.value)
              }
            />
          </div>
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setShowAiSuggestion(!showAiSuggestion)}
            >
              <span className="material-symbols-outlined text-sm">
                auto_awesome
              </span>
              {showAiSuggestion
                ? "Hide AI Suggestion"
                : "Generate AI Suggestion"}
            </Button>
            {showAiSuggestion && (
              <div className="glass-panel-strong p-4 space-y-2 animate-pulse-glow">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-sm">
                    smart_toy
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    AI Suggestion
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Based on your inputs, we recommend a brand voice that is
                  confident yet approachable. Use active voice, keep sentences
                  concise, and maintain a warm professional tone. Address
                  customers directly with &ldquo;you&rdquo; and avoid jargon
                  unless your audience expects it.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderStep6() {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-outline-variant pb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">
                inventory_2
              </span>
              <h3 className="font-heading text-lg font-semibold text-on-surface">
                Products & Services
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
                Products
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-primary"
                onClick={addProduct}
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Product
              </Button>
            </div>
            {products.map((product, index) => (
              <div
                key={`product-${index}`}
                className="glass-panel-strong p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Product {index + 1}
                  </span>
                  {products.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-error"
                      onClick={() => removeProduct(index)}
                    >
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant">
                      Name
                    </label>
                    <Input
                      placeholder="Product name"
                      value={product.name}
                      onChange={(e) =>
                        updateProduct(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant">
                      Type
                    </label>
                    <Select
                      value={product.type}
                      onValueChange={(val) =>
                        updateProduct(index, "type", val ?? "")
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Physical">Physical</SelectItem>
                        <SelectItem value="Digital">Digital</SelectItem>
                        <SelectItem value="Subscription">
                          Subscription
                        </SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant">
                      Price
                    </label>
                    <Input
                      placeholder="$0.00"
                      value={product.price}
                      onChange={(e) =>
                        updateProduct(index, "price", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant">
                    Benefits
                  </label>
                  <Textarea
                    placeholder="Key benefits and features..."
                    rows={2}
                    value={product.benefits}
                    onChange={(e) =>
                      updateProduct(index, "benefits", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-outline-variant pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
                Services
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-primary"
                onClick={addService}
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Service
              </Button>
            </div>
            {services.map((service, index) => (
              <div
                key={`service-${index}`}
                className="glass-panel-strong p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Service {index + 1}
                  </span>
                  {services.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-error"
                      onClick={() => removeService(index)}
                    >
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant">
                      Name
                    </label>
                    <Input
                      placeholder="Service name"
                      value={service.name}
                      onChange={(e) =>
                        updateService(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant">
                      Type
                    </label>
                    <Select
                      value={service.type}
                      onValueChange={(val) =>
                        updateService(index, "type", val ?? "")
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Coaching">Coaching</SelectItem>
                        <SelectItem value="Agency">Agency</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant">
                      Price
                    </label>
                    <Input
                      placeholder="$0.00"
                      value={service.price}
                      onChange={(e) =>
                        updateService(index, "price", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant">
                    Benefits
                  </label>
                  <Textarea
                    placeholder="Key benefits and deliverables..."
                    rows={2}
                    value={service.benefits}
                    onChange={(e) =>
                      updateService(index, "benefits", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderStep7() {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-primary text-2xl">
              campaign
            </span>
            <h3 className="font-heading text-lg font-semibold text-on-surface">
              Campaign Setup
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">
                Campaign Objective <span className="text-error">*</span>
              </label>
              <Select
                value={formData.campaignObjective || ""}
                onValueChange={(val) => updateField("campaignObjective", val ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brand Awareness">
                    Brand Awareness
                  </SelectItem>
                  <SelectItem value="Lead Generation">
                    Lead Generation
                  </SelectItem>
                  <SelectItem value="Sales Conversion">
                    Sales Conversion
                  </SelectItem>
                  <SelectItem value="Customer Retention">
                    Customer Retention
                  </SelectItem>
                  <SelectItem value="Product Launch">
                    Product Launch
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">
                Campaign Timeline
              </label>
              <Select
                value={formData.campaignTimeline || ""}
                onValueChange={(val) => updateField("campaignTimeline", val ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Target Goals <span className="text-error">*</span>
            </label>
            <Input
              placeholder="e.g., 1000 sign-ups, 50% brand recall increase"
              value={formData.targetGoals || ""}
              onChange={(e) => updateField("targetGoals", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Success Metrics
            </label>
            <Input
              placeholder="e.g., CTR, conversion rate, ROAS, NPS"
              value={formData.successMetrics || ""}
              onChange={(e) => updateField("successMetrics", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Key Messaging
            </label>
            <Textarea
              placeholder="Core messages and value propositions for this campaign..."
              rows={3}
              value={formData.keyMessaging || ""}
              onChange={(e) => updateField("keyMessaging", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Call to Action
            </label>
            <Input
              placeholder="e.g., Sign Up Now, Get Started, Learn More"
              value={formData.callToAction || ""}
              onChange={(e) => updateField("callToAction", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  function renderStep8() {
    const sections = [
      {
        step: 1,
        title: "Account Information",
        fields: [
          { label: "Contact Name", value: formData.contactName },
          { label: "Company Name", value: formData.companyName },
          { label: "Company Email", value: formData.companyEmail },
          { label: "Phone", value: formData.phone },
        ],
      },
      {
        step: 2,
        title: "Business Overview",
        fields: [
          { label: "Business Summary", value: formData.businessSummary },
          { label: "Business Type", value: formData.businessType },
          { label: "Business Stage", value: formData.businessStage },
          { label: "Key Offers", value: formData.keyOffers },
        ],
      },
      {
        step: 3,
        title: "Target Audience",
        fields: [
          { label: "Primary Audience", value: formData.primaryAudience },
          { label: "Pain Points", value: formData.painPoints },
          { label: "Customer Language", value: formData.customerLanguage },
          { label: "Secondary Audiences", value: formData.secondaryAudiences },
        ],
      },
      {
        step: 4,
        title: "Brand Foundation",
        fields: [
          { label: "Brand Positioning", value: formData.brandPositioning },
          { label: "Mission Statement", value: formData.missionStatement },
          { label: "Vision Statement", value: formData.visionStatement },
          { label: "Core Values", value: formData.coreValues },
        ],
      },
      {
        step: 5,
        title: "Brand Personality",
        fields: [
          {
            label: "Professional/Playful",
            value: `${formData.sliderProfessional || "50"}%`,
          },
          {
            label: "Minimalist/Bold",
            value: `${formData.sliderMinimalist || "50"}%`,
          },
          {
            label: "Accessible/Premium",
            value: `${formData.sliderAccessible || "50"}%`,
          },
          {
            label: "Brand Voice Description",
            value: formData.brandVoiceDescription,
          },
        ],
      },
      {
        step: 6,
        title: "Products & Services",
        fields: [
          {
            label: "Products",
            value: products
              .filter((p) => p.name)
              .map((p) => `${p.name} (${p.type}, ${p.price})`)
              .join(", "),
          },
          {
            label: "Services",
            value: services
              .filter((s) => s.name)
              .map((s) => `${s.name} (${s.type}, ${s.price})`)
              .join(", "),
          },
        ],
      },
      {
        step: 7,
        title: "Campaign Setup",
        fields: [
          { label: "Campaign Objective", value: formData.campaignObjective },
          { label: "Target Goals", value: formData.targetGoals },
          { label: "Success Metrics", value: formData.successMetrics },
          {
            label: "Campaign Timeline",
            value: formData.campaignTimeline
              ? `${formData.campaignTimeline} days`
              : "",
          },
          { label: "Key Messaging", value: formData.keyMessaging },
          { label: "Call to Action", value: formData.callToAction },
        ],
      },
    ];

    return (
      <div className="space-y-4">
        <div className="glass-panel p-6 space-y-1">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-primary text-2xl">
              task_alt
            </span>
            <h3 className="font-heading text-lg font-semibold text-on-surface">
              Review & Submit
            </h3>
          </div>
          <p className="text-sm text-on-surface-variant pb-4">
            Review all the information you have entered. Click &ldquo;Edit&rdquo;
            on any section to make changes before submitting.
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.step} className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">
                  {STEP_ICONS[section.step]}
                </span>
                <h4 className="font-heading text-sm font-semibold text-on-surface">
                  {section.title}
                </h4>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="gap-1 text-primary"
                onClick={() => goToStep(section.step)}
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {section.fields.map((field) => (
                <div key={field.label} className="space-y-0.5">
                  <span className="text-xs text-on-surface-variant">
                    {field.label}
                  </span>
                  <p className="text-sm text-on-surface truncate">
                    {field.value || (
                      <span className="italic text-on-surface-variant/50">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderCurrentStep() {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      case 7:
        return renderStep7();
      case 8:
        return renderStep8();
      default:
        return renderStep1();
    }
  }

  const completedSteps = getCompletedSteps();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">
              auto_awesome
            </span>
            <span className="status-pill bg-primary/20 text-primary">
              Onboarding Wizard
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-on-surface md:text-5xl">
            Let&apos;s build your brand.
          </h1>
          <p className="text-on-surface-variant">
            Complete each section to create your brand knowledge base.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-primary font-medium">
                {progressPercent}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {renderCurrentStep()}

            <div className="mt-8 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                disabled={currentStep === 1}
                onClick={() => goToStep(currentStep - 1)}
                className="gap-1"
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={handleSaveProgress}
                >
                  {isPending ? "Saving..." : "Save Progress"}
                </Button>
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    className="gap-1 gradient-primary text-primary-foreground"
                    onClick={() => goToStep(currentStep + 1)}
                  >
                    Continue
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="gap-1 gradient-primary text-primary-foreground"
                    onClick={handleSubmit}
                  >
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                    Submit Brand
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-8 space-y-4">
              <div className="glass-panel p-5 space-y-4">
                <h3 className="font-heading text-sm font-semibold text-on-surface uppercase tracking-wide">
                  Knowledge Base Preview
                </h3>
                <div className="space-y-1">
                  {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
                    (step) => {
                      const isComplete = completedSteps.includes(step);
                      const isCurrent = step === currentStep;
                      return (
                        <div
                          key={step}
                          className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${
                            isCurrent
                              ? "bg-primary/10 border border-primary/20"
                              : ""
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-base ${
                              isComplete
                                ? "text-success"
                                : isCurrent
                                  ? "text-primary"
                                  : "text-on-surface-variant/40"
                            }`}
                          >
                            {isComplete
                              ? "check_circle"
                              : isCurrent
                                ? "radio_button_checked"
                                : "radio_button_unchecked"}
                          </span>
                          <span
                            className={`text-xs ${
                              isCurrent
                                ? "text-primary font-medium"
                                : isComplete
                                  ? "text-on-surface"
                                  : "text-on-surface-variant/50"
                            }`}
                          >
                            {STEP_TITLES[step]}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {completedSteps.length > 0 && (
                <div className="glass-panel p-5 space-y-3">
                  <h3 className="font-heading text-sm font-semibold text-on-surface uppercase tracking-wide">
                    Entered Data
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {completedSteps.map((step) => (
                      <div key={step} className="space-y-1">
                        <span className="text-xs font-medium text-primary">
                          {STEP_TITLES[step]}
                        </span>
                        {step === 1 && (
                          <div className="space-y-0.5">
                            {formData.contactName && (
                              <p className="text-xs text-on-surface-variant truncate">
                                Contact: {formData.contactName}
                              </p>
                            )}
                            {formData.companyName && (
                              <p className="text-xs text-on-surface-variant truncate">
                                Company: {formData.companyName}
                              </p>
                            )}
                          </div>
                        )}
                        {step === 2 && (
                          <div className="space-y-0.5">
                            {formData.businessType && (
                              <p className="text-xs text-on-surface-variant truncate">
                                Type: {formData.businessType}
                              </p>
                            )}
                            {formData.businessStage && (
                              <p className="text-xs text-on-surface-variant truncate">
                                Stage: {formData.businessStage}
                              </p>
                            )}
                          </div>
                        )}
                        {step === 3 && formData.primaryAudience && (
                          <p className="text-xs text-on-surface-variant truncate">
                            {formData.primaryAudience.substring(0, 60)}...
                          </p>
                        )}
                        {step === 4 && (
                          <div className="space-y-0.5">
                            {formData.missionStatement && (
                              <p className="text-xs text-on-surface-variant truncate">
                                {formData.missionStatement.substring(0, 60)}...
                              </p>
                            )}
                          </div>
                        )}
                        {step === 5 && formData.brandVoiceDescription && (
                          <p className="text-xs text-on-surface-variant truncate">
                            {formData.brandVoiceDescription.substring(0, 60)}...
                          </p>
                        )}
                        {step === 6 && (
                          <p className="text-xs text-on-surface-variant truncate">
                            {products.filter((p) => p.name).length} products,{" "}
                            {services.filter((s) => s.name).length} services
                          </p>
                        )}
                        {step === 7 && (
                          <div className="space-y-0.5">
                            {formData.campaignObjective && (
                              <p className="text-xs text-on-surface-variant truncate">
                                Objective: {formData.campaignObjective}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
