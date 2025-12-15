"use client";

import { usePathname } from "next/navigation";
import Navbar from "./WebsiteComponents/Navbar";
import Footer from "./WebsiteComponents/Footer";
import '../../i18n.js';
// import Navbar from "@/components/WebsiteComponents/Navbar";
// import Footer from "@/components/WebsiteComponents/Footer";

export default function LayoutWrapper({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
