// 본문 끝에 붙는 AI 활용 고지.
// 역할(초안)과 검증 주체(사람)를 함께 밝혀야 신뢰가 깎이지 않는다.
export function AiDisclosure() {
  return (
    <aside className="mx-auto mt-16 max-w-2xl">
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
        <p className="mb-1 font-medium text-slate-700 dark:text-slate-200">AI 활용 고지</p>
        <p className="leading-relaxed">
          이 글은 초안 작성에 생성형 AI를 활용했습니다. 내용과 자료는 제가 직접 확인한 뒤
          게시했습니다.
        </p>
      </div>
    </aside>
  );
}
