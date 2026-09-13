import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { AiBadge } from "./ai-badge";
import { PostTitle } from "@/app/_components/post-title";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  aiAssisted?: boolean;
};

export function PostHeader({ title, coverImage, date, aiAssisted }: Props) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-12"></div>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} src={coverImage} />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6"></div>
        <div className="mb-6 flex flex-wrap items-center gap-3 text-lg">
          <DateFormatter dateString={date} />
          {aiAssisted && <AiBadge />}
        </div>
      </div>
    </>
  );
}
