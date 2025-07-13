# 디시갤 차단기 (macOS Safari + Tampermonkey)

차단 목록에 있는 **디시인사이드 갤러리**에 접속하면  
자동으로 메인 페이지(`https://www.dcinside.com`)로 돌려보내는 유저스크립트입니다.  
광고,추천글 영역도 선택적으로 숨길 수 있어 디시인사이드를 더욱 깔끔하게 사용할 수 있습니다.

---

## ☝ 한 줄 설치

[**➤ 클릭하면 바로 설치됩니다**](https://github.com/diligencefrozen/DCinside-Gallery-Blocker-Mac/raw/refs/heads/main/main/main.user.js)  
(Tampermonkey가 자동으로 스크립트 설치 창을 띄웁니다.)

> **Safari·Chrome·Edge 전부 지원**  
> • macOS Safari: App Store → **Tampermonkey**  
> • macOS Safari: Tampermonkey
> • Chrome/Edge: 웹스토어 → Tampermonkey

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **갤러리 접속 차단** | 차단 목록에 해당하는 갤러리 페이지 방문 시, X초 후 자동 리다이렉트 |
| **지연시간 설정** | 0 초(즉시) ~ 10 초 사이에서 자유롭게 지정(소수점 가능) |
| **메인 페이지 청소** | 방해영역, 실베갤 등 CSS 셀렉터로 지정한 요소를 항상 숨김 |
| **추천 차단 ID 패키지** | 제작자가 선별한 갤러리 ID를 간편하게 등록할 수 있음 |

---

## 사용 방법

1. **설치 후** 디시인사이드 페이지를 엽니다.  
2. **Tampermonkey 아이콘 ▼ → “Userscript Commands”** 메뉴에 아래 항목이 보입니다.  
   - `✅ 차단 기능 켜기 / ❌ 끄기`  
   - `➕ 갤러리 ID 추가`  
   - `🗂 차단 갤러리 목록,삭제`  
   - `⭐️ 제작자가 추천하는 차단 갤러리 일괄 추가`  
   - `⏱ 지연 시간(초) 설정`  
   - `🔍 메인 추천,광고 셀렉터 추가`  
   - `📂 셀렉터 목록,삭제`
3. 메뉴에서 원하는 대로 설정 후 **페이지 새로고침**하면 적용됩니다.

---

## 기여 & 문의

1. **Issue** 또는 **Pull Request** 환영합니다.  
2. 개선 아이디어,버그 제보는 GitHub Issues에 남겨 주세요.  



