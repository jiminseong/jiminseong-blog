# BLOG_REFRENCE.md

기준일: 2026-03-31

기준: 저장소 내 `docs/`, `frontend/`, `web/`, `supabase/` 기준 정리

용도: 블로그 글을 내 말투로 풀어쓰기 전에 보는 요약 메모

---

## 1. AIM 한 줄 정의

- AIM은 처음에는 `목표 + 실행 + 건강`을 한 흐름으로 묶는 개인용 Life OS로 출발했다.
- 지금은 그 방향을 유지하되, 실제 제품은 `AIM Productivity`와 `AIM Wellness`로 분리 운영하는 앱 패밀리 구조로 정리됐다.
- 핵심은 `브랜드는 하나`, `제품은 목적별로 분리`, `코드베이스와 운영 체계는 공통화`다.

---

## 2. 블로그에서 제일 먼저 말하면 좋은 핵심

- 처음부터 "슈퍼앱"을 만들고 싶었던 게 아니라, `개인의 실행력`을 어떻게 끊기지 않게 만들지 고민하다가 시작한 프로젝트라고 설명하면 자연스럽다.
- 초기에는 Todo, Mandalart, Workout, Nutrition을 한 앱에서 다루는 `unified` 관점이 있었다.
- 그런데 실제로 정리해보니 `생산성`과 `웰니스`는 사용 목적, 진입 맥락, 스토어 메시지, 심사 포인트가 너무 달랐다.
- 그래서 하나의 앱 안에 다 욱여넣는 대신, `Productivity`와 `Wellness`를 별도 제품처럼 분리하고, 내부적으로만 `unified`를 검증용 shell로 남겼다.
- 이 결정 이후 기획, 아키텍처, App Store 메타데이터, 릴리즈 문서, 라우트 가드, 쿼리 키까지 전부 variant 기준으로 다시 정리했다.

---

## 3. 내가 AIM을 어떻게 기획했는지

### 3-1. 출발점

- 원래 AIM의 초기 정의는 `목표, 행동, 신체, 영양을 하나의 방향으로 정렬하는 Life OS`였다.
- 협업 도구가 아니라 `개인 실행 시스템`에 더 가까운 제품으로 잡혀 있었다.
- 생산성도 결국 컨디션과 루틴에서 영향을 받고, 운동과 영양도 실행력과 연결된다고 봤기 때문에 처음엔 한 흐름으로 보려 했다.

### 3-2. 왜 분리했는지

- 실제 제품으로 다듬을수록 생산성 앱 유저와 웰니스 앱 유저의 목적이 달랐다.
- Todo / Routine / Mandalart를 찾는 사람은 `오늘 뭘 실행할지`가 중요했고,
- Workout / Nutrition / Health Profile을 쓰는 사람은 `기록 정확성`과 `변화 추적`이 더 중요했다.
- 하나의 앱으로 운영하면 기능은 많아지지만 메시지는 흐려지고, App Store 설명/스크린샷/심사 메모도 충돌하기 쉬웠다.
- 그래서 `공통 인프라는 재사용하되, 제품 범위와 서사는 앱별로 분리`하는 쪽으로 방향을 틀었다.

### 3-3. 지금의 제품 정의

- `AIM Productivity`
  - 목표를 실행 가능한 하루 단위로 쪼개고 유지하게 만드는 개인 실행 OS
  - 핵심: Todo, Routine, Mandalart
- `AIM Wellness`
  - 운동/영양/신체 데이터를 연결해 컨디션 변화를 추적하고 개선하게 만드는 개인 건강 운영 앱
  - 핵심: Workout, Nutrition, Diet Log, Health Profile
- `unified`
  - 상용 제품이 아니라 내부 개발/통합 검증용 런타임

### 3-4. 기획 원칙

- 협업보다 개인 실행 중심
- 복잡한 기능보다 입력 마찰이 낮은 구조 우선
- 제품 범위는 섞지 않고 variant 단위로 선명하게 유지
- 공개 지원 페이지, 약관, 개인정보, 계정 삭제 같은 신뢰 접점은 반드시 갖춤
- 데이터 무결성과 상태 일관성을 UI 화려함보다 먼저 챙김

---

## 4. 모노레포를 어떻게 구성했는지

### 4-1. 한 줄 요약

