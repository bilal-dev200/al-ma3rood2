import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import Toaster from "@/components/WebsiteComponents/Toaster";
import AuthCleanup from "@/lib/common/AuthCleanup";
import FeedbackButton from "@/components/WebsiteComponents/FeedbackForm/FeedbackButton";
import FontSync from "@/components/WebsiteComponents/FontSync";

export const metadata = {
  title: "Ma3rood",
  description: "Ma3rood - The Kingdom's marketplace for everything from household items and cars to homes, jobs, and services.",
other: {
    "google-site-verification": "QOcVF2O0EwymmQj0mtALBvLdFn8PN1QjHWk2pIKwaME",
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("i18next")?.value || "en";
  const dir = lang === "ar" ? "rtl" : "ltr";
  return (
    <html lang="en" dir={dir}>
      <head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places,geometry`}
          async
          defer
        />
      </head>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
        className={`${lang === "ar" ? "font-Amiri" : "font-Poppins"} antialiased min-h-screen bg-gray-50`}
      >
        <FontSync />
        <Toaster />
        <AuthCleanup />
        {children}
        <FeedbackButton />
      </body>
    </html>
  );
}