import type { Metadata } from "next";
import PostGrid from "@/components/PostGrid";
import { postList } from "@/lib/lists";

export const metadata: Metadata = { title: "Autor: admin" };

export default function AuthorPage() {
  return <PostGrid list={postList("/author/dezvoltarev2/")} />;
}
