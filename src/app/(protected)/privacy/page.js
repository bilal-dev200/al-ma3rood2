"use client";
import React from 'react'
import { useTranslation } from "react-i18next";

const page = () => {
  const { t ,i18n} = useTranslation();
    const isArabic = i18n.language === "ar"; // check current language


  return (
    <div className="mx-auto px-14 py-14 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-2">{t("Privacy Policy for Ma3rood")}</h1>

      <p className="mb-6">
        {t(" Welcome to Ma3rood (“we,” “us,” or “our”). Your privacy and trust matter greatly to us.This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our online marketplace service (“Service”).")}
      </p>

      <p className="mb-6">
        {t("By using Ma3rood, you acknowledge this policy and consent to our data practices.")}
      </p>

      {/* Section 1 */}
      <h2 className="text-2xl font-semibold mb-4">{t("1. Information We Collect & How We Use It")}</h2>
      <h3 className="text-lg font-medium mb-2">{t("A. Information You Provide")}</h3>
      <ul className="list-disc pl-6 mb-4">
        <li>{t("Account registration: name, email address, contact number, password.")}</li>
        <li>{t("Listings, listing images & details, communications between buyers and sellers.")}</li>
        <li>{t("Payment-related information (e.g., billing details).")}</li>
        <li>{t("Support & feedback: messages you send, including issues and inquiries.")}</li>
      </ul>

      <h3 className="text-lg font-medium mb-2">{t("B. Automatically Collected Information")}</h3>
      <ul className="list-disc pl-6 mb-4">
        <li>{t("Usage data: site interactions, pages viewed, search queries, IP address.")}</li>
        <li>{t("Device information: browser, OS, device type.")}</li>
      </ul>

      <h3 className="text-lg font-medium mb-2">{t("C. How We Use Your Information")}</h3>
      <ul className="list-disc pl-6 mb-6">
        <li>{t("Operate and maintain the Service: transactions, communication, verification, dispute management.")}</li>
        <li>{t("Trust & Safety: prevent fraud, enforce policies, secure accounts.")}</li>
        <li>{t("Personalization: improve recommendations and search results.")}</li>
        <li>{t("Send updates: about changes, new features, or transactions (opt-out available).")}</li>
        <li>{t("Legal compliance: respond to investigations or lawful requests.")}</li>
      </ul>

      {/* Section 2 */}
      <h2 className="text-2xl font-semibold mb-4">{t("2. Cookies & Tracking Technologies")}</h2>
      <p className="mb-6">
        {t(" We use cookies, web beacons, and similar tracking tools to remember preferences, analyze performance, and provide tailored advertising. You can manage or disable cookies through your browser settings or   via our cookie banner.")}
      </p>

      {/* Section 3 */}
      <h2 className="text-2xl font-semibold mb-4">{t("3. Sharing & Disclosure of Personal Information")}</h2>
      <table className="w-full border mb-6 text-sm">
        <thead className="bg-gray-100">
          <tr>
               <th
            className={`border px-4 py-2 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {t("Type of Recipient")}
          </th>
          <th
            className={`border px-4 py-2 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {t("Purpose & Conditions")}
          </th>

          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">{t("Service providers")}</td>
            <td className="border px-4 py-2">{t("Assist in operations (hosting, email, payments).")}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">{t("Affiliated services")}</td>
            <td className="border px-4 py-2">{t("With our owned entities, subject to consent/opt-out.")}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">{t("Legal & fraud protection")}</td>
            <td className="border px-4 py-2">{t("To comply with law or protect users.")}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">{t("Business transfers")}</td>
            <td className="border px-4 py-2">{t("In case of merger, acquisition, or asset sale.")}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">{t("Aggregated data")}</td>
            <td className="border px-4 py-2">{t("For analysis, marketing trends—non-identifiable.")}</td>
          </tr>
        </tbody>
      </table>

      {/* Section 4 */}
      <h2 className="text-2xl font-semibold mb-4">{t("4. User Choices & Rights")}</h2>
      <ul className="list-disc pl-6 mb-6">
        <li>{t("Opt-in/Opt-out settings for ads, services, and sharing.")}</li>
        <li>{t("Access & Correction: view and update your personal information.")}</li>
        <li>{t("Deletion Requests: request deletion or restriction of your data.")}</li>
        {/* <li>{t("California Residents: opt out of “sale” of data via a “Do Not Sell My Info” link.")}</li> */}
      </ul>

      {/* Section 5 */}
      <h2 className="text-2xl font-semibold mb-4">{t("5. Fair Information Practices & Privacy by Design")}</h2>
      <p className="mb-6">
        {t(" We follow global privacy principles including transparency, consent, access, data minimization,  security, and enforcement. We embed Privacy-by-Design into all processes to keep your data safe.")}
      </p>

      {/* Section 6 */}
      <h2 className="text-2xl font-semibold mb-4"> {t("6. Data Retention & Security")}</h2>
      <p className="mb-6">
        {t(" We retain data as necessary for services or law. Outdated data is deleted. We use  industry-standard measures to secure your information.")}
      </p>

      {/* Section 7 */}
      <h2 className="text-2xl font-semibold mb-4"> {t("7. Children & Age Limits")}</h2>
      <p className="mb-6">
        {t(" Our Service is not directed at children under 13 (or higher where required). We do not knowingly collect personal data from minors.")}
      </p>

      {/* Section 8 */}
      <h2 className="text-2xl font-semibold mb-4">{t("8. Updates to This Policy")}</h2>
      <p className="mb-6">
        {t("We may update this policy. Major updates will be announced via site or email. Continued use means acceptance.")}
      </p>

      {/* Section 9 */}
      {/* <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
      <ul className="list-disc pl-6 mb-6">
        <li>Email: [insert contact email]</li>
        {/* <li>Privacy page: [insert link]</li> */}
      {/* <li>Toll-free number: [insert number]")}</li>
      </ul> */}

      {/* Section 10 */}
      <h2 className="text-2xl font-semibold mb-4">{t("9. Legal Basis (If Applicable)")}</h2>
      <ul className="list-disc pl-6 mb-6">
        <li>{t("Consent")}</li>
        <li>{t("Contract performance")}</li>
        <li>{t("Legal obligation")}</li>
        <li>{t("Legitimate interests (safety, fraud prevention)")}</li>
      </ul>
    </div>
  )
}

export default page