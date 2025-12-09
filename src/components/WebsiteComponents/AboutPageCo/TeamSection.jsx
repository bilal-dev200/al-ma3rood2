"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const TeamSection = ({ title, description, team, showMoreLink }) => {
    const { t } = useTranslation();
  return (
    <div className="mt-10">
      <h2 className="text-3xl font-semibold">{t(title)}</h2>
      <p className="text-gray-600 mb-6">{t(description)}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-md overflow-hidden"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-48 object-cover bg-gray-300"
            />
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-1">
                {t("About")} · {t(member.readTime || "2 min read")}
              </p>
              <h3 className="font-semibold text-lg">{t(member.name)}</h3>

              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-500">
                  {t(`Get to know ${member.name}, our ${member.role}.`)}
                </p>

                <div className="flex items-center gap-3">
                  {member.socials?.facebook && (
                    <a href={member.socials.facebook}>
                     <FaFacebook />
                    </a>
                  )}
                  {member.socials?.twitter && (
                    <a href={member.socials.twitter}>
                    <FaInstagram />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More */}
      {showMoreLink && (
        <div className="mt-6">
          <a
            href={showMoreLink}
            className="text-green-600 text-sm hover:underline mb-10"
          >
            {t("Show more articles")} +
          </a>
        </div>
      )}
    </div>
  );
};

export default TeamSection;
