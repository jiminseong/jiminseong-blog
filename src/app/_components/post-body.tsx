import markdownStyles from "./markdown-styles.module.css";
import { CopyCode } from "./copy-code";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  return (
    <div className="max-w-2xl mx-auto" data-post-body>
      <div className={markdownStyles["markdown"]} dangerouslySetInnerHTML={{ __html: content }} />
      <CopyCode />
    </div>
  );
}
