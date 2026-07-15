import { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "지민성 | Resume",
  description: "지민성 이력서. 프론트엔드·프로덕트. 손쉬운 운동기록 App Store 출시·운영 중.",
  openGraph: {
    title: "지민성 | Resume",
    description: "지민성 이력서. 프론트엔드·프로덕트. 손쉬운 운동기록 App Store 출시·운영 중.",
    images: ["/assets/blog/author/profile.png"],
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-bold tracking-tight border-b border-slate-300/50 dark:border-slate-700/60 pb-2 mb-5">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Entry({
  title,
  period,
  sub,
  children,
}: {
  title: string;
  period?: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="font-semibold">{title}</h3>
        {period && (
          <span className="text-sm text-slate-500 dark:text-slate-400">{period}</span>
        )}
      </div>
      {sub && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>}
      {children && (
        <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed list-disc pl-5">
          {children}
        </ul>
      )}
    </div>
  );
}

export default function Resume() {
  const linkClass =
    "underline underline-offset-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors";

  return (
    <main>
      <Container>
        <Header />
        <div className="max-w-3xl mx-auto">
          <section className="mt-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tighter leading-tight mb-4">지민성</h1>
            <p className="text-lg mb-4">
              현장에서 문제를 찾고, 직접 만들어 검증하며 운영까지 책임지는 사람
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
              <a href="mailto:iamjms4237@gmail.com" className={linkClass}>
                iamjms4237@gmail.com
              </a>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                GitHub
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                LinkedIn
              </a>
              <Link href="/" className={linkClass}>
                Blog
              </Link>
              <Link href="/portfolio" className={linkClass}>
                포트폴리오 보기
              </Link>
            </div>
          </section>

          <Section title="경력">
            <Entry
              title="휴머너 — 프론트엔드 개발 인턴"
              period="2025.08 – 2026.01"
              sub="AI 포토부스 키오스크 스타트업"
            >
              <li>
                어드민 대시보드 문제를 발견해 제안하고 풀스택으로 단독 구현(Sentry·Posthog).{" "}
                <b>10개+</b> 행사 무중단 운영 — G-Dragon 애프터파티, 삼성전자 SAIT, 뉴발란스,
                DDP, 코엑스.
              </li>
              <li>
                현장 NPS를 직접 수집해 키오스크 외관 재질 개선을 제안. 대여 비용 <b>75%</b>{" "}
                감축, B2B 첫 월 매출 <b>xxxx만원</b> 기여.
              </li>
              <li>
                홈페이지 구축과 문의 채널 통합(채널톡·Notion·Slack webhook)으로 문의 대응{" "}
                <b>3시간→30분(-83%)</b>, 연 <b>400만원</b> 인건비 절감.
              </li>
            </Entry>
          </Section>

          <Section title="프로젝트">
            <Entry
              title="손쉬운 운동기록"
              period="운영 중"
              sub="헬스 운동일지 앱 · App Store 출시 · 기획·디자인·개발·운영 1인"
            >
              <li>
                AIM이라는 슈퍼앱 가설로 시작해 개밥먹기로 반증을 발견하고, 모노레포 기반{" "}
                <b>2개</b> 앱으로 분리하는 피벗을 거쳐 출시. 마케팅 비용 <b>0원</b>, 출시{" "}
                <b>20일</b> 만에 App Store 누적 다운로드 <b>4→191</b>. 절반은 해외{" "}
                <b>16개국</b>에서 받았다.
              </li>
              <li>
                <b>295개</b> 운동 카탈로그, <b>6개</b> 언어 지원. 실사용자 운영 중.
              </li>
              <li>
                Expo(React Native)·TypeScript·SQLite 로컬 퍼스트. iOS Live Activity 위젯을
                Swift 네이티브 모듈로 구현. App Store Connect API로 출시 자동화.
              </li>
            </Entry>
            <Entry title="공일" sub="대학생 공모전 정보 플랫폼 · 운영 중">
              <li>
                Next.js·Supabase·Vercel. 주 <b>1회</b> Claude 에이전트 크롤링·검수 파이프라인으로
                콘텐츠 갱신.
              </li>
            </Entry>
            <Entry title="우이미 (wooimi.com)" sub="경기 볼런톤 수상작 · 팀장 · 서비스 운영">
              <li>문제정의·프로모션 설계·협찬 유치(minop, Jerrybag 등)·발표 3회 주도.</li>
            </Entry>
            <Entry title="SafeComment" sub="크롬 익스텐션 · 크롬 웹스토어 출시">
              <li>무한태그 #21 1위 (39명 중).</li>
            </Entry>
          </Section>

          <Section title="수상">
            <Entry
              title="GDG Daejeon Build with AI Hackathon 3위"
              period="2026.05"
              sub="GDG Daejeon · 53명 중 · 개인"
            >
              <li>
                4시간 단독 참가. 가족 일상 공유 앱 &lsquo;우일아&rsquo;를 기획·개발.
                Design·Frontend·Backend·Presentation 역할의 Claude Code 에이전트를 병렬 운영.
              </li>
            </Entry>
            <Entry
              title="GDG Busan Build with AI Hackathon 1위"
              period="2026.04"
              sub="GDG Busan · 86명 중 · 개인"
            />
            <Entry
              title="경기 볼런톤 경기도지사상 1위"
              period="2025.08"
              sub="경기도자원봉사센터 · 16팀 80명 중 · 팀장"
            />
            <Entry
              title="제천트래블리그 3위 (제천시장상)"
              period="2024.11"
              sub="제천시 · 100팀 중 · 개인 · 8개월"
            />
            <Entry title="JUST DO IT 2024 최우수" period="2024" sub="78명 중 · 개인" />
            <Entry
              title="AI와 100인의 용사들 1위 (AI특공대상)"
              period="2024.06"
              sub="스파르타 코딩클럽 · 25팀 중 · 팀 · 참여자 100명 투표 1위"
            />
            <Entry title="무한태그 #21 1위" sub="39명 중" />
            <Entry
              title="반지하 활용방안 아이디어 시민 공모전 금상 (2위)"
              period="2023.12"
              sub="서울주택도시공사 · 개인"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              2년간 <b>30개+</b> 공모전 도전, <b>25개</b> 수상.
            </p>
          </Section>

          <Section title="교육·활동">
            <Entry title="2025 Daangn Builder's Camp 수료" sub="LocalPing 기획·개발" />
            <Entry title="Claude Code 입문 강의·집필" sub="유리프트" />
          </Section>

          <Section title="스킬">
            <ul className="space-y-1.5 text-[15px] leading-relaxed list-disc pl-5">
              <li>프로덕트: 현장 인터뷰·NPS·UT, 가설→검증→피벗 사이클, Posthog·Sentry 데이터 기반 의사결정</li>
              <li>빌드: TypeScript, React, Next.js, React Native, Supabase, PWA, SQL(SQLD 준비)</li>
              <li>AI: Claude Code Skill·Hook 개발 자동화</li>
            </ul>
          </Section>
        </div>
      </Container>
    </main>
  );
}
