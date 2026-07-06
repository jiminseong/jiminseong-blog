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

function SectionTitle({
  eyebrow,
  eyebrowClass,
  caption,
  children,
}: {
  eyebrow: string;
  eyebrowClass: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className={`text-xs font-semibold tracking-widest uppercase mb-1.5 ${eyebrowClass}`}>
        {eyebrow}
      </p>
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{children}</h2>
        {caption && <span className="text-sm text-slate-500 dark:text-slate-400">{caption}</span>}
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-sm text-violet-700 dark:text-violet-300">
      {children}
    </span>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-slate-300/50 dark:border-slate-700/60 bg-[var(--bg-elev)] p-5 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function FieldLabel({ tone, children }: { tone: "rose" | "amber" | "emerald"; children: string }) {
  const toneClass = {
    rose: "text-rose-600 dark:text-rose-400",
    amber: "text-amber-600 dark:text-amber-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  }[tone];
  return <dt className={`text-xs font-semibold tracking-wide ${toneClass}`}>{children}</dt>;
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

/* 피벗 전후 App Store 누적 다운로드. ASC 앱 분석 > 앱 설치(App Units) 기준. */
const DOWNLOADS = [
  { label: "AIM (통합 앱)", value: 4 },
  { label: "손쉬운 운동기록", value: 191 },
];

function DownloadChart() {
  const max = Math.max(...DOWNLOADS.map((d) => d.value));
  return (
    <div className="space-y-3">
      {DOWNLOADS.map((d) => (
        <div key={d.label}>
          <div className="flex items-baseline justify-between text-sm mb-1">
            <span>{d.label}</span>
            <span className="font-bold text-violet-700 dark:text-violet-300">{d.value}</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-300/40 dark:bg-slate-700/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400 dark:from-violet-400 dark:to-violet-300"
              style={{ width: `${Math.max((d.value / max) * 100, 2)}%` }}
            />
          </div>
        </div>
      ))}
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
  rank: string;
  rankClass: string;
  detail: string;
  desc: string;
};

const AWARD_RANK = {
  gold: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  bronze: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  violet: "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  carrot: "border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

const AWARDS: Award[] = [
  {
    title: "GDG Busan Build with AI Hackathon",
    rank: "1위",
    rankClass: AWARD_RANK.gold,
    detail: "86명 중 · 2026.04 · 개인",
    desc: "심사 기준을 역산해 역방향으로 가설을 세우고, Claude Code Agent Teams로 기획부터 발표까지 전 과정을 단독 수행.",
  },
  {
    title: "경기 볼런톤 경기도지사상",
    rank: "1위",
    rankClass: AWARD_RANK.gold,
    detail: "16팀 80명 중 · 팀장",
    desc: "문제정의·프로모션 설계·협찬 유치(minop, Jerrybag 등)·발표 3회 주도. 서비스 wooimi.com 운영.",
  },
  {
    title: "제천트래블리그 제천시장상",
    rank: "3위",
    rankClass: AWARD_RANK.bronze,
    detail: "100팀 중 · 개인 · 8개월",
    desc: "지역 관광 도우미 앱을 기획·개발해 제천시장상 수상. OpenAI API 활용.",
  },
  {
    title: "2025 Daangn Builder's Camp",
    rank: "수료",
    rankClass: AWARD_RANK.carrot,
    detail: "당근 주관",
    desc: "동네 기반 서비스 LocalPing을 기획·개발.",
  },
  {
    title: "JUST DO IT 2024",
    rank: "최우수",
    rankClass: AWARD_RANK.violet,
    detail: "78명 중 · 개인",
    desc: "부모님 고깃집의 전자메뉴판을 Flutter로 제작.",
  },
  {
    title: "무한태그 #21",
    rank: "1위",
    rankClass: AWARD_RANK.gold,
    detail: "39명 중",
    desc: "SafeComment 크롬 익스텐션 개발, 크롬 웹스토어 출시.",
  },
  {
    title: "AI와 100인의 용사들",
    rank: "1위",
    rankClass: AWARD_RANK.gold,
    detail: "25팀 중",
    desc: "참여자 100명 투표 1위.",
  },
];

const STAGE = {
  live: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  prep: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  ing: "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

type Product = {
  name: string;
  tagline: string;
  stage: { label: string; className: string };
  rows: { label: string; content: React.ReactNode }[];
};

const PRODUCTS: Product[] = [
  {
    name: "공일",
    tagline: "대학생 공모전 정보 플랫폼",
    stage: { label: "운영 중", className: STAGE.live },
    rows: [
      {
        label: "자동화",
        content: (
          <>
            주 <b>1회</b> Claude 에이전트가 공모전을 크롤링·검수해 PR로 제안하고, 사람이 확인 후
            반영. 공모전별 AI 심사 분석 콘텐츠도 자동 생성(멤버 일 <b>10회</b> 무료 열람).
          </>
        ),
      },
      {
        label: "기술",
        content: "Next.js 16 · React 19 · Supabase(Edge Function) · Vercel · llms.txt/RSS",
      },
    ],
  },
  {
    name: "도파민프리",
    tagline: "습관 끊기 라이브 타이머 앱",
    stage: { label: "출시 준비", className: STAGE.prep },
    rows: [
      {
        label: "자동화",
        content: (
          <>
            App Store Connect API 출시 파이프라인, <b>10개</b> 언어 스토어 메타데이터 자동화.
          </>
        ),
      },
      {
        label: "기술",
        content: "Expo · SQLite 로컬 퍼스트 · 익명 Amplitude(개인정보 미수집)",
      },
    ],
  },
  {
    name: "손쉬운 투두",
    tagline: "AIM 모노레포에서 분리한 두 번째 앱",
    stage: { label: "출시 준비", className: STAGE.prep },
    rows: [
      {
        label: "자동화",
        content: (
          <>
            vitest·Playwright·knip 품질 게이트. 언어별 홈 화면 앱 이름까지 <b>10개</b> 언어
            자동화.
          </>
        ),
      },
      {
        label: "기술",
        content: "Expo · Electron(macOS) · 웹 동시 대응",
      },
    ],
  },
  {
    name: "우정파괴봇",
    tagline: "카카오톡 그룹채팅 심리 게임",
    stage: { label: "운영 중", className: STAGE.live },
    rows: [
      {
        label: "기술",
        content: "Cloudflare Workers · D1 · 카카오 스킬 서버 · 빌드리스 정적 웹뷰",
      },
    ],
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
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              2년간 <b>30개+</b> 공모전 도전, <b>25개</b> 수상 · 풀스택으로 기획-개발-운영까지
              혼자 완결
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
              TypeScript · React · Next.js · React Native(Expo) · Supabase · Electron ·
              Cloudflare Workers
            </p>
            <ContactLinks />
          </section>

          {/* 2. 대표 프로덕트 */}
          <section className="mb-20">
            <SectionTitle
              eyebrow="대표 프로덕트"
              eyebrowClass="text-violet-600 dark:text-violet-400"
              caption="프로젝트 AIM에서 피벗"
            >
              손쉬운 운동기록
            </SectionTitle>
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
            <div className="grid gap-4">
              <Card>
                <h3 className="font-semibold mb-3 text-[15px]">
                  가설 → 반증 → 피벗
                </h3>
                <ol className="space-y-3 text-[15px] leading-relaxed">
                  <li>
                    <span className="font-bold text-violet-600 dark:text-violet-400 mr-2">1</span>
                    AIM이라는 슈퍼앱 가설(운동·식단·투두 통합 → 리텐션 향상)로 시작했다.
                  </li>
                  <li>
                    <span className="font-bold text-violet-600 dark:text-violet-400 mr-2">2</span>
                    개밥먹기로 반증을 발견했다. &lsquo;투두&rsquo;는 앱 간 연결을 정당화할
                    접착력이 부족했고, 통합 UX가 오히려 도메인 집중도를 낮췄다.
                  </li>
                  <li>
                    <span className="font-bold text-violet-600 dark:text-violet-400 mr-2">3</span>
                    모노레포 기반 <b>2개</b> 앱으로 분리하는 피벗을 결정했다. 공통
                    컴포넌트·로직·서버를 공유한다.
                  </li>
                  <li>
                    <span className="font-bold text-violet-600 dark:text-violet-400 mr-2">4</span>
                    그 첫 결과물이 &lsquo;손쉬운 운동기록&rsquo;. 현재 App Store에서 실사용자를
                    운영 중이다.
                  </li>
                </ol>
              </Card>
              <Card>
                <h3 className="font-semibold mb-1 text-[15px]">피벗 후 지표</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  App Store 누적 다운로드 · 2026.06.16 출시
                </p>
                <DownloadChart />
                <p className="mt-4 text-sm leading-relaxed">
                  같은 앱을 통합 대신 단일 도메인으로 좁힌 결과, 마케팅 비용 <b>0원</b>에
                  오가닉만으로 출시 <b>20일</b> 만에 누적 다운로드 <b>4→191</b>. 다운로드와
                  실사용 지표는 증가 중이다.
                </p>
              </Card>
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-600 text-white hover:bg-violet-500 dark:bg-violet-400 dark:text-slate-900 dark:hover:bg-violet-300 transition-colors"
              >
                <FaAppStoreIos aria-hidden /> App Store에서 보기
              </ExternalLink>
              <ExternalLink
                href="https://workout-log-phi-weld.vercel.app"
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
            <SectionTitle
              eyebrow="실무 경험"
              eyebrowClass="text-sky-600 dark:text-sky-400"
              caption="프론트엔드 개발 인턴 · 2025.08~12"
            >
              휴머너
            </SectionTitle>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              AI 포토부스 키오스크 스타트업.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {HUMANER_CARDS.map((card) => (
                <Card key={card.title}>
                  <h3 className="font-semibold mb-3">{card.title}</h3>
                  <dl className="space-y-2.5 text-sm leading-relaxed">
                    <div>
                      <FieldLabel tone="rose">문제</FieldLabel>
                      <dd>{card.problem}</dd>
                    </div>
                    <div>
                      <FieldLabel tone="amber">가설</FieldLabel>
                      <dd>{card.hypothesis}</dd>
                    </div>
                    <div>
                      <FieldLabel tone="emerald">성과</FieldLabel>
                      <dd>{card.result}</dd>
                    </div>
                  </dl>
                </Card>
              ))}
            </div>
          </section>

          {/* 4. 수상 하이라이트 */}
          <section className="mb-20">
            <p className="text-xs font-semibold tracking-widest uppercase mb-1.5 text-amber-600 dark:text-amber-400">
              수상
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">수상 하이라이트</h2>
              <span className="px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-sm text-amber-700 dark:text-amber-400">
                <b>30+</b> 도전 · <b>25</b> 수상
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {AWARDS.map((award) => (
                <Card key={award.title}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold leading-snug">{award.title}</h3>
                    <span
                      className={`shrink-0 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${award.rankClass}`}
                    >
                      {award.rank}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-2">
                    {award.detail}
                  </p>
                  <p className="text-sm leading-relaxed">{award.desc}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* 5. 프로덕트 & 활동 */}
          <section className="mb-20">
            <SectionTitle
              eyebrow="프로덕트 & 활동"
              eyebrowClass="text-emerald-600 dark:text-emerald-400"
            >
              그 외 만들고 운영하는 것들
            </SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {PRODUCTS.map((product) => (
                <Card key={product.name}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold leading-snug">{product.name}</h3>
                    <span
                      className={`shrink-0 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${product.stage.className}`}
                    >
                      {product.stage.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">
                    {product.tagline}
                  </p>
                  <dl className="space-y-2.5 text-sm leading-relaxed">
                    {product.rows.map((row) => (
                      <div key={row.label}>
                        <dt className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
                          {row.label}
                        </dt>
                        <dd>{row.content}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              ))}
            </div>
          </section>

          {/* 6. 푸터 */}
          <footer className="border-t border-slate-300/50 dark:border-slate-700/60 pt-8">
            <ContactLinks />
          </footer>
        </div>
      </Container>
    </main>
  );
}
