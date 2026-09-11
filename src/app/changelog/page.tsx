import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import markdownToHtml from "@/lib/markdownToHtml";
import pkg from "../../../package.json";

export const metadata: Metadata = {
  title: `버전 기록 | Jiminseong Blog.`,
  description: "jiminseong.com 릴리스 기록",
};

export default async function ChangelogPage() {
  const raw = await fs.readFile(path.join(process.cwd(), "CHANGELOG.md"), "utf8");
  // 파일 첫 줄의 '# Changelog' 제목은 페이지 제목으로 대체
  const body = raw.replace(/^# .*\n/, "");
  const html = await markdownToHtml(body);

  return (
    <main>
      <Container>
        <Header />
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex flex-wrap items-baseline gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">버전 기록</h1>
            <span className="text-sm text-slate-500 dark:text-slate-400">현재 v{pkg.version}</span>
          </div>
        </div>
        <PostBody content={html} />
      </Container>
    </main>
  );
}
