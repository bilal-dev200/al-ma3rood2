import LayoutWrapper from "@/components/LayoutWrapper";
import Sidebar from "@/components/WebsiteComponents/ReuseableComponenets/Sidebar";

export const metadata = {
  title: "Account | Ma3rood",
  description: "Account page for Ma3rood",
};

export default function ProfileLayout({ children }) {
  return (
    <LayoutWrapper>
      <div className="flex items-start px-3 sm:px-5 md:px-7 text-black">
        <Sidebar />
        <div className="p-1 sm:p-4 md:p-5 w-full">{children}</div>
      </div>
    </LayoutWrapper>
  );
}