- AIM은 `워크스페이스 툴 중심 모노레포`라기보다, `하나의 저장소 아래 앱/웹/백엔드/문서를 함께 운영하는 실용형 모노레포`에 가깝다.
- 실제 루트에는 `pnpm-workspace`, `turbo`, `nx` 같은 통합 워크스페이스 설정은 없고, 대신 제품 경계를 디렉터리로 명확히 나눴다.

### 4-2. 루트 구조

```txt
aim-app/
├── frontend/   # Expo Router 기반 앱 (iOS / Android / Web / Electron)
├── web/        # Next.js 공개 웹/블로그/랜딩
├── supabase/   # Edge Functions, migrations, SQL tests
├── docs/       # 제품/엔지니어링/운영/릴리즈/이슈/리서치 문서
└── scripts/    # 스크린샷/시드 등 보조 스크립트
```

### 4-3. `frontend/`

- React Native + Expo Router + TypeScript 기반
- 하나의 앱 코드베이스로 `unified`, `productivity`, `wellness` 3개 variant를 운영
- variant에 따라 바뀌는 것
  - 앱 아이콘
  - bundle id / scheme
  - 노출 탭
  - 허용 라우트
  - 홈에서 보여주는 도메인 데이터
- `frontend/app.config.js`에서 variant별 앱 설정을 갈라두고,
- `frontend/src/shared/lib/appVariant.ts`와 `frontend/app/(app)/_layout.tsx`에서 라우트 가드를 건다.

### 4-4. `web/`

- Next.js App Router 기반 공개 사이트
- 역할
  - 랜딩 페이지
  - 지원 / 개인정보 / 약관 / 오픈소스 페이지
  - 기술 블로그
- 앱 비즈니스 로직과 직접 섞지 않고, `신뢰와 전환을 담당하는 별도 레이어`로 유지했다.

### 4-5. `supabase/`

- 인증, 데이터베이스, RLS, RPC, Edge Function을 담당
- 구조
  - `functions/`: 서버 책임이 필요한 흐름
  - `migrations/`: 스키마/RPC 변경
  - `tests/`: SQL 검증 스크립트
- 단순한 `BaaS 연결`이 아니라, 제품 규칙이 들어가는 서버 레이어로 사용했다.

### 4-6. `docs/`

- 문서를 루트에 쌓지 않고 `product / engineering / operations / release / incidents / research / archive`로 분리했다.
- 이 레포는 문서가 보조물이 아니라 운영 체계 그 자체에 가깝다.
- 제품 범위, 릴리즈 기준, 스토어 메타데이터, 장애 회고까지 전부 문서 기준으로 맞춰 두려고 했다.

---

## 5. 기술적으로 어떤 방식으로 묶었는지

### 5-1. 공통 런타임 + 분리된 제품 범위

- 코드베이스는 하나지만 제품 범위는 분리했다.
- 공유하는 것
  - 인증
  - 테마 / 언어 / 단위 설정
  - 공용 UI와 상태 관리 인프라
  - Supabase 연결
- 분리한 것
  - 탭 구조
  - 라우트 접근 가능 여부
  - PRD / KPI / Analytics / Marketing / Release 문서
  - App Store 메타데이터와 심사 메모

### 5-2. 데이터 접근 전략

- AIM은 `Edge only` 구조가 아니다.
- 도메인에 따라 `Edge Function + RPC + direct query`를 섞어 쓴다.
- 기준은 단순했다.
  - 트랜잭션/서버 책임이 강한 쓰기: Edge Function
  - 읽기 최적화/구조화된 조회: RPC
  - 단순 CRUD/read-heavy: direct query

### 5-3. 예시

- Todo: Edge 중심
- Mandalart: Edge 중심
- Workout 저장/삭제: Edge + RPC
- Routine CRUD / Category CRUD: direct query
- Nutrition / Diet / Health Profile: direct query

### 5-4. 상태 관리 방식

- 서버 상태: TanStack Query
- 로컬 UI 상태: 컴포넌트 state
- 선호값 상태: Zustand
- 인증 상태: `AuthProvider`
- 쿼리 키도 variant 기준으로 네임스페이스를 분리해서 Productivity와 Wellness가 캐시를 섞지 않게 했다.

---

## 6. 블로그에서 강조하기 좋은 설계 포인트

### 6-1. "하나로 만드는 능력"보다 "나눌 줄 아는 판단"

