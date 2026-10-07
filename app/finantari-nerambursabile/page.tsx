import type { Metadata } from "next";
import PostGrid from "@/components/PostGrid";
import { postList } from "@/lib/lists";

export const metadata: Metadata = { title: "Finanțări nerambursabile" };

export default function FundingPage() {
  return <PostGrid list={postList("/finantari-nerambursabile/")} more />;
}
