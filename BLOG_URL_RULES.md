# BLOG_URL_RULES.md

기준일: 2026-03-31

## 목적

- 블로그 글의 canonical URL을 `카테고리`가 아니라 `글의 주제/시리즈` 기준으로 유지한다.
- slug와 asset 경로를 같이 관리해서 글 이동 시 관리 비용을 낮춘다.
- URL 변경 시 기존 주소는 redirect로 보존한다.

## 규칙

- 포스트 URL은 `_posts` 내부 파일 경로를 그대로 따른다.
- canonical URL에는 `retrospect`, `frontend`, `book` 같은 카테고리 slug를 넣지 않는다.
- slug는 소문자 영어와 하이픈만 사용한다.
- 시리즈 글은 `/posts/<series>/<entry>` 형태를 기본으로 한다.
- 연도 자체가 핵심 식별자인 글은 `/posts/<topic>/<year>` 형태를 사용한다.
- `-1`, `-2` 같은 임시 번호 slug는 새 글에서 만들지 않는다.
- asset은 `public/assets/blog/<post-slug>/`에 맞춰 포스트 slug와 같은 경로를 사용한다.
- URL을 바꿀 때는 `next.config.ts`에 permanent redirect를 반드시 추가한다.

## 예시

- `mandal-art/2025`
- `review/2025`
- `seo/what`
- `chrome-extension/basics`
- `wooimi/tech-stack`

## 이번 정리 매핑

- `/posts/chrome-extension-1` -> `/posts/chrome-extension/basics`
- `/posts/chrome-extension-2` -> `/posts/chrome-extension/safe-comment`
- `/posts/daangn-1` -> `/posts/daangn/builders-camp`
- `/posts/firstmonth` -> `/posts/ict-internship/first-month`
- `/posts/gyeongidojisasang` -> `/posts/wooimi/gyeonggi-governor-award`
- `/posts/mandal-art-2025` -> `/posts/mandal-art/2025`
- `/posts/therightit` -> `/posts/the-right-it/ideas-review`
- `/posts/wooimi-1` -> `/posts/wooimi/tech-stack`
