import { LegalPage, PRIVACY_SECTIONS } from "../legal-content";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="June 24, 2026"
      sections={PRIVACY_SECTIONS}
    />
  );
}