- 이 프로젝트의 핵심은 기능을 많이 넣은 게 아니라, `무엇을 함께 두고 무엇을 갈라야 하는지`를 정리한 데 있다.
- 코드 공유가 가능하다고 제품까지 같이 묶으면 안 된다는 걸 문서와 릴리즈 운영에서 강하게 확인했다.

### 6-2. variant guard를 제품 전략으로 쓴 점

- 보통 variant는 빌드 설정 정도로 끝나는데,
- AIM에서는 variant를 실제 제품 경계로 썼다.
- Productivity에서는 Workout/Nutrition/Health를 막고,
- Wellness에서는 Todo/Mandalart/Routine/Category를 막는다.
- 이게 있어야 하나의 코드베이스를 써도 제품 경험이 섞이지 않는다.

### 6-3. 문서도 아키텍처 일부로 본 점

- PRD, KPI, Analytics, Marketing, Release Guide를 앱별로 분리했다.
- 즉 "코드만 공통"이고, 제품 문서와 운영 문서까지 variant 기준으로 분리했다.
- 그래서 블로그에서는 `앱 2개를 만든 것`이 아니라 `운영 가능한 제품군 체계를 만든 것`으로 설명하는 게 맞다.

### 6-4. 디자인 시스템도 운영 관점에서 만들었다는 점

- AIM은 강한 컬러 중심 앱이 아니라 모노크롬 기반 시스템으로 정리돼 있다.
- 앱의 정보 구조는 무채색으로 잡고, 사용자 데이터나 카테고리만 컬러를 가진다.
- 테마도 상태 계층과 토큰 계층을 분리해서 회귀를 막는 방향으로 설계했다.

---

## 7. 실제로 만든 것들

### 7-1. Productivity

- Todo: 날짜/리스트/달력 뷰, 카테고리, 드래그 정렬, 완료/삭제/오늘로 이동
- Routine: 매일/매주/매월 반복 규칙, 월간 자동 Todo 생성
- Mandalart: 9x9 목표 구조, 즉시 저장 흐름, 이탈 보호
- Home: 오늘 실행 지표와 목표/실행 상태 요약

### 7-2. Wellness

- Workout: 세션 생성/수정/삭제, 운동 선택, 세트 입력, kg/lb 표시
- Workout Trends: 벤치/스쿼트/데드리프트 추이, 최근/최고 기록 비교
- Nutrition: 시간대별 영양제 루틴 체크
- Diet Log: 식사 수기 등록, kcal/탄단지 입력, 즐겨찾기 프리필
- Health Profile: 신체/체성분/목표 입력

### 7-3. Web

- 공개 랜딩
- App Store 다운로드 CTA
- 지원/정책 페이지
- 기술 블로그

### 7-4. 운영

- iOS 앱 2종 심사 대응
- Productivity macOS Electron / MAS 파이프라인 정리
- App Store 메타데이터/스크린샷/업데이트 가이드 분리 운영
- 이슈 문서와 회고 문서 축적

---

## 8. 앞으로의 비전

### 8-1. 가까운 방향

- Productivity
  - Todo와 Mandalart 진행도 연동
  - 위젯
  - 검색/필터 고도화
- Wellness
  - 식단 입력 UX 안정화
  - 즐겨찾기/삭제/수정 보강
  - 메뉴 스캔 기반 식사 후보 추출
  - 운동 성과 요약 고도화
- 공통
  - 릴리즈/ASC 메타데이터 자동화
  - variant 경계와 캐시 정합성 더 단단하게 만들기

### 8-2. 중기 방향

- 앱 패밀리 전략 강화
- 랜딩/블로그를 단순 소개 페이지가 아니라 `신뢰 허브`로 확장
- 수익화 후보
  - CSV export
  - 검색
  - 구독 기반 잠금/해제
  - 광고

### 8-3. 장기 비전

- AIM Productivity는 `개인 실행 OS`로 더 선명해지는 방향
- AIM Wellness는 `한국 근력운동 사용자에게 맞는 실행형 AI 코치`로 확장하는 방향
- 중요한 점
  - 현재 핵심 경로에 완성된 AI 코칭 엔진이 붙어 있는 상태는 아니다.
  - 지금은 운동 기록, 건강 프로필, 영양 루틴, 식사 기록 기반을 먼저 깔아 둔 상태다.
  - 앞으로의 AI는 `대화형 챗봇`보다 `추천 + 조정 + 피드백`에 가까운 구조로 가려는 방향이다.

