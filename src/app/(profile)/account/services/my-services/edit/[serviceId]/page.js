import EditServiceForm from "./EditServiceForm";

export const metadata = {
  title: "Edit Service | Ma3rood",
  description: "Edit your service listing on Ma3rood.",
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <EditServiceForm serviceId={resolvedParams.serviceId} />;
}

