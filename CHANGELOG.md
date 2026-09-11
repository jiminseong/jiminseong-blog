# Changelog

블로그 릴리스 기록. 버전은 `package.json`의 `version`과 `release/x.y.z` 브랜치 이름을 따른다.

## [1.0.0] - 2026-09-11

### Changed
- 댓글 로그인을 소셜 OAuth 5개(Google, GitHub, Kakao, Discord, Notion)에서 이메일/비밀번호 자체 로그인으로 교체
- 댓글은 로그인 없이 익명으로 작성 가능. 로그인하면 닉네임 자동 표시와 본인 댓글 삭제 가능
- 작성자 배지와 댓글 관리 권한은 기존 role 기반 그대로 유지

### Removed
- 소셜 로그인 버튼(`auth-buttons.tsx`), OAuth 콜백 라우트(`/auth/callback`), 서버 Supabase 클라이언트
- 외부 OAuth 앱(GitHub, Kakao, Discord, Notion) 및 Supabase 소셜 provider 등록

### Ops
- 2026-09-11 Supabase Free Nano 인스턴스 메모리 부족으로 댓글 API 504 장애. 프로젝트 재시작으로 복구
