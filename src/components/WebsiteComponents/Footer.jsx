import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaTiktok, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

const footerData = [
  {
    title: "Marketplace",
    links: [
      { text: "Latest deals", href: "/hotDeals" },
      { text: "Stores", href: "/marketplace" },
      { text: "Cool Auction", href: "/coolAuction" },
      // { text: "1 reserve", href: "/marketplace", price: "$" },
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
        <p>
          {t(`Copyright ${new Date().getFullYear()} © All rights reserved`)}
        </p>
        <div className="relative group flex flex-col items-center justify-center">
          <div className="flex items-center gap-4 transition-all duration-300 group-hover:opacity-20 group-hover:blur-[1px]">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiNwLg5q5AETDBbqhSaI7gdCYcWvicii6UCw&s"
              className="h-5 grayscale"
              alt="Tabby"
            />
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH5KpGG8CYq9sJTMohKt_76EyG7VaYa9KyCg&s"
              className="h-5 grayscale"
              alt="Tamara"
            />
            <img
              src="/stc-pay.png"
              className="h-8 grayscale w-auto object-contain"
              alt="STC Pay"
            />
            <img
              src="/smsa-express.png"
              className="h-8 grayscale w-auto object-contain"
              alt="SMSA Express"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="bg-gray-900/90 text-white text-[10px] font-medium px-3 py-1.5 rounded-full shadow-lg backdrop-blur-[2px]">
              {t("Coming Soon")}
            </span>
          </div>
        </div>

        <div className="flex gap-4 text-gray-500">
          <Link href="/terms">{t("Terms and Conditions")}</Link>
          <Link href="/privacy">{t("Privacy Policy")}</Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-500 mt-2 sm:mt-0">
          <a href="https://www.tiktok.com/@user27423812387656" target="_blank" rel="noopener noreferrer">
            <FaTiktok size={20} className="hover:text-black cursor-pointer bg-transparent" />
          </a>
          <a href="https://www.instagram.com/ma3rood_/" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={20} className="hover:text-pink-600 cursor-pointer bg-transparent" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61586486150903" target="_blank" rel="noopener noreferrer">
            <FaFacebook size={20} className="hover:text-blue-600 cursor-pointer bg-transparent" />
          </a>
          <a href="https://www.linkedin.com/company/ma3rood/about/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={20} className="hover:text-blue-700 cursor-pointer bg-transparent" />
          </a>
          <a href="https://x.com/ma3rood" target="_blank" rel="noopener noreferrer">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg" className="hover:text-black cursor-pointer bg-transparent">
              <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
