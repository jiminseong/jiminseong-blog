# 소셜 로그인 Provider 등록 가이드

`auth-buttons.tsx`에 정의된 모든 활성 provider의 Supabase 연동 방법.
공통 정보부터 읽고, 등록할 provider 섹션으로 이동.

---

## 공통 정보 (모든 provider에 동일)

### Supabase 프로젝트
- **Project Ref**: `eesqdybnbqtstfplcjla`
- **Project URL**: `https://eesqdybnbqtstfplcjla.supabase.co`

### 모든 provider 콘솔에 등록할 Redirect URI
> **이게 가장 자주 헷갈리는 부분이다. 앱의 `/auth/callback`이 아니라 Supabase 콜백을 등록한다.**
```
https://eesqdybnbqtstfplcjla.supabase.co/auth/v1/callback
```

### Site URL & Redirect Allow List (이미 설정됨)
- Site URL: `https://jiminseong.com`
- Redirect URLs: `http://localhost:3000/**`, `https://jiminseong.com/**` (와일드카드로 모든 경로 허용)

### Supabase Dashboard 입력 위치
모든 provider는 다음 경로에서 enable + Client ID/Secret 입력 후 Save:
```
Supabase Dashboard → Authentication → Providers → <provider 이름>
```

### 공통 체크리스트
- [ ] 외부 콘솔에서 OAuth 앱 생성
- [ ] Redirect URI에 위 Supabase 콜백 등록
- [ ] (해당 시) JavaScript origins / Homepage URL 등록 — `https://jiminseong.com`, `http://localhost:3000`
- [ ] Client ID / Secret 발급
- [ ] Supabase Dashboard에서 enable + 값 입력 + Save

---

## 1. Google V
- **콘솔**: https://console.cloud.google.com/auth/clients/create
- **Application type**: Web application
- **Authorized JavaScript origins**: `https://jiminseong.com`, `http://localhost:3000`
- **Authorized redirect URIs**: `https://eesqdybnbqtstfplcjla.supabase.co/auth/v1/callback`
- **Scopes** (Data Access 메뉴): `openid`(수동), `userinfo.email`(기본), `userinfo.profile`(기본)
- **Audience**: External / 비민감 스코프만 쓰면 검증 불필요
- **Supabase fields**: Client ID, Client Secret
- ⚠ 민감한(sensitive)/제한된(restricted) 스코프 추가 시 Google 검증 며칠~수주

## 2. GitHub v
- **콘솔**: https://github.com/settings/developers → New OAuth App
- **Homepage URL**: `https://jiminseong.com`
- **Authorization callback URL**: `https://eesqdybnbqtstfplcjla.supabase.co/auth/v1/callback`
- **Scopes**: 별도 요구 없음 (이메일은 기본 노출)
- **Supabase fields**: Client ID, Client Secret

## 3. Kakao (카카오) v
- **콘솔**: https://developers.kakao.com → 내 애플리케이션 → 추가
- **JavaScript SDK 도메인** (앱 → 플랫폼 키 → Default JS Key 클릭): `https://jiminseong.com`, `http://localhost:3000`
  - ※ Supabase 서버 사이드 OAuth만 쓰면 필수는 아니지만 등록 권장
- **카카오 로그인 활성화 ON** + **Redirect URI** (Default Rest API Key 클릭): `https://eesqdybnbqtstfplcjla.supabase.co/auth/v1/callback`
- **호출 허용 IP 주소**: 비워둘 것 (Supabase 서버 IP가 일정하지 않으므로)
- **동의 항목** (좌측 카카오 로그인 → 동의항목):
  - `profile_nickname` (필수동의)
  - `profile_image` (필수동의)
  - `account_email` (선택동의 — 안 받으면 Supabase에서 "Allow users without an email" 켜기)
- **Supabase fields**:
  - Client ID = REST API 키 (Default Rest API Key의 32자 hex)
  - Client Secret = 같은 페이지의 "클라이언트 시크릿" 섹션에서 코드 생성 → 복사
- 💡 사이트 도메인 자리에 IP 칸이 있는데, IP 칸엔 절대 URL 넣지 말 것 (저장 실패하거나 OAuth 깨짐)

## 4. Discord v
- **콘솔**: https://discord.com/developers → New Application
- **OAuth2 → Redirects**: `https://eesqdybnbqtstfplcjla.supabase.co/auth/v1/callback`
- **Scopes**: 별도 명시 없음 (`identify`, `email` 정도 자동 요청)
- **Supabase fields**: Client ID, Client Secret


## 7. Notion v
- **콘솔**: https://www.notion.so/my-integrations
- **Type**: Public integration
- **Capabilities**: "Read user information including email addresses"
- **Redirect URIs**: `https://eesqdybnbqtstfplcjla.supabase.co/auth/v1/callback`
- **Supabase fields**: OAuth Client ID, OAuth Client Secret

---

## 트러블슈팅

| 증상 | 원인 | 해결 |
|---|---|---|
| 콜백 후 500 에러 `site url is improperly formatted` | Site URL 또는 Redirect URLs 앞뒤 공백 | 대시보드에서 공백 제거 |
| localhost에서 로그인했는데 prod로 리다이렉트 | Redirect Allow List에 localhost 미등록 또는 정확 일치만 됨 | `http://localhost:3000/**` 와일드카드 추가 (이미 적용됨) |
| `redirect_uri_mismatch` (provider 콘솔 단계) | provider 콘솔에 Supabase 콜백 미등록 | 위 Redirect URI 정확히 추가 |
| Google "이 앱은 확인되지 않음" | Audience가 External + 비민감 스코프 외 추가 | scope 줄이거나 verification 신청 |
| `provider not enabled` | Supabase Dashboard provider toggle off | enable + Save |
| 로그인 성공했는데 댓글 닉네임이 이메일 prefix | provider 메타에 `full_name`/`name` 없음 | 정상 동작 (fallback chain의 마지막 단계) |

## 참고

- 공식 문서: https://supabase.com/docs/guides/auth/social-login
- 트리거 `set_comment_author_from_auth`가 `raw_user_meta_data->>'full_name' → name → user_name → preferred_username → email prefix → '사용자'` 순으로 fallback하므로 provider 메타 구조에 너무 신경 쓰지 않아도 됨
- 새 provider 추가 시: `auth-buttons.tsx`의 `PROVIDERS` 배열에 항목 추가 → Supabase Dashboard 등록 → 끝
- 활성 provider 5개: Google, GitHub, Kakao, Discord, Notion
- Spotify 제외: Spotify API가 `email_verified` 필드를 반환하지 않아 Supabase Auth가 항상 unverified로 처리. 우회하려면 Supabase의 "Confirm email" 토글을 OFF 해야 하는데 현재 dashboard에서 노출 안 됨.
