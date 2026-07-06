import Link from "next/link";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";

export default function NotFound() {
  return (
    <main>
      <Container>
        <Header />
        <section className="mt-24 mb-32 text-center">
          <p className="text-6xl font-bold tracking-tighter mb-4">404</p>
          <p className="text-slate-600 dark:text-slate-400 mb-8">페이지를 찾을 수 없습니다.</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-full border border-slate-300/60 text-sm text-slate-600 hover:border-slate-400/70 dark:border-slate-700/70 dark:text-slate-300 dark:hover:border-slate-500 transition-colors"
          >
            홈으로 가기
          </Link>
        </section>
      </Container>
    </main>
  );
}