### 8-4. Wellness AI 방향을 설명할 때 좋은 표현

- 기록 앱이 아니라 실행 조정 앱
- 운동 계획 + 식단 실행 + 보충제 루틴을 한 흐름으로 연결
- 한국 사용자 현실에 맞는 루틴/식사/회복 맥락 반영
- 블랙박스 추천보다 "왜 이렇게 추천했는지" 설명하는 코칭
- 바쁜 일정, 회식, 야근, PT 종료 후 자가관리 같은 실제 이탈 상황 복귀에 집중

---

## 9. 블로그 서술 흐름 추천

### 흐름 A

1. 처음엔 개인 Life OS를 만들고 싶었다
2. 그런데 하나로 묶으니 사용 목적이 서로 충돌했다
3. 그래서 브랜드는 하나로 두고 제품은 둘로 분리했다
4. 그걸 가능하게 하려고 모노레포와 variant 체계를 정리했다
5. 지금은 Productivity와 Wellness를 각자 더 선명하게 키우는 중이다

### 흐름 B

1. 왜 슈퍼앱을 포기했는가
2. 왜 코드베이스는 하나로 유지했는가
3. 왜 웹/문서/릴리즈 운영까지 함께 설계했는가
4. 왜 AIM Wellness의 AI는 아직 "방향"이지 "완성"이라고 말하지 않는가
5. 그래서 앞으로 어디까지 확장하려는가

---

## 10. 문장 재료로 바로 쓰기 좋은 표현

- 하나의 앱을 키운 게 아니라, 하나의 브랜드 아래 제품군 구조를 다시 설계했다.
- 공통 코드베이스를 유지하면서도 제품 메시지와 운영 기준은 분리했다.
- AIM의 핵심은 기능을 많이 넣는 것이 아니라, 개인의 실행 흐름이 끊기지 않게 만드는 것이다.
- `unified`는 상용 제품이 아니라 내부 검증용 shell로 남겨 두었다.
- 이 저장소는 코드 저장소이기도 하지만 동시에 운영 매뉴얼 저장소이기도 하다.
- 나는 앱만 만든 게 아니라, 심사와 배포까지 버틸 수 있는 구조를 같이 만들고 싶었다.
- Todo와 Workout을 한 화면에 같이 두는 것보다, 각 제품이 자기 문제를 정확히 해결하는 편이 더 중요했다.
- AIM Productivity는 실행을 구조화하는 앱이고, AIM Wellness는 변화를 기록하고 추적하는 앱이다.
- Wellness에서 말하는 AI는 지금 당장 모든 걸 자동으로 해주는 마법이 아니라, 데이터 위에서 추천과 조정을 얹는 다음 단계다.
- 결국 AIM은 "한 앱에 다 넣기"보다 "각 흐름을 선명하게 만들기" 쪽으로 진화했다.

---

## 11. 과장하면 안 되는 포인트

- `unified`는 현재 상용 제품이 아니다.
- 현재 활성 앱 경로에는 별도 AI 서버 호출이 핵심 경로로 들어가 있지 않다.
- Wellness의 AI 코칭은 장기 방향이지, 이미 완전 상용화된 핵심 기능이라고 쓰면 과장이다.
- 이 레포는 모노레포이긴 하지만, 현재 형태는 `frontend/web/supabase/docs`를 한 저장소에서 운영하는 실용형 구조이지, Turborepo 같은 통합 빌드 시스템을 전면 도입한 상태는 아니다.

---

## 12. 참고 문서 묶음

### 제품 방향

- `docs/product/PORTFOLIO.md`
- `docs/product/PRODUCT_REQUIREMENTS_DOCUMENT.md`
- `docs/product/PRODUCT_REQUIREMENTS_DOCUMENT_PRODUCTIVITY.md`
- `docs/product/PRODUCT_REQUIREMENTS_DOCUMENT_WELLNESS.md`
- `docs/archive/PRODUCT_REQUIREMENTS_DOCUMENT_LEGACY_UNIFIED.md`

### 구조 / 기술

- `docs/product/PRODUCT_ARCHITECTURE.md`
- `docs/engineering/frontend/FRONTEND_ARCHITECTURE_GUIDE.md`
- `docs/engineering/frontend/FRONTEND_STATE_FLOW.md`
- `docs/engineering/frontend/FRONTEND_ROUTES.md`
- `docs/engineering/backend/SUPABASE_API.md`
- `docs/engineering/backend/SUPABASE_DB_ERD.md`
- `docs/engineering/backend/SUPABASE_RLS.md`
- `frontend/app.config.js`
- `frontend/src/shared/lib/appVariant.ts`
- `frontend/src/shared/lib/queryKeys.ts`

