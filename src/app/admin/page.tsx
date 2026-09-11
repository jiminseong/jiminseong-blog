import type { Metadata } from "next";
import Container from "@/app/_components/container";
import { AdminPanel } from "./admin-panel";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main>
      <Container>
        <section className="mx-auto max-w-md py-24">
          <h1 className="mb-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            관리자 로그인
          </h1>
          <p className="mb-8 text-sm text-neutral-500 dark:text-neutral-400">
            블로그 작성자 전용 페이지입니다. 로그인하면 댓글에 작성자 배지가
            붙고 댓글을 관리할 수 있습니다.
          </p>
          <AdminPanel />
        </section>
      </Container>
    </main>
  );
}
