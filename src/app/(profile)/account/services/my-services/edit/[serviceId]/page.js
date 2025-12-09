import EditServiceForm from "./EditServiceForm";

export const metadata = {
  title: "Edit Service | Ma3rood",
  description: "Edit your service listing on Ma3rood.",
};

export default function Page({ params }) {
  return <EditServiceForm serviceId={params.serviceId} />;
}

