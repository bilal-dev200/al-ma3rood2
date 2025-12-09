import React from "react";

const Page = () => {
  return (
    <div className="max-w-5xl mx-auto my-12 px-6 py-10 bg-white shadow-lg rounded-xl">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Terms & Conditions
      </h1>

      {/* 1. Services */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">1. Our Services</h2>
        <p className="text-gray-700 mb-2">
          We provide an online platform where users can list, buy, and sell
          products or services. We do not act as a party in any transaction
          between users.
        </p>
        <p className="text-gray-700">
          You agree to use our platform only for lawful purposes and in
          accordance with these Terms.
        </p>
      </section>

      {/* 2. Membership */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">2. Membership</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>You must be at least 18 years old to register.</li>
          <li>
            You are responsible for keeping your account details and password
            secure.
          </li>
          <li>
            You must provide accurate, current, and complete information when
            creating an account.
          </li>
          <li>
            We reserve the right to suspend or terminate your membership at any
            time.
          </li>
        </ul>
      </section>

      {/* 3. User Content */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">3. User Content</h2>
        <p className="text-gray-700 mb-2">
          You are solely responsible for any content you post on our platform,
          including text, images, and listings.
        </p>
        <p className="text-gray-700">
          By posting content, you grant us a license to use, display, and
          distribute it in connection with our services.
        </p>
      </section>

      {/* 4. Listing & Selling */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">4. Listing & Selling</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            Listings must be truthful, accurate, and comply with applicable
            laws.
          </li>
          <li>
            Prices must clearly state whether they include taxes and fees.
          </li>
          <li>
            Sellers are responsible for fulfilling orders and providing goods as
            described.
          </li>
        </ul>
      </section>

      {/* 5. Buying */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">5. Buying</h2>
        <p className="text-gray-700 mb-2">
          Placing a bid, order, or purchase means you intend to complete the
          transaction.
        </p>
        <p className="text-gray-700">
          Buyers are responsible for making timely payments and complying with
          applicable restrictions.
        </p>
      </section>

      {/* 6. Community & Feedback */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          6. Community, Feedback & Forums
        </h2>
        <p className="text-gray-700 mb-2">
          Feedback should be honest, respectful, and related to a specific
          transaction.
        </p>
        <p className="text-gray-700">
          Community forums must not be used for harassment, spam, or promotion
          of illegal content.
        </p>
      </section>

      {/* 7. Disputes & Liability */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          7. Dispute Resolution & Liability
        </h2>
        <p className="text-gray-700 mb-2">
          Users should attempt to resolve disputes directly. We are not
          responsible for issues arising between buyers and sellers.
        </p>
        <p className="text-gray-700">
          Our liability is limited to the maximum extent permitted by law. We do
          not guarantee uninterrupted or error-free service.
        </p>
      </section>

      {/* 8. Changes */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
        <p className="text-gray-700">
          We may update these Terms from time to time. Continued use of the
          platform after updates means you accept the revised Terms.
        </p>
      </section>

      {/* 9. Governing Law */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
        <p className="text-gray-700">
          These Terms are governed by the laws of your jurisdiction. Any disputes
          will be handled in the courts of that jurisdiction.
        </p>
      </section>

      {/* Footer Note */}
      <div className="border-t pt-6 mt-10 text-sm text-gray-600">
        <p>
          <strong>Note:</strong> This is a sample Terms & Conditions document.
          Please consult with a legal professional to adapt it for your specific
          business and location.
        </p>
      </div>
    </div>
  );
};

export default Page;