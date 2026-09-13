<!--
수집 시각: 2026-09-13 (Asia/Seoul)
캡처 규격: 1440 x 900 PNG, 배율 100%(DPR2로 2880x1800 촬영 후 1440x900로 축소)
강조 색상: #E5484D, 3px 테두리
-->

# captions.md — GPT-6 Astra 가이드 캡처

| 파일명 | alt 텍스트 | 촬영/건너뜀 |
| --- | --- | --- |
| AT-01.png | OpenAI GPT-6 Astra 발표문 도입부. "세계에서 가장 뛰어난 지능과 정렬 수준을 갖춘 모델, GPT-6 Astra를 소개합니다"로 시작하는 첫 문단과, 오늘 일부 조직에 먼저 출시되고 며칠에 걸쳐 ChatGPT Plus·Pro·Business·Enterprise로 확대된다는 문단이 보인다. | 촬영 |
| AT-02.png | GPT-6 Astra 발표문의 "컴퓨터 사용(Computer Use)" 벤치마크 표. Agents' Last Exam 59.3%, OSWorld 2.0 72.6%, ScreenSpot-Pro 92.7%로 GPT-5.6 Sol·Claude·Gemini 대비 Astra가 가장 높은 점수를 기록한 것이 보인다. | 촬영 |
| AT-03.png | ChatGPT 요금제 비교표의 "모델" 섹션. GPT-6 Astra 행이 빨간 테두리로 강조되어 있고, Free "—", Go "—", Plus "제한적", Pro "한도 확장"으로 표기되어 있다. | 촬영 |
| AT-04.png | (미촬영) Aside Settings > Models > Task models의 Default model 드롭다운 열린 화면 | **건너뜀** — 아래 사유 참조 |

## AT-04 건너뜀 사유

Aside의 Settings UI를 캡처 가능한 형태로 열지 못했습니다. 시도한 경로와 결과:

1. `aside://settings`, `aside://settings/models` → Chrome 기본 설정(`chrome://settings/`)으로 리다이렉트됨. Aside 설정이 아님.
2. Aside 확장 UI `chrome-extension://fjdhphbdlfjogobdofoaagnlnkoibdge/main.html` → 페이지는 열리지만 "Sign in to Aside" 로그인 화면만 표시됨(사용자의 로그인된 실제 UI가 아님). 로그인은 하지 않음.
3. 같은 확장의 `sidepanel.html` → CDP `Page.enable` 타임아웃으로 로드 실패.
4. `main.html` 재시도 → 동일하게 CDP 타임아웃.

또한 이 실행 환경에는 OS 레벨 화면 캡처 권한이 없어(`screencapture` / `osascript` 모두 차단), 브라우저 밖의 앱 UI는 어떤 방법으로도 촬영할 수 없습니다.

### 다만 "Astra가 목록에 있는지" 자체는 확인됨 → **없음**

설치된 Aside 빌드(`Aside Browsing Agent` 1.26.910.1749)의 모델 카탈로그 번들을 직접 조회한 결과:

- 카탈로그에 존재하는 모델 ID: `gpt-5.6-sol`, `gpt-5.6-luna`, `gpt-5.6-terra`, `gpt-5.5`, `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.3-codex-spark`, `claude-opus-5`, `claude-sonnet-5`, `claude-fable-5`, `claude-fable-5-1`, `gemini-3.8-flash` 등
- `gpt-6` 로 시작하는 모델 ID는 **0건**
- 카탈로그에 `["astra","sol","terra","luna","base","pro","mini"]` 라는 배열이 있으나, 이는 모델 이름 정렬용 접미사 순위표일 뿐 선택 가능한 모델 항목이 아님
- 현재 계정의 `defaultModel` 은 `claude-code / claude-opus-5`

즉 **AT-04의 조건부 결과는 "없음"** 입니다. 화면 캡처만 남아 있습니다.

## 참고: 다크/라이트 모드

- AT-03(요금제 페이지)은 사양대로 **라이트 모드**로 촬영했습니다.
- AT-01, AT-02(발표문)는 라이트 모드로 전환할 수 없습니다. 이 발표문 페이지는 서버에서 `<body class="... dark ...">` 를 직접 내려보내는 **고정 다크 테마 페이지**라, OS 설정이나 CSS 클래스와 무관하게 항상 검은 배경으로 렌더링됩니다. (별자리 배경을 쓰는 런치 페이지 디자인)

## 참고: 언어

모든 캡처는 한국어(ko-KR) 페이지 기준입니다. `openai.com/index/gpt-6-astra/` 는 접속 시 자동으로 `/ko-KR/` 로 리다이렉트됩니다. 영문 화면이 필요하면 `/en-US/` 경로로 다시 촬영할 수 있습니다.