### 기능 / 비전

- `docs/engineering/features/FEAT_ROUTINE_ENGINE.md`
- `docs/engineering/features/FEATURE_NUTRITION_DIET_ENTRY_V1.md`
- `docs/engineering/features/FEAT_WORKOUT_TRANSACTIONS.md`
- `docs/engineering/features/FEAT_TODO_MANDALART_PROGRESS.md`
- `docs/product/AIM_WELLNESS_AI_BUSINESS_PLAN_CHECKLIST.md`
- `docs/product/AIM_WELLNESS_COMPETITIVE_BENCHMARK.md`
- `docs/product/DRAFT.md`

### 운영 / 출시 / 확장

- `docs/operations/DOCS_RESTRUCTURE_PROPOSAL.md`
- `docs/operations/AGENT_CONTEXT.md`
- `docs/operations/DEPLOY_POLICY.md`
- `docs/operations/tasks/TASK-2.md`
- `docs/operations/tasks/TASK-3.md`
- `docs/operations/tasks/TASK-4.md`
- `docs/release/UPDATE_GUIDE.md`
- `docs/research/ASC_LOCALIZATION_AUTOMATION_RESEARCH.md`
- `docs/product/PRODUCT_MARKETING_GUIDE.md`
- `docs/product/PRODUCT_MARKETING_GUIDE_PRODUCTIVITY.md`
- `docs/product/PRODUCT_MARKETING_GUIDE_WELLNESS.md`
- `docs/product/PRODUCT_KPI_PRODUCTIVITY.md`
- `docs/product/PRODUCT_KPI_WELLNESS.md`
- `docs/product/PRODUCT_ANALYTICS_PRODUCTIVITY.md`
- `docs/product/PRODUCT_ANALYTICS_WELLNESS.md`

### 웹 / 신뢰 허브

- `web/README.md`
- `web/LANDING_TECH_BLOG_PLAN.md`
- `web/src/lib/blog.ts`

### 운영 밀도 보여주는 보조 근거

- `docs/incidents/ISSUE_APP_REVIEW_LOGIN_WINDOW_MENU_20260317.md`
- `docs/incidents/ISSUE_ELECTRON_PACKAGE_SIZE_RECURSIVE_20260316.md`
- `docs/incidents/ISSUE_ELECTRON_VECTOR_ICONS_20260224.md`
- `docs/incidents/ISSUE_ROUTINE_MANAGEMENT_UI_20260330.md`
- `docs/incidents/ISSUE_ROUTINE_PERIOD_DELETE_EDIT_20260318.md`
- `docs/incidents/ISSUE_SESSION_EXPIRED_EDGE_AUTH_20260220.md`
- `docs/incidents/ISSUE_TODO_DRAG_ORDER_COLLISION_20260318.md`
- `docs/incidents/ISSUE_TODO_DRAG_PLACEHOLDER_OVERLAP_20260314.md`
- `docs/incidents/ISSUE_TODO_TOGGLE_REORDER_LATENCY_20260314.md`
- `docs/incidents/ISSUE_WORKOUT_LOCALE_NAME_AND_THEME_20260324.md`

---

## 13. 가장 짧은 요약본

- AIM은 원래 목표, 실행, 건강을 한 흐름으로 보려던 개인용 Life OS였다.
- 실제 운영 단계에서 생산성과 웰니스의 목적이 다르다는 걸 확인했고, 그래서 브랜드는 유지한 채 `Productivity`와 `Wellness`를 분리했다.
- 이걸 가능하게 하려고 하나의 저장소 안에 앱(`frontend`), 웹(`web`), 백엔드(`supabase`), 문서(`docs`)를 함께 운영하는 실용형 모노레포를 만들었다.
- 지금의 AIM은 "한 앱에 다 넣는 슈퍼앱"보다, "목적별로 선명한 제품군"에 가깝다.
- 앞으로는 Productivity를 개인 실행 OS로 더 다듬고, Wellness는 기록 기반 위에 설명 가능한 AI 코칭을 얹는 방향으로 확장하려고 한다.
