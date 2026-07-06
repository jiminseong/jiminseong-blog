import { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { FaGithub, FaLinkedin, FaEnvelope, FaGlobe, FaAppStoreIos } from "react-icons/fa";
import { SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "지민성 | Product Portfolio",
  description:
    "현장에서 문제를 찾고, 직접 만들어 검증하며 운영까지 책임지는 사람. 손쉬운 운동기록 App Store 출시·운영 중.",
  openGraph: {
    title: "지민성 | Product Portfolio",
    description:
      "현장에서 문제를 찾고, 직접 만들어 검증하며 운영까지 책임지는 사람. 손쉬운 운동기록 App Store 출시·운영 중.",
    images: ["/assets/blog/author/profile.png"],
  },
};

const APP_STORE_URL =
  "https://apps.apple.com/us/app/%EC%86%90%EC%89%AC%EC%9A%B4-%EC%9A%B4%EB%8F%99%EA%B8%B0%EB%A1%9D-%ED%97%AC%EC%8A%A4-%EC%9A%B4%EB%8F%99%EC%9D%BC%EC%A7%80/id6780981197?l=ko";

function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

function SectionTitle({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2 mb-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{children}</h2>
      {caption && (
        <span className="text-sm text-slate-500 dark:text-slate-400">{caption}</span>
      )}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full border border-slate-300/60 text-sm text-slate-600 dark:border-slate-700/70 dark:text-slate-300">
      {children}
    </span>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-300/50 dark:border-slate-700/60 bg-[var(--bg-elev)] p-5">
      {children}
    </div>
  );
}

function ContactLinks() {
  const linkClass =
    "inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors";
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <ExternalLink href={SOCIAL_LINKS.github} className={linkClass}>
        <FaGithub aria-hidden /> GitHub
      </ExternalLink>
      <ExternalLink href={SOCIAL_LINKS.linkedin} className={linkClass}>
        <FaLinkedin aria-hidden /> LinkedIn
      </ExternalLink>
      <Link href="/" className={linkClass}>
        <FaGlobe aria-hidden /> Blog
      </Link>
      <a href="mailto:iamjms4237@gmail.com" className={linkClass}>
        <FaEnvelope aria-hidden /> iamjms4237@gmail.com
      </a>
    </div>
  );
}

type WorkCard = {
  title: string;
  problem: string;
  hypothesis: string;
  result: React.ReactNode;
};

const HUMANER_CARDS: WorkCard[] = [
  {
    title: "어드민 대시보드 구축",
    problem: "행사 현장 키오스크의 상태와 에러를 원격에서 알 수 없어 장애 대응이 늦었다.",
    hypothesis: "상태·에러를 실시간으로 모으는 어드민이 있으면 무중단 운영이 가능하다.",
    result: (
      <>
        문제 발견부터 제안·풀스택 구현까지 단독 수행(Sentry·Posthog).{" "}
        <b>10개+</b> 행사 무중단 운영 — G-Dragon 애프터파티, 삼성전자 SAIT, 뉴발란스, DDP,
        코엑스.
      </>
    ),
  },
  {
    title: "키오스크 외관 개선",
    problem: "현장에서 직접 수집한 NPS에서 키오스크 외관에 대한 불만을 확인했다.",
    hypothesis: "외관 재질을 바꾸면 완성도를 유지하면서 대여 단가를 낮출 수 있다.",
    result: (
      <>
        재질 개선 제안이 채택되어 키오스크 대여 비용 <b>75%</b> 감축, B2B 첫 월 매출{" "}
        <b>500만원</b> 기여.
      </>
    ),
  },
  {
    title: "홈페이지·문의 채널 통합",
    problem: "문의가 여러 채널에 흩어져 있어 대응이 평균 3시간 걸렸다.",
    hypothesis: "홈페이지를 만들고 채널을 한 곳으로 모으면 대응 시간이 줄어든다.",
    result: (
      <>
        채널톡·Notion·Slack webhook 통합으로 문의 대응 <b>3시간→30분(-83%)</b>, 연{" "}
        <b>400만원</b> 인건비 절감.
      </>
    ),
  },
];

type Award = {
  title: string;
  detail: string;
  desc: string;
};

const AWARDS: Award[] = [
  {
    title: "GDG Busan Build with AI Hackathon 1위",
    detail: "86명 중 · 2026.04 · 개인",
    desc: "심사 기준을 역산해 역방향으로 가설을 세우고, Claude Code Agent Teams로 기획부터 발표까지 전 과정을 단독 수행.",
  },
  {
    title: "경기 볼런톤 경기도지사상 1위",
    detail: "16팀 80명 중 · 팀장",
    desc: "문제정의·프로모션 설계·협찬 유치(minop, Jerrybag 등)·발표 3회 주도. 서비스 wooimi.com 운영.",
  },
  {
    title: "제천트래블리그 3위",
    detail: "100팀 중 · 개인 · 8개월",
    desc: "지역 관광 도우미 앱을 기획·개발. OpenAI API 활용.",
  },
  {
    title: "JUST DO IT 2024 최우수",
    detail: "78명 중 · 개인",
    desc: "부모님 고깃집의 전자메뉴판을 Flutter로 제작.",
  },
  {
    title: "무한태그 #21 1위",
    detail: "39명 중",
    desc: "SafeComment 크롬 익스텐션 개발, 크롬 웹스토어 출시.",
  },
  {
    title: "AI와 100인의 용사들 1위",
    detail: "25팀 중",
    desc: "참여자 100명 투표 1위.",
  },
];

