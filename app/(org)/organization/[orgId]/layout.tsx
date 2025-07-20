import Footer from "@/components/Footer";
import Header from "../../components/Header";
import { OrgByIdProvider } from "@/context/orgByIdProvider";
import {
  getCurrentUserOrg,
  getOrganizationBySlug,
} from "@/actions/organization";
import { GetProjectsProvider } from "@/context/getProjectsProvider";
import { getProjectsByOrgId } from "@/actions/project";
import { OrgUserProvider } from "@/context/OrgUserProvider";
const OrgLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) => {
  const { orgId } = await params;
  const org = await getOrganizationBySlug(orgId);

  const projects = await getProjectsByOrgId(org?.id);
  const orgUser = await getCurrentUserOrg(org?.id);
  // console.log(projects);
  // console.log(orgUser?.role);

  return (
    <>
      <Header />
      <OrgUserProvider orgUser={orgUser}>
        <OrgByIdProvider org={org}>
          <GetProjectsProvider projects={projects}>
            <main className="min-h-screen pt-20">{children}</main>
          </GetProjectsProvider>
        </OrgByIdProvider>
      </OrgUserProvider>
      <Footer />
    </>
  );
};

export default OrgLayout;
