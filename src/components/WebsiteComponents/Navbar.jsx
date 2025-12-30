"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FaUser,
  FaPhone,
  FaHeart,
  FaPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useWatchlistStore } from "@/lib/stores/watchlistStore";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useAuthStore } from "@/lib/stores/authStore";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const watchlistCount = useWatchlistStore(
    (state) => state.watchlist?.length || 0
  );
  const { user, token } = useAuthStore();

  const isLoggedIn = token !== null;
  // const fetchWatchlist = useWatchlistStore((state) => state.fetchWatchlist);

  // React.useEffect(() => {
  //   // Only fetch watchlist if user is logged in (token exists)
  //   if (typeof window !== 'undefined' && localStorage.getItem('token')) {
  //     fetchWatchlist();
  //   }
  // }, [fetchWatchlist]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/work" },
    // { name: "Help Center", href: "/" },
    { name: "Contact Us", href: "/contact-us" },
  ];

    const mobileNavLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/work" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Start Listing", href: isLoggedIn ? "/listing" : `/login?callbackUrl=${encodeURIComponent(pathname)}` },
    isLoggedIn ? { name: "Watch List", href: "/watchlist" } : null,
  ];
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <header className="w-full border-b shadow-sm ">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-white flex-wrap">
        <div className="flex items-center gap-4 md:gap-8 text-sm">
        {pathname !== "/account" && (
          <Link href={isLoggedIn ? "/account" : `/login?callbackUrl=${encodeURIComponent(pathname)}`}>
            <div className="flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors">
              {isLoggedIn ? (
                user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user?.username || "User"}
                    width={30}
                    height={30}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex w-8 h-8 rounded-full bg-green-600 items-center justify-center text-white font-bold"
                  >
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )
              ) : (
                <FaUser className="text-lg" />
              )}
              {/* <span> */}
                {isLoggedIn ? <span className="hidden md:flex"> {user?.username} </span> || <span>{t("Account")}</span> : <span>{t("Login")}</span>}
              {/* </span> */}
            </div>
          </Link>
        )}


          <div className="hidden sm:flex items-center gap-2 hover:text-green-500">
            <FaPhone className="text-lg" />
            {/* <span>+966 53 646 5526</span> */}
            <a href="tel:+966536465526">
              <span className="">
                {" "}
                {t("+966 53 646 5526")}{" "}
              </span>
            </a>
          </div>
          {/* <LanguageSwitcher /> */}
        </div>

        <div className="order-first sm:order-none w-full sm:w-auto text-center mt-2 sm:mt-0 flex justify-center">
          <Link href="/">
            <Image
              src="/Ma3rood-logo-green2.png"
              alt="Al Ma3rood Logo"
              width={256}
              height={50}
              style={{ height: "auto" }}
              className="mx-auto md:ltr:ml-[-80px] md:rtl:mr-[-80px]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </Link>
        </div>
        {isLoggedIn ?
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/watchlist">
              <div className="flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors">
                <FaHeart className="text-lg" />
                <span>
                  {t("Watchlist")} ({watchlistCount})
                </span>
              </div>
            </Link>
            <Link href="/listing">
              <div className="flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors">
                <FaPlus className="text-lg" />
                <span>{t("Start a Listing")}</span>
              </div>
            </Link>
          </div>
          :
          <div className="hidden md:flex items-center gap-8 text-sm min-w-36">
            <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}>
              <div className="flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors">
                <FaPlus className="text-lg" />
                <span>{t("Start a Listing")}</span>
              </div>
            </Link>
          </div>
        }

        <div className={`md:hidden mt-2 ${isRTL ? "mr-auto" : "ml-auto"}`}>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>

      </div>

      <nav
        className="text-white text-sm bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/nav.png')",
        }}
      >
        <ul className="hidden md:flex justify-center gap-10 py-4">
          {navLinks.map((link, index) => (
            <li key={index} className="hover:text-green-400 cursor-pointer">
              <Link href={link.href}>{t(link.name)}</Link>
            </li>
          ))}
        </ul>

        {mobileMenuOpen && (
          <ul className="md:hidden flex flex-col gap-4 px-4 py-4  bg-opacity-70 text-white">
            {mobileNavLinks.filter(Boolean).map((link, index) => (
              <li
                key={index}
                className="hover:text-green-400 cursor-pointer border-b pb-2"
              >
                <Link href={link.href}>{t(link.name)}</Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
