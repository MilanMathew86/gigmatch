import { OpportunityDetailClient } from "@/components/provider/OpportunityDetailClient";

export default async function OpportunityDetailPage({ params }: PageProps<"/provider/opportunities/[id]">) {
  const { id } = await params;
  return <OpportunityDetailClient opportunityId={id} />;
}
