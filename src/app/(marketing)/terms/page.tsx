import { LegalPage, TERMS_SECTIONS } from "../legal-content";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="June 24, 2026"
      sections={TERMS_SECTIONS}
    />
  );
}
