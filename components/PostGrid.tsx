import type { PostList } from "@/lib/lists";
import PostCard from "./PostCard";

// A post list page — funding page, blog category, author archive (spec 004): the live title, then the
// live cards in the live order, three per row on wide screens.
export default function PostGrid({ list, more = false }: { list: PostList; more?: boolean }) {
  return (
    <section className="section post-list">
      <div className="container">
        <h1 className="page-title">{list.title}</h1>
        <div className="grid-3">
          {list.cards.map((card) => (
            <PostCard
              key={card.post.slug}
              post={card.post}
              image={card.image}
              excerpt={card.excerpt}
              more={more}
              heading="h2"
              sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 400px"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
