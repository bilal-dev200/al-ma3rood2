
import React from "react";
import { Mail, Phone } from "lucide-react";
import Button from "../ReuseableComponenets/Button";

const sections = [
  {
    title: "Summary",
    description: "Add a short summary about your experience and background.",
    button: "Add summary",
  },
  {
    title: "Work preferences",
    description:
      "Tell us your preferred job titles, industries and work settings.",
    button: "Edit preferences",
  },
  {
    title: "Experience",
    description: "List your work experience to show employers your skills.",
    button: "Add experience",
  },
  {
    title: "Education",
    description:
      "Add your educational qualifications to highlight your academic background.",
    button: "Add education",
  },
  {
    title: "Skills",
    description:
      "List your relevant skills to increase your chances of getting hired.",
    button: "Add skills",
  },
  {
    title: "CV",
    description: "Upload your CV to help employers know more about you.",
    button: "Upload CV",
  },
];

const roleDetails = [
  { label: "Preferred role titles", value: "Not specified" },
  { label: "Open to all role titles", value: "no" },
  { label: "Preferred location", value: "Not specified" },
  { label: "Preferred industry", value: "Not specified" },
  { label: "Right to work in New Zealand", value: "yes" },
];
const profileCards = [
  {
    heading: "Profile visibility",
    content:
      "Employers and recruiters can see your profile and contact you about jobs.",
    tag: "full profile ▼",
    button: false,
  },
  {
    heading: "Profile tier",
    content: "Start your job hunt journey with a bronze profile.",
    tag: "Bronze",
    className: "-ml-32",
    button: false,
  },
  {
    heading: "1 step to a Silver Profile",
    content:
      "Describe your next role and level up to a Silver Profile to get better job matches.",
    tag: "full profile ▼",
    button: true,
  },
];

const trophies = [
  {
    src: "/bronze.png",
    label: "Bronze",
    height: "h-32",
    textColor: "text-green-500",
  },
  { src: "/bronze.png", label: "Silver", height: "h-44" },
  { src: "/bronze.png", label: "Gold", height: "h-52" },
];

const JobProfile = () => {
  return (
    <>
      {/* User Info */}
      <div className="bg-gray-50 -mt-5 p-4 rounded-md shadow-sm">
        <h1 className="text-xl font-semibold text-black">Ahsan Raza</h1>
        <p className="text-xs text-gray-600 font-medium">Tazwell</p>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm text-gray-700">
          <div className="flex items-center space-x-2 mt-1">
            <Mail className="w-4 h-4 text-green-600" />
            <span>Email: user@hotmail.com</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Phone className="w-4 h-4 text-green-600" />
            <span>phone: 022 4659981</span>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="p-6 grid bg-gray-50 mt-10 grid-cols-1 md:grid-cols-2 gap-6">
        {profileCards.map((item, index) => (
          <div key={index} className={`w-[350px] ${item.className || ""}`}>
            <h2
              className={`font-semibold text-2xl mb-2 ${
                item.heading.includes("Silver") ? "text-3xl" : ""
              }`}
            >
              {item.heading}
            </h2>
            <div className="border rounded-md p-4">
              <p className="text-sm">{item.tag}</p>
              <p className="text-sm text-gray-600 mt-1">
                {item.content.split(" ").map((word, i) =>
                  i > 0 && i % 7 === 0 ? (
                    <>
                      <br />
                      {word}{" "}
                    </>
                  ) : (
                    word + " "
                  )
                )}
              </p>
              {item.button && <Button className="mt-5" title="Add Summary" />}
            </div>
          </div>
        ))}

        {/* Static Salary Guide */}
        <div className="w-[350px] md:col-span-2">
          <h2 className="font-semibold text-2xl mb-2">Salary guide</h2>
          <div className="border rounded-md p-4">
            <p className="text-sm text-gray-600">
              A snapshot of salary trends for jobs <br /> across NZ.
            </p>
            <p className="text-green-500 text-sm mt-2 cursor-pointer">
              View now →
            </p>
          </div>
        </div>

        {/* Trophies */}
        <div className="col-span- -mt-72 h-[400px] md:col-span-2 w-[300px] ml-[500px]">
          <div className="flex justify-center gap-14 items-end">
            {trophies.map((trophy, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={trophy.src}
                  alt={trophy.label}
                  className={trophy.height}
                />
                <p
                  className={`text-sm font-medium mt-2 ${
                    trophy.textColor || ""
                  }`}
                >
                  {trophy.label}
                </p>
              </div>
            ))}
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full mt-6">
            <div className="w-1/3 h-full bg-green-500 rounded-full" />
          </div>
        </div>
      </div>
      {/* skills section */}
      <div className="bg-gray-50 px-5  mt-10 pt-14">
        <h1 className="text-2xl font-semibold mb-10">Edit delivery address</h1>

        <div className="border rounded-md p-6 w-[900px] mb-6 space-y-5">
          <h2 className="text-lg text-black font-medium mb-2">My next role</h2>

          {roleDetails.map((item, index) => (
            <div key={index} className="flex text-sm text-[#4B5563] mt-5">
              <span className="font-medium min-w-[250px]">{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>

        {sections.map((section, index) => (
          <div key={index} className="border w-[900px] rounded-md p-4 mb-4">
            <h2 className="text-base font-semibold mb-1">{section.title}</h2>
            <p className="text-sm w-64 text-gray-600 mb-3">
              {section.description}
            </p>
            <Button title={section.button} />
          </div>
        ))}
      </div>
    </>
  );
};

export default JobProfile;
