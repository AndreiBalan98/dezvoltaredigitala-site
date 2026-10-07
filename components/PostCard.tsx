import Image from "next/image";
import Link from "next/link";
import { roDate, type Entry } from "@/lib/content";
import Card from "./Card";

export type CardImage = { src: string; width: number; height: number };

// A post teaser — date, title, image, excerpt — on the home funding section and the post lists (spec 004).
export default function PostCard({
  post,
  image,
  excerpt,
  more = false,
  heading: Heading = "h3",
  sizes = "(max-width: 900px) 100vw, 50vw",
}: {
  post: Entry;
  image: CardImage;
  excerpt?: string;
  more?: boolean;
  heading?: "h2" | "h3";
  sizes?: string;
}) {
  return (
    <Card className="teaser">
      <Link className="teaser__image" href={post.path} tabIndex={-1} aria-hidden="true">
        <Image src={image.src} alt="" width={image.width} height={image.height} sizes={sizes} />
      </Link>
      <Heading>
        <Link href={post.path}>{post.title}</Link>
      </Heading>
      <p className="teaser__date">
        <time dateTime={post.date}>{roDate(post.date)}</time>
      </p>
      {excerpt && <p>{excerpt}</p>}
      {more && (
        <Link className="teaser__more" href={post.path}>
          Citește mai mult
        </Link>
      )}
    </Card>
  );
}