export default function Portfolio() {
  return (
    <main>
      <Container>
        <Header />
        <div className="max-w-3xl mx-auto">
          {/* 1. 히어로 */}
          <section className="mt-4 mb-20">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight mb-5">
              지민성
            </h1>
            <p className="text-xl md:text-2xl leading-snug mb-3">
              현장에서 문제를 찾고, 직접 만들어 검증하며 운영까지 책임지는 사람
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              2년간 <b>30개+</b> 공모전 도전, <b>25개</b> 수상 · 풀스택으로 기획-개발-운영까지
              혼자 완결
            </p>
            <ContactLinks />
          </section>

          {/* 2. 대표 프로덕트 */}
          <section className="mb-20">
            <SectionTitle caption="프로젝트 AIM에서 피벗">손쉬운 운동기록</SectionTitle>
            <p className="mb-4">
              헬스 운동일지 앱. App Store에 출시해 운영 중이며, 기획·디자인·개발·운영을 혼자
              담당한다.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge>App Store 출시</Badge>
              <Badge>실사용자 운영 중</Badge>
              <Badge>
                <b>295개</b> 운동 카탈로그
              </Badge>
              <Badge>
                <b>6개</b> 언어 지원
              </Badge>
            </div>
            <Card>
              <ol className="space-y-3 text-[15px] leading-relaxed">
                <li>
                  <span className="text-slate-500 dark:text-slate-400 mr-2">1</span>
                  AIM이라는 슈퍼앱 가설(운동·식단·투두 통합 → 리텐션 향상)로 시작했다.
                </li>
                <li>
                  <span className="text-slate-500 dark:text-slate-400 mr-2">2</span>
                  개밥먹기로 반증을 발견했다. &lsquo;투두&rsquo;는 앱 간 연결을 정당화할 접착력이
                  부족했고, 통합 UX가 오히려 도메인 집중도를 낮췄다.
                </li>
                <li>
                  <span className="text-slate-500 dark:text-slate-400 mr-2">3</span>
                  모노레포 기반 <b>2개</b> 앱으로 분리하는 피벗을 결정했다. 공통 컴포넌트·로직·서버를
                  공유한다.
                </li>
                <li>
                  <span className="text-slate-500 dark:text-slate-400 mr-2">4</span>그 첫 결과물이
                  &lsquo;손쉬운 운동기록&rsquo;. 현재 App Store에서 실사용자를 운영 중이다.
                </li>
              </ol>
            </Card>
            <div className="mt-4">
              <Card>
                <h3 className="font-semibold mb-3 text-[15px]">만든 방식</h3>
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li>
                    로그인·서버 없는 로컬 퍼스트. Expo(React Native)·TypeScript·SQLite. 어두운
                    헬스장에서 한 손으로 <b>3탭</b> 안에 기록하는 UX 제약을 지킨다.
                  </li>
                  <li>
                    iOS Live Activity·다이나믹 아일랜드 휴식 타이머를 Swift 네이티브 모듈로 직접
                    구현.
                  </li>
                  <li>
                    App Store Connect API로 출시 자동화 — 버전 생성, 다국어 메타데이터·스크린샷
                    업로드, 심사 제출까지 스크립트 한 줄로 처리.
                  </li>
                  <li>
                    지표는 익명 이벤트 <b>2개</b>(앱 실행, 세트 기록)만 수집하고 운동 내용은
                    전송하지 않는다. North Star는 주 <b>3회</b> 이상 기록 세션.
                  </li>
                </ul>
              </Card>
            </div>
            <div className="flex flex-wrap gap-4 mt-5 text-sm">
              <ExternalLink
                href={APP_STORE_URL}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800 text-slate-50 hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white transition-colors"
              >
                <FaAppStoreIos aria-hidden /> App Store에서 보기
              </ExternalLink>
              <ExternalLink
                href="https://aim-official.vercel.app"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300/60 text-slate-600 hover:border-slate-400/70 dark:border-slate-700/70 dark:text-slate-300 dark:hover:border-slate-500 transition-colors"
              >
                <FaGlobe aria-hidden /> 웹으로 보기
              </ExternalLink>
            </div>
            <p className="mt-5 text-slate-600 dark:text-slate-400 text-[15px]">
              가설을 세우고, 스스로 반증하고, 피벗한 결과를 스토어까지 출시해 운영한다.
            </p>
          </section>

          {/* 3. 실무 경험 */}
          <section className="mb-20">
            <SectionTitle caption="프론트엔드 개발 인턴 · 2025.08~12">휴머너</SectionTitle>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              AI 포토부스 키오스크 스타트업.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {HUMANER_CARDS.map((card) => (
                <Card key={card.title}>
                  <h3 className="font-semibold mb-3">{card.title}</h3>
                  <dl className="space-y-2 text-sm leading-relaxed">
                    <div>
                      <dt className="text-slate-500 dark:text-slate-400">문제</dt>
                      <dd>{card.problem}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 dark:text-slate-400">가설</dt>
                      <dd>{card.hypothesis}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 dark:text-slate-400">성과</dt>
                      <dd>{card.result}</dd>
                    </div>
                  </dl>
                </Card>
              ))}
            </div>
          </section>

          {/* 4. 수상 하이라이트 */}
          <section className="mb-20">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">수상 하이라이트</h2>
              <Badge>
                <b>30+</b> 도전 · <b>25</b> 수상
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {AWARDS.map((award) => (
                <Card key={award.title}>
                  <h3 className="font-semibold leading-snug">{award.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-2">
                    {award.detail}
                  </p>
                  <p className="text-sm leading-relaxed">{award.desc}</p>
                </Card>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              그 외: 2025 Daangn Builder&apos;s Camp 수료 (LocalPing 기획·개발)
            </p>
          </section>

          {/* 그 외 출시·운영 */}
          <section className="mb-20">
            <SectionTitle>그 외 만들고 운영하는 것들</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <h3 className="font-semibold leading-snug">공일</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-2">
                  대학생 공모전 정보 플랫폼 · 운영 중
                </p>
                <p className="text-sm leading-relaxed">
                  Next.js·Supabase·Vercel. 주 <b>1회</b> Claude 에이전트가 공모전을
                  크롤링·검수해 PR로 올리는 파이프라인으로 콘텐츠를 갱신한다.
                </p>
              </Card>
              <Card>
                <h3 className="font-semibold leading-snug">도파민프리</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-2">
                  습관 끊기 라이브 타이머 앱
                </p>
                <p className="text-sm leading-relaxed">
                  로그인 없는 로컬 퍼스트. <b>10개</b> 언어 스토어 대응, 출시 파이프라인 자동화.
                </p>
              </Card>
              <Card>
                <h3 className="font-semibold leading-snug">손쉬운 투두</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-2">
                  AIM 모노레포에서 분리한 두 번째 앱 · 출시 준비 중
                </p>
                <p className="text-sm leading-relaxed">
                  iOS·macOS(Electron)·웹 동시 대응. vitest·Playwright 테스트, <b>10개</b> 언어.
                </p>
              </Card>
              <Card>
                <h3 className="font-semibold leading-snug">우정파괴봇</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-2">
                  카카오톡 그룹채팅 심리 게임
                </p>
                <p className="text-sm leading-relaxed">
                  Cloudflare Workers·D1로 카카오 스킬 서버와 웹뷰를 직접 구축.
                </p>
              </Card>
            </div>
          </section>

          {/* 5. 스킬 & 방식 */}
          <section className="mb-20">
            <SectionTitle>스킬 &amp; 방식</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <h3 className="font-semibold mb-2">프로덕트</h3>
                <ul className="text-sm leading-relaxed space-y-1">
                  <li>현장 인터뷰·NPS·UT</li>
                  <li>가설→검증→피벗 사이클, PRD에 North Star·성공 기준 정의</li>
                  <li>Posthog·Sentry·Amplitude 데이터 기반 의사결정</li>
                </ul>
              </Card>
              <Card>
                <h3 className="font-semibold mb-2">빌드</h3>
                <ul className="text-sm leading-relaxed space-y-1">
                  <li>TypeScript, React, Next.js, React Native(Expo)</li>
                  <li>Supabase, PWA, Electron, Cloudflare Workers</li>
                  <li>App Store Connect API 출시 자동화, SQL(SQLD 준비)</li>
                </ul>
              </Card>
              <Card>
                <h3 className="font-semibold mb-2">AI 네이티브</h3>
                <ul className="text-sm leading-relaxed space-y-1">
                  <li>Claude Code Skill·Hook 개발 자동화</li>
                  <li>Claude 스케줄 에이전트로 콘텐츠 크롤링·검수 파이프라인 운영</li>
                  <li>Claude Code 입문 강의·집필 (유리프트)</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* 6. 푸터 */}
          <footer className="border-t border-slate-300/50 dark:border-slate-700/60 pt-8">
            <p className="mb-5 leading-relaxed">
              부모님의 고깃집에서 자라며 소상공인의 하루를 가까이서 봤습니다. 그 문제를 기술로
              푸는 일을 좋아합니다.
            </p>
            <ContactLinks />
          </footer>
        </div>
      </Container>
    </main>
  );
}
