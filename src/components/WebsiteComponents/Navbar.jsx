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
  FaEnvelope,
} from "react-icons/fa";
import { useWatchlistStore } from "@/lib/stores/watchlistStore";
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

  const hiddenPaths = [
    "/account",
    "/account/listoffer",
    "/account/won",
    "/account/lost",
    "/account/selling",
    "/account/sold",
    "/account/unsold",
    "/account/jobs-list",
    "/account/applied-jobs",
    "/account/job-profile",
    "/account/services",
    "/account/services/clients",
    "/account/services/my-services",
    "/notification",
    "/watchlist",
    "/favourite",
  ];

  const shouldHide = hiddenPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  const isLoggedIn = token !== null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/work" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  const mobileNavLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/work" },
    { name: "Contact Us", href: "/contact-us" },
    {
      name: "Start Listing",
      href: isLoggedIn
        ? "/listing"
        : `/login?callbackUrl=${encodeURIComponent(pathname)}`,
    },
    isLoggedIn ? { name: "Watch List", href: "/watchlist" } : null,
  ];

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <header className="w-full border-b shadow-sm bg-white">
      {/* Top Navbar */}
      <div className="flex md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between px-4 md:px-6 py-3 flex-wrap gap-y-2">
        {/* Left Section: User / Phone */}
        <div className="flex items-center gap-2 md:gap-4 text-sm md:justify-self-start">
          {!shouldHide && (
            <Link
              href={
                isLoggedIn
                  ? "/account"
                  : `/login?callbackUrl=${encodeURIComponent(pathname)}`
              }
            >
              <div className="flex items-center gap-1 cursor-pointer hover:text-green-500 transition-colors">
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
                    <div className="flex w-8 h-8 rounded-full bg-green-600 items-center justify-center text-white font-bold">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )
                ) : (
                  <FaUser className="text-lg" />
                )}
                {isLoggedIn ? (
                  <span className="hidden lg:flex">{user?.username}</span>
                ) : (
                  <span>{t("Login")}</span>
                )}
              </div>
            </Link>
          )}

          <div className="hidden sm:flex items-center gap-1 hover:text-green-500">
            <FaPhone className="text-lg" />
            <a href="tel:+966536465526" className="hidden md:block">
              <span>{t("+966 53 646 5526")}</span>
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-1 hover:text-green-500">
            <FaEnvelope className="text-lg" />
            <a href="mailto:support@ma3rood.com" className="hidden md:block">
              <span>support@ma3rood.com</span>
            </a>
          </div>
        </div>

        {/* Center Logo */}
        <div className="flex-1 md:flex-none flex justify-center md:justify-self-center md:w-auto">
          <Link href="/">
            <Image
              src="/Ma3rood-logo-green2.png"
              alt="Al Ma3rood Logo"
              width={256}
              height={50}
              className="mx-auto w-[140px] md:w-[220px]"
              sizes="(max-width: 768px) 140px, 220px"
              priority
            />
          </Link>
        </div>

        {/* Right Section: Buttons + Hamburger */}
        <div className="flex items-center gap-4 md:gap-8 text-sm md:justify-self-end">
          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
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
              </>
            ) : (
              <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}>
                <div className="flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors">
                  <FaPlus className="text-lg" />
                  <span>{t("Start a Listing")}</span>
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="text-white text-sm bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/nav.png')" }}
      >
        <ul className="hidden md:flex justify-center gap-10 py-4">
          {navLinks.map((link, index) => (
            <li
              key={index}
              className="hover:text-green-400 cursor-pointer"
            >
              <Link href={link.href}>{t(link.name)}</Link>
            </li>
          ))}
        </ul>

        {/* {mobileMenuOpen && (
          <ul className="md:hidden flex flex-col gap-4 px-4 py-4 bg-opacity-70 text-white">
            {mobileNavLinks.filter(Boolean).map((link, index) => (
              <li
                key={index}
                className="hover:text-green-400 cursor-pointer border-b pb-2"
              >
                <Link href={link.href}>{t(link.name)}</Link>
              </li>
            ))}
            {/* Contact Info (Mobile) */}
            {/* <li className="flex items-center gap-2 hover:text-green-400 cursor-pointer border-b pb-2">
              <FaPhone className="text-lg" />
              <a href="tel:+966536465526">{t("+966 53 646 5526")}</a>
            </li>
            <li className="flex items-center gap-2 hover:text-green-400 cursor-pointer border-b pb-2">
              <FaEnvelope className="text-lg" />
              <a href="mailto:support@ma3rood.com">support@ma3rood.com</a>
            </li>
          </ul> */}
        {/* Mobile Sidebar Overlay */}
{mobileMenuOpen && (
  <div
    onClick={() => setMobileMenuOpen(false)}
    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
  />
)}

