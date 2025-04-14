---
title: "Chrome Extension - 2"
excerpt: "SafeComment 프론트에서 부터 서버까지 생각 보다 내용이 많지 않아, 하나에 정리했어요"
coverImage: "/assets/blog/chrome-extension-2/cover.png"
date: "2025-03-31"
ogImage:
  url: "/assets/blog/chrome-extension-2/cover.png"
---


크롬익스텐션 기초를 공식문서로 다진후 개발을 진행했어요. 초기 퍼블리싱과 페이지네이션은 일단 양이 그리 많지 않기에 충분히 구현 가능했어요. 서버는 express와 Render를 통해서 쉽게 작성하고 배포했습니다!

### 결과물

<p align="center">
  <img src="/assets/blog/chrome-extension-2/ui-1.png" width="50%" /><br/>
  우선 처음 화면에서 "신고 하기", "선플 달기" 를 클릭 할 수 있어요
</p>

<p align="center">
  <img src="/assets/blog/chrome-extension-2/ui-2.png" width="50%" />
  <img src="/assets/blog/chrome-extension-2/ui-2-1.png" width="50%" /><br/>
  "신고 하기"를 누르면 해당 댓글이 인식되고, 블러처리가 됩니다.
</p>

<p align="center">
  <img src="/assets/blog/chrome-extension-2/ui-3.png" width="50%" /><br/>
  그리고 "위로 받기 (우측 상단)"을 누르면 악플을 본 시청자를 위로해주는 글을 AI가 작성해줍니다.
</p>

<p align="center">
  <img src="/assets/blog/chrome-extension-2/ui-4.png" width="50%" /><br/>
  신고하기를 통해서, 해당 유저 멘션아이디, 유튜브 영상 정보, 댓글 정보를 DB에 신고합니다.
</p>

<p align="center">
  <img src="/assets/blog/chrome-extension-2/ui-5.png" width="50%" /><br/>
  선플 달기를 통해서는, 영상 내용에 맞게, 내 심정을 더 긍정적으로 표현해줘요. 이를 통해서 표현이 서툰 사람은 도움을 받을 수 있습니다!
</p>


- 프로젝트 전체 파일 구조는 아래와 같아요
```plaintext
SafeComment
 ┣ font // 폰트
 ┃ ┗ PretendardVariable.woff2
 ┣ icons // 아이콘
 ┃ ┣ icon.svg
 ┃ ┣ icon128.png
 ┃ ┣ icon16.png
 ┃ ┣ icon24.png
 ┃ ┣ icon48.png
 ┃ ┗ sendIcon.svg
 ┣ images // 이미지
 ┃ ┗ loading.gif
 ┣ pages
 ┃ ┣ comment-report.html // 신고 하기 페이지
 ┃ ┣ good-comment.html // 선플 달기 페이지
 ┃ ┗ loading.html // 로딩
 ┣ scripts
 ┃ ┣ background.js // 백그라운드 스크립트
 ┃ ┣ comment-report.js // 신고 하기 페이지 스크립트
 ┃ ┣ content.js 
 ┃ ┣ good-comment.js // 선플 달기 페이지 스크립트
 ┃ ┗ loading.js // 로딩 스크립트
 ┣ .gitignore
 ┣ manifest.json // 기초 설정 파일
 ┣ popup.css // 전체 스타일링
 ┣ popup.html // 초기 화면 페이지
 ┣ popup.js // 초기 화면 스크립트
 ┗ safe_comment.png 
```

- 일단 최대한, 초안의 형태로 제작했어요, `popup.css`로 전역 스타일링을 했어요. 아무래도 미적인 요소는 간단하게 고안했습니다.


### 서버
서버는 아래와 같이, 각각 handler에서 
- check : 악플인지 검수
- comfort : 위로하는 댓글 생성
- recommend : 선플 작성 을 담당해 구성되었습니다.

```plaintext
SafeComment-server
 ┣ api
 ┃ ┣ checkHandler.js
 ┃ ┣ comfortHandler.js
 ┃ ┗ recommendHandler.js
 ┣ .env
 ┣ .gitignore
 ┣ index.js
 ┗ package.json
```

- Gemini API를 처음 사용하는 터라 버전 관련된 이슈를 경험했지만, 공식문서를 통해서 다시 체크 하고 해결했습니다!

---

## 느낀 점
- 현재는 배포를 앞두고 검토 대기중인데, manifest.json에서 불필요한 옵션이 있는 경우에도 거절 되더라고요, 그리고 생각보다 개인정보 약관등 준비해야할 점이 많아 새롭게 알게되었습니다. 이 내용은 추후에 배포 성공할 시에 한번더 정리하겠습니다.
  
- 크롬익스텐션을 개발하고 영상 형태로 공모전에 제출하게 되었는데, 개발에 비중을 두고, 혼자 진행하다보니 영상에 신경을 못쓴 것 같아 아쉽기도 했습니다! 그리고 영어로 제작했어야 했는데, 영어 실력이 부족해 GPT를 많이 활용한 점도 아쉬웠네요.
  
- 그래도, 크롬익스텐션을 개발하면서 JS가 또 한번 좋아지게되었습니다. 다양한 범용성이 있다는 점에서 말이죠, 그래서 다음에는 **electron app** 을 한번 만들어볼까 합니다.

