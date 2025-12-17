import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaTiktok, FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";

const footerData = [
  {
    title: "Marketplace",
    links: [
      { text: "Latest deals", href: "/hotDeals" },
      { text: "Stores", href: "/marketplace" },
      { text: "Cool Auction", href: "/coolAuction" },
      { text: "1 reserve", href: "/marketplace", price: "$" },
    ],
  },
  {
    title: "Jobs",
    links: [{ text: "Browse Categories", href: "/jobs" }],
  },
  {
    title: "Motors",
    links: [
      { text: "Browse all cars", href: "/motors" },
      { text: "Sell your car", href: "/listing" },
    ],
  },
  {
    title: "Property",
    links: [{ text: "Browse all Properties", href: "/property" }],
  },
  {
    title: "Services",
    links: [
      { text: "Browse all Services", href: "/services" },
      { text: "List my services", href: "/listing" },
    ],
  },
  {
    title: "Community",
    links: [
      { text: "Help", href: "/contact-us" },
      { text: "About Us", href: "/about" },
      { text: "Trust & Safety", href: "/work" },
      { text: "Seller Information", href: "/terms" }
    ],
  },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t text-sm text-gray-700 mt-10">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold mb-1">
              {t("Join our newsletter")}
            </h2>
            <p className="text-gray-500">
              {t(
                "Register now to get latest updates on promotions & coupons. Don’t worry, we’re not spam!"
              )}
            </p>
          </div>
          <form className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              placeholder={t("Enter your email address")}
              className="border px-4 py-2 rounded-md w-full sm:w-72"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md w-full sm:w-auto"
            >
              {t("SEND")}
            </button>
          </form>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center md:text-right">
          {t("By subscribing you agree to our")}{" "}
          <Link href="/terms" className="underline">
            {t("Terms & Conditions")}
          </Link>{" "}
          {t("and")}{" "}
          <Link href="/privacy" className="underline">
            {t("Privacy Policy")}
          </Link>
          ..
        </p>
      </div>

      <hr className="border-gray-200" />

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {footerData.map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold mb-2">{t(section.title)}</h4>
            <ul className="space-y-1">
              {section.links.map((link, index) => {
                const linkText = typeof link === "string" ? link : link.text;
                const linkHref = typeof link === "string" ? "#" : link.href;
                const hasPrice = typeof link === "object" && link.price;

                return (
                  <li key={index}>
                    <Link
                      href={linkHref}
                      className="hover:underline cursor-pointer text-gray-500 block"
                    >
                      {hasPrice ? (
                        <span>
                          <span className="price">{link.price}</span>{" "}
                          {t(linkText)}
                        </span>
                      ) : (
                        t(linkText)
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <hr className="border-gray-200" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
        <p>{t("Copyright 2025 © All rights reserved")}</p>
        <div className="flex items-center gap-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiNwLg5q5AETDBbqhSaI7gdCYcWvicii6UCw&s"
            className="h-5"
            alt="Tabby"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH5KpGG8CYq9sJTMohKt_76EyG7VaYa9KyCg&s"
            className="h-5"
            alt="Paypal"
          />
        </div>

        <div className="flex gap-4 text-gray-500">
          <Link href="/privacy">{t("Terms and Conditions")}</Link>
          <Link href="/privacy">{t("Privacy Policy")}</Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-500 mt-2 sm:mt-0">
          <FaTiktok size={20} className="hover:text-black cursor-pointer bg-transparent" />
          <FaInstagram size={20} className="hover:text-pink-600 cursor-pointer bg-transparent" />
          <FaFacebook size={20} className="hover:text-blue-600 cursor-pointer bg-transparent" />
          <FaLinkedin size={20} className="hover:text-blue-700 cursor-pointer bg-transparent" />
          <FaYoutube size={20} className="hover:text-red-600 cursor-pointer bg-transparent" />
        </div>

      </div>
    </footer>
  );
};

export default Footer;