{/* Mobile Sidebar */}
{/*  */}

{/*  */}
<aside
  className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm
    bg-gradient-to-b from-[#0b2b26] via-[#0f3d35] to-[#145a4f]
    text-white shadow-2xl transform transition-transform duration-300
    md:hidden
    ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
>
  {/* Header */}
  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
    <span className="text-lg font-semibold tracking-wide">MA3ROOD</span>
    <button onClick={() => setMobileMenuOpen(false)}>
      <FaTimes className="text-xl hover:text-green-400 transition" />
    </button>
  </div>

  {/* Contact Box */}
  {/* <div className="p py2 spa-y2 bg-white/5 rounded-b-lg mt2">
    <a
      href="tel:+966536465526"
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
    >
      <FaPhone className="text-green-400" />
      <span className="text-sm">{t("+966 53 646 5526")}</span>
    </a>
    <a
      href="mailto:support@ma3rood.com"
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
    >
      <FaEnvelope className="text-green-400" />
      <span className="text-sm">support@ma3rood.com</span>
    </a>
  </div> */}
{/* <div class="p py2 spa-y2 bg-white/5 text-[10px] rounded-b-lg mt2"><a href="tel:+966536465526" class="flex items-center text-[10px] gap-3 px-4 py-1 rounded-lg hover:bg-white/10 transition"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="text-green-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"></path></svg><span class="text-[10px]">+966 53 646 5526</span></a><a href="mailto:support@ma3rood.com" class="flex items-center gap-3 px-4 py-1 rounded-lg hover:bg-white/10 transition"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="text-green-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"></path></svg><span class="text-[10px]">support@ma3rood.com</span></a></div> */}
  {/* Separator */}
  <div className="mx5 my3 border-t border-white/15" />

  {/* Navigation Links */}
  <ul className="flex flex-col px-4 py-2 gap-1">
    {mobileNavLinks.filter(Boolean).map((link, index) => (
      <li key={index}>
        <Link
          href={link.href}
          onClick={() => setMobileMenuOpen(false)}
          className="block px-4 py-3 rounded-lg text-sm font-medium
            hover:bg-white/10 hover:text-green-400 transition"
        >
          {t(link.name)}
        </Link>
      </li>
    ))}
  </ul>

  {/* Login/User Button + Footer at Bottom */}
  <div className="absolute bottom-0 text-center w-full px-5 pb-4 space-y-3">

<Link
      href={
        isLoggedIn
          ? "/account"
          : `/login?callbackUrl=${encodeURIComponent(pathname)}`
      }
      onClick={() => setMobileMenuOpen(false)}
      className="flex items-center gap-3 px-4 py-3 rounded-lg
        bg-white/10 hover:bg-white/20 transition"
    >
      {isLoggedIn ? (
        user?.profileImage ? (
          <Image
            src={user.profileImage}
            alt="User"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        )
      ) : (
        <FaUser className="text-lg" />
      )}

      <span className="text-sm font-medium">
        {isLoggedIn ? user?.username : t("Login")}
      </span>
    </Link>
    <div class="p py2 spa-y2 bg-white/5 text-[10px] rounded-b-lg mt2"><a href="tel:+966536465526" class="flex items-center text-[10px] gap-3 px-4 py-1 rounded-lg hover:bg-white/10 transition"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="text-green-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"></path></svg><span class="text-[10px]">+966 53 646 5526</span></a><a href="mailto:support@ma3rood.com" class="flex items-center gap-3 px-4 py-1 rounded-lg hover:bg-white/10 transition"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="text-green-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"></path></svg><span class="text-[10px]">support@ma3rood.com</span></a></div>

    

    {/* Footer */}
    <div className="text-center text-xs text-white/50 pt-2 border-t border-white/10">
      © {new Date().getFullYear()} ma3rood.com
    </div>
  </div>
</aside>


      </nav>
    </header>
  );
};

export default Navbar;
