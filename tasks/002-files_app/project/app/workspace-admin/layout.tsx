import { useUserEmail } from "@/components/WithUserEmail";
import { useUserByEmail } from "@/testData";
import { redirect } from "next/navigation";

export default function WorkspaceAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = useUserEmail();
  const user = useUserByEmail(email);
  if (!user) {
    console.error("User not found");
    redirect("/");
  }
  if (!user.isAdmin) {
    console.error("User is not an admin");
    redirect("/");
  }
  return <div>{children}</div>;
}
