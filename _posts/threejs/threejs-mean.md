---
title: "Three.js란 무엇인가요?"
excerpt: "Three.js에 대해서 공부를 시작했습니다."
coverImage: "/assets/blog/threejs/mean/cover.png"
date: "2026-04-11"
ogImage:
  url: "/assets/blog/threejs/mean/cover.png"
category: frontend
---

## Three.js를 공부하게 된 배경
- 프로젝트 헤일메리를 보고 나도 시각적 효과가 뛰어난 웹을 만들고 싶다는 생각이 들었다.
- 이전부터 3D 웹 개발에 관심을 가지고 있었으나 해야지 생각하고 막상 다른거에 밀려서 시작하지 못했다.
- 이전에 구독해두었던 [GIS DEVELOPER](https://www.youtube.com/watch?v=e0uAhElAo3A) 이 분의 강의가 새롭게 WebGPU기반의 가의를 올리시는 것을  알았고, 시작하기 좋은 시기라 생각했다.
- 강의자의 말씀 따라 WebGPU의 등장과 흐름으로 Three.js가 더욱 각광받는 기술이 될 것 이라 생각했다.

<br/> (참고)[THREE.JS 강좌 : 1. 소개](http://youtube.com/watch?v=e0uAhElAo3A)

<br/> 강의 내용 기반이지만 전반적으로 강의 외적으로 생긴 궁금증에 대해 기록할 예정이다.

## Three.js
- 웹 3D 그래픽을 위한 JS 라이브러리 
  - 보통은 Three.js를 TypeScript로 작성해서 사용하는 것을 추천한다고 한다.
- babylon.js도 많이 사용
  - 차이점 [Three.js vs Babylon.js, 웹 기반 3D 구현 무엇이 나을까?](https://www.elancer.co.kr/blog/detail/968)
    - Three.js = 자유도 높은 도구.
    - Babylon.js = 기능이 많이 갖춰진 도구.
- 오픈소스 MIT (따라서 출처를 남겨야한다.)
  
## WebGL / WebGPU
### WebGL
- WebGL은 오래됨
- CPU와 GPU 사이의 통신에 병목구간이 많음
- CPU의 응답을 대기하느라 GPU가 늘고 있는 상황이 많음

### WebGPU API
- WebGPU는 최신 3D 표준 API 이다.
  - 표준 논의 시작: 2017년경.
  - 브라우저 실험 지원: 2021~2022년경.
  - 대중적 등장: 2023년 Chrome 113 기본 지원.
- GPU를 이용한 범용 산술 연산을 위한 API이다.
- CPU와 GPU 사이의 통신에 병목구간을 최소화 할 수 있다.
- GPU를 최대한 사용 가능하다.

- 둘은 어떤 점에서는 유사하고, 어떤점에서는 차이가 크다.
- 해당 강좌는 WebGPU를 중심으로 진행한다.

## Threejs.org
- [Three.js 공식사이트](threejs.org)에서 많은 예시들을 살펴볼 수 있다.
- `r183`이 현재 가장 최신 버전이고 해당 뱃지 버튼을 누르면 상세한 버전 로그를 볼 수 있다.
- [Three.js 연습사이트](threejs.dev)에서 실제 결과물의 코드와 함께 간단한 실습을 진행할 수 있다.
- [Three.js 개발문서](threejs.org/docs)에서 상세한 개발 문서를 볼 수 있다.
- [Three.js 학습가이드](threejs.org/manual/#ko)을 통해 한국어로 Three.js를 학습할 수 있다.
  - (참고) [Three.js DevTools](https://chromewebstore.google.com/detail/jechbjkglifdaldbdbigibihfaclnkbo)라는 Three.js를 위해 개발자 도구 확장프로그램이 있으나, 사용하지 않으신다고 한다.
- [Three.js 시연 툴](threejs.org/editor)에서 실제 모델을 import하여 확인할 수 하여 유용하다.

## 실습에 필요한 준비 사항
- [x] chrome
- [x] IDE
- [x] node.js
- [x] git