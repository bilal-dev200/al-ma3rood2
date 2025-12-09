"use client";
import { useTranslation } from 'react-i18next';
const HelpOptions = () => {
   const { t } = useTranslation();

  const options = [
    {
      title: t("Send us a message"),
      description: t("Give us some info on what you need help with, and we’ll get back to you"),
      color: "#55D8A5",
      icon: "/contact3.png",
    },
    {
      title: t("Chat"),
      description: t("We’re here to help on chat, 7 days a week."),
      color: "#D78EFF",
      icon: "/contact2.png",
    },
    {
      title: t("Check out Community"),
      description: t("Give us some info on what you need help with, and we’ll get back to you"),
      color: "#83B3FF",
      icon: "/contact1.png",
    },
  ];

  return (
    <div className="p-8 ml-0 md:ml-8">
      <h2 className="text-xl font-semibold mb-6">
       {t("Didn’t find what you were looking for?")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {options.map((option, index) => (
           <div
            key={index}
            className="rounded-lg p-5 text-white shadow-md - flex flex-col items-center text-center"
            style={{ backgroundColor: option.color }}
          >
            <img
              src={option.icon}
              alt={option.title}
              className="w-20 h-24 mb-4 mt-8"
            />
            <h3 className="text-lg font-bold  mt-5">{option.title}</h3>
            <p className="text-sm mt-4">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpOptions;
