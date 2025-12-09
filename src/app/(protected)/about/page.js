"use client";
import { HeadingAndDes } from "@/components/WebsiteComponents/AboutPageCo/HeadingAndDes";
import TeamSection from "@/components/WebsiteComponents/AboutPageCo/TeamSection";
import LatestNews from "@/components/WebsiteComponents/ReuseableComponenets/LatestNews";
import React from "react";
import Image from "next/image";
import { FaGlobe, FaLock, FaUsers, FaRobot } from "react-icons/fa";
import { FaShieldAlt, FaMobileAlt, FaThLarge, FaChartLine } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const page = () => {
  const { t } = useTranslation();

  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <Image
          src="/hero2.jpg"
          alt={t("Marketplace")}
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold">{t("About Us – Ma3rood")}</h1>
          <p className="mt-3 text-lg md:text-xl">{t("Your Marketplace. Your Kingdom.")}</p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">{t("Who We Are")}</h2>
          <p className="leading-relaxed">
            {t(
              "Ma3rood is Saudi Arabia’s modern, mobile-first marketplace designed to connect buyers and sellers with ease, trust, and efficiency. Whether you’re searching for a family car, a new home, a job opportunity, or unique household items, Ma3rood brings it all together in one simple, secure platform."
            )}
          </p>
          <p className="mt-4 leading-relaxed">
            {t(
              "We go beyond just listings — we empower individuals, businesses, and communities to trade smarter, faster, and with confidence."
            )}
          </p>
        </div>
        <div className="flex justify-center">
          <Image src="/hero1.jpg" alt={t("Ma3rood App")} width={500} height={400} />
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-100 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">{t("Our Mission")}</h2>
        <p className="max-w-3xl mx-auto leading-relaxed">
          {t(
            "To create Saudi Arabia’s most trusted and user-friendly online marketplace — making buying and selling effortless for everyone, from first-time users to seasoned traders."
          )}
        </p>
      </section>

      {/* What We Offer */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t("What We Offer")}</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg text-center">
            <FaThLarge className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">{t("Comprehensive Categories")}</h3>
            <p className="text-sm">{t("From cars and homes to jobs, services, and more.")}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg text-center">
            <FaShieldAlt className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">{t("Trusted Connections")}</h3>
            <p className="text-sm">{t("Secure messaging & verification for safe trading.")}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg text-center">
            <FaChartLine className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">{t("Powerful Seller Tools")}</h3>
            <p className="text-sm">{t("Manage listings, chat with buyers & track deals.")}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg text-center">
            <FaMobileAlt className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">{t("Mobile-First Experience")}</h3>
            <p className="text-sm">{t("Clean, responsive, and built for today’s users.")}</p>
          </div>
        </div>
      </section>

      {/* Why Ma3rood */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">{t("Why Ma3rood?")}</h2>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
              <FaGlobe className="text-green-600 text-3xl mb-3" />
              <h3 className="font-semibold text-xl mb-2">{t("Local Expertise")}</h3>
              <p className="text-gray-600">
                {t(
                  "100% focused on the Saudi market. Every feature is tailored to the unique buying and selling habits of people in the Kingdom."
                )}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
              <FaLock className="text-green-600 text-3xl mb-3" />
              <h3 className="font-semibold text-xl mb-2">{t("Secure Trading")}</h3>
              <p className="text-gray-600">
                {t(
                  "Advanced security, safe messaging, and verification systems protect every transaction so you can trade with confidence."
                )}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
              <FaUsers className="text-green-600 text-3xl mb-3" />
              <h3 className="font-semibold text-xl mb-2">{t("Community-Driven")}</h3>
              <p className="text-gray-600">
                {t(
                  "Empowering individuals, families, and SMEs across Saudi Arabia to connect, grow, and thrive together through trade."
                )}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
              <FaRobot className="text-green-600 text-3xl mb-3" />
              <h3 className="font-semibold text-xl mb-2">{t("AI-Enhanced Experience")}</h3>
              <p className="text-gray-600">
                {t(
                  "Smart search, intelligent recommendations, and fraud detection tools make your journey smoother and safer."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="relative h-[50vh] flex items-center justify-center text-white text-center">
        <Image src="/hero3.jpg" alt={t("Vision")} fill className="object-cover brightness-50" />
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("Our Vision")}</h2>
          <p className="text-lg">
            {t(
              "To become the Kingdom’s most trusted and widely used online marketplace, where millions of Saudis and residents connect daily."
            )}
          </p>
        </div>
      </section>

      {/* Closing */}
      <section className="py-12 text-center">
        <blockquote className="text-xl italic font-medium max-w-3xl mx-auto">
          {t(
            "“At Ma3rood, we’re not just building a platform — we’re building a trusted trade community for the Kingdom.”"
          )}
        </blockquote>
      </section>
      <div className="border-t">
        <LatestNews />
      </div>
    </div>
  );
};

export default page;
