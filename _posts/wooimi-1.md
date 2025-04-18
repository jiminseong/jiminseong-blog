---
title: "우리는 이별을 미루기로 했다. 뭘로 개발 할까?"
excerpt: "경기 볼런톤이라는 행사에서, 친환경 커플앱을 주제로 결선에 진출하게 되었어요. MVP앱 개발이 필요한 상황에서, 다양한 점을 고려해서 어떤 기술을 선택할지 고민해보았습니다."
coverImage: "/assets/blog/wooimi-1/cover.png"
date: "2025-04-16"
ogImage:
  url: "/assets/blog/wooimi-1/cover.png"
---

### **선택 가능한 사항**

MVP앱 개발에 앞서서 선택 가능한 사항은 아래와 같았어요. 
- PWA
- ReactNative
- Flutter
  
Kotlin,Swift는 현재 학습한 경험이 거의 없기에 제외했습니다.

---

### **고려 해야할 점**
일단 순서 상관없이 나열해보면 다음과 같습니다.
- 기능 구현
- 개발 속도
- 확장 및 유지보수
- 사용자 접근성
- 배포 방식
- 성능

**이중에서 MVP앱개발에 필요한 순서대로 재정렬을 해보았어요**
- 기능 구현
- 개발 속도
- 사용자 접근성
- 확장 및 유지보수
- 배포 방식
- 성능

초기에 사용자에게 **빠른 속도로 완성된 기능을 보여주는게 최우선**이라 생각했습니다.

---

### 기술별 비교 – MVP 개발 관점 (GPT)

| 항목 | **PWA** | **Flutter** | **React Native** |
|------|---------|-------------|------------------|
| **개발 언어** | JS / TS (웹) | Dart | JS / TS |
| **학습 난이도** | 낮음 (React 기반이면 쉬움) | 중간~높음 | 중간 (React 경험 있으면 빠름) |
| **개발 속도** | 빠름 (Vite + Tailwind 등 사용 가능) | 중간 | 중간 (Expo 사용 시 빠름) |
| **UI/UX 성능** | 제한적 (웹 한계) | 고성능 UI, 자연스러움 | 네이티브와 유사한 UX |
| **네이티브 기능** | 일부 지원 (iOS 푸시❌) | 풀 지원 | 풀 지원 |
| **앱스토어 배포** | ❌ (웹 설치만 가능) | ✅ 가능 | ✅ 가능 |
| **브라우저 접근성** | 매우 좋음 (설치 없이 링크 공유) | ❌ | ❌ |
| **생태계 / 커뮤니티** | 활발 (웹 기반 커뮤니티 풍부) | 활발 (구글 주도) | 매우 활발 (React 기반 생태계) |
| **유지보수 / 확장성** | 쉬움 (웹 친화적 구조) | 일관성 높음 | 확장 시 상태 관리 설계 필요 |

---

### 결론

| 고려 포인트 | 적합한 기술 |
|-------------|-------------|
| **혼자 개발** / **React 경험 있음** | ✅ PWA or React Native |
| **카메라 / 위치 / 푸시 필수** | ✅ Flutter or React Native |
| **앱스토어 배포 고려** | ❌ PWA 제외 |
| **UI/UX의 자연스러움 중요** | ✅ Flutter or React Native |
| **빠른 MVP 출시 후 스케일업** | ✅ React Native (Expo 기반으로 시작) |

---

### 최종 선택은

PWA는 정말 빠르게 결과물을 보여줄 때는 최고지만, 이번처럼 카메라/위치/푸시 등 디바이스 기능이 중요한 앱에는 한계가 명확하다는 점을 고려했습니다.
그래서, 우선은 **Next.js + PWA**로 MVP를 구성, 추후, **React Native의 WebView** 혹은 **Flutter**로 확장 및 앱심사 요청하는게 가장 현실적인 선택이라 생각했어요.

---

### 정리하며

생각보다 기술을 선택하는 과정이 고민이 많이 되는 것 같습니다. Flutter와 RN도 지속적으로 고민하고 있지만, 각각 학습을 해보며 결정할 필요가 있을 것 같습니다!