import Link from "next/link";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { AiBadge } from "./ai-badge";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  aiAssisted?: boolean;

  slug: string;
};

export function PostPreview({ title, coverImage, date, excerpt, slug, aiAssisted }: Props) {
  return (
    <div>
      <div className="mb-5">
        <CoverImage slug={slug} title={title} src={coverImage} />
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link href={`/posts/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="text-lg mb-4 flex flex-wrap items-center gap-3">
        <DateFormatter dateString={date} />
        {aiAssisted && <AiBadge />}
      </div>
      <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
    </div>
  );
}
