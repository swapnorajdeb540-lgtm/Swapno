import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';

export function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-2 border-b border-[#20202e] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#c5a059] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Data Protection</span>
        </div>
        <h1 className="text-3xl font-bold text-white font-brand">Privacy Policy</h1>
        <p className="text-xs text-[#808098]">Effective Date: October 2026 · YŌKOSO Restaurant Sylhet</p>
      </div>

      <div className="space-y-6 text-xs text-[#a0a0b8] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">1. Information We Collect</h2>
          <p>
            When you register, place online orders, or request table reservations with YŌKOSO, we collect your name, contact phone number, email address, delivery destination in Sylhet, and any explicit cooking preferences or dietary allergen notes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">2. Utilization of Data</h2>
          <p>
            Your details are utilized strictly for kitchen preparation, dispatch coordination with our Sylhet delivery riders, SMS or email notification regarding order tracking, and table seating reservation management. We never sell or lease customer information to third-party marketing entities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">3. Payment Security</h2>
          <p>
            Transactions via bKash, Nagad, and debit/credit cards are routed through verified digital payment channels and verified transaction identifiers. We do not store sensitive card CVVs or personal bank PINs on our server infrastructure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">4. Direct Contact</h2>
          <p>
            For privacy inquiries or deletion requests, contact our privacy compliance desk at <a href="mailto:yokoso.syl@gmail.com" className="text-[#c5a059] underline">yokoso.syl@gmail.com</a> or phone +8801841965676.
          </p>
        </section>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-2 border-b border-[#20202e] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#c5a059] uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Dining & Ordering Agreement</span>
        </div>
        <h1 className="text-3xl font-bold text-white font-brand">Terms and Conditions</h1>
        <p className="text-xs text-[#808098]">Effective Date: October 2026 · YŌKOSO Restaurant Sylhet</p>
      </div>

      <div className="space-y-6 text-xs text-[#a0a0b8] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">1. Ordering & Delivery Policy</h2>
          <p>
            Deliveries are made within the Sylhet metropolitan radius. Standard delivery fee is ৳70, with complimentary delivery granted on orders equal to or exceeding ৳2,000. Estimated delivery duration ranges between 35 and 50 minutes depending on kitchen queue and city traffic conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">2. Order Cancellations & Refunds</h2>
          <p>
            Orders can only be cancelled while status remains &quot;Pending&quot;. Once food preparation commences in our kitchen, orders cannot be cancelled due to perishable ingredient use. If a delivery arrives damaged or incomplete, contact hotline +8801841965676 immediately for replacement or prompt refund.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">3. Table Reservations</h2>
          <p>
            Reserved dining tables at our Al-Madani Tower restaurant are held for twenty (20) minutes past the scheduled arrival hour. In the event of delay, please inform our reception to preserve your designated Tatami or dining suite.
          </p>
        </section>
      </div>
    </div>
  );
}
