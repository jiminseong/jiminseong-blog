type Props = {
  className?: string;
};

// 초안 작성에 생성형 AI를 활용한 글에 붙는 표식.
// "AI가 썼다"가 아니라 "보조로 썼다"는 관계가 읽히도록 문구를 잡았다.
export function AiBadge({ className = "" }: Props) {
  return (
    <span
      title="초안 작성에 생성형 AI를 활용하고, 사람이 확인한 뒤 게시한 글입니다."
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-300/70 px-2 py-0.5 align-middle text-[11px] font-medium leading-none text-slate-600 dark:border-slate-600/70 dark:text-slate-300 ${className}`}
    >
      <span aria-hidden>✦</span>
      AI 보조
    </span>
  );
}
