"use client";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const articles = [
  {
    title: "How grocers are approaching delivery as the market evolves",
    description:
      "Eliminated reader info read elimination demand into grocers' needs.",
    image: "/latest1.png",
    author: "zidan",
    date: "3 Nov 2025",
  },
  {
    title: "The Friday Checkout: Food insecurity keeps retailers off balance",
    description:
      "Eliminated reader info read elimination demand into grocers' needs.",
    image: "/latest2.png",
    author: "zidan",
    date: "3 Nov 2025",
  },
  {
    title: "Consumer want grocer to use AI to help them save money Dunnhumby",
    description:
      "Eliminated reader info read elimination demand into grocers' needs.",
    image: "/latest3.png",
    author: "zidan",
    date: "3 Nov 2025",
  },
  {
    title:
      "Order up! How grocers are replicating the restaurant experience in retail",
    description:
      "Eliminated reader info read elimination demand into grocers' needs.",
    image: "/latest4.png",
    author: "zidan",
    date: "3 Nov 2025",
  },
];

const LatestNews = () => {
  const { t } = useTranslation();
  return (
    <section className="mt-10 px-2 sm:px-5 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">
          {t("Latest News")}
        </h2>

     
        <div className="grid grid-cols-1 gap-6 sm:hidden">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow"
            >
              <div className="relative w-full h-48">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold">{t(article.title)}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t(article.description)}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {t("by")} {article.author} · {article.date}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & Desktop layout */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow flex flex-col"
            >
              <div className="relative w-full h-40">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-4 flex-1">
                <h3 className="text-sm font-semibold">{t(article.title)}</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {t(article.description)}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {t("by")} {article.author} · {article.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
