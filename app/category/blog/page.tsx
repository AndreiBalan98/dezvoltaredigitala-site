import type { Metadata } from "next";
import PostGrid from "@/components/PostGrid";
import { postList } from "@/lib/lists";

export const metadata: Metadata = { title: "Blog" };

export default function BlogCategoryPage() {
  return <PostGrid list={postList("/category/blog/")} />;
}
