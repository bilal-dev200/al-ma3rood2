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
    <html lang={lang} dir={dir}>
      <head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places,geometry`}
          async
          defer
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NM7L7RJ4');`,
          }}
        />
      </head>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
        className={`${lang === "ar" ? "font-Amiri" : "font-Poppins"} antialiased min-h-screen bg-gray-50`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NM7L7RJ4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof Node === 'function' && Node.prototype) {
                const originalRemoveChild = Node.prototype.removeChild;
                Node.prototype.removeChild = function(child) {
                  if (child.parentNode !== this) {
                    if (console) {
                      console.error('Cannot remove a child from a different parent', child, this);
                    }
                    return child;
                  }
                  return originalRemoveChild.apply(this, arguments);
                }
                 const originalInsertBefore = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function(newNode, referenceNode) {
                  if (referenceNode && referenceNode.parentNode !== this) {
                    if (console) {
                      console.error('Cannot insert before a reference node from a different parent', referenceNode, this);
                    }
                    return newNode;
                  }
                  return originalInsertBefore.apply(this, arguments);
                }
              }
            `,
          }}
        />
        <FontSync />
        <Toaster />
        <AuthCleanup />
        {children}
        <FeedbackButton />
      </body>
    </html>
  );
}