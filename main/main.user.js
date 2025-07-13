// ==UserScript==
// @name         디시갤 차단기 (Safari/Tampermonkey)
// @namespace    https://github.com/diligencefrozen/DCinside-Gallery-Blocker-Mac
// @version      07132025.4
// @description  디시인사이드 특정 갤러리를 접속 시, 자동으로 메인 페이지로 리다이렉트 합니다.
// @author       diligencefrozen
// @match        https://*.dcinside.com/*
// @icon         https://www.dcinside.com/favicon.ico
// @downloadURL  https://raw.githubusercontent.com/diligencefrozen/DCinside-Gallery-Blocker-Mac/main/dcinside-gallery-blocker.user.js
// @updateURL    https://raw.githubusercontent.com/diligencefrozen/DCinside-Gallery-Blocker-Mac/main/dcinside-gallery-blocker.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

// ───────────── iframe 방지 (중복 실행 차단) ─────────────
if (window.top !== window) return;   // 최상위 문서가 아니면 바로 종료
// ────────────────────────────────────────────────

/* ───────────────── 기본·동적 설정 ───────────────── */
const builtinBlocked  = ["dcbest"];  // 항상 차단되는 기본 갤러리
const recommendedIds = [
  "4year_university","alliescon","asdf12","canada","centristconservatis",
  "colonialism","disease","divination_new1","ehxoeh","employment",
  "escapekorea","escapekoreagall","foreversolo","immovables","iphone",
  "jpjobngm","leejaemyung","m_entertainer_new1","minjudang","neostock",
  "newtheory","nobirthgall","singlebungle1472","smartphone",
  "thesingularity","w_entertainer"
].map(s => s.toLowerCase());

const DEFAULTS = {
  enabled:       true,   // 차단 기능 켜기/끄기
  blockedIds:    [],     // 사용자 지정 차단 갤러리 IDs
  delay:         5,      // 리다이렉트 지연(초) 0~10
  removeSelectors:[
    // 메인 페이지 추천·광고 기본 셀렉터
    "div#gnb_banner",
    "div#ad_mArticle_top",
    "div.time_best"
  ]
};

/* ───────────────── 헬퍼 (저장/불러오기) ───────────────── */
const S = new Proxy({}, {
  get(_, key){ return GM_getValue(key, DEFAULTS[key]); },
  set(_, key, val){ GM_setValue(key, val); return true; }
});

/* ───────────────── 차단 갤러리 처리 ───────────────── */
function handleUrl() {
  if (!S.enabled) return;

  const gid = new URLSearchParams(location.search).get("id")?.trim().toLowerCase();
  const blockedSet = new Set([
    ...builtinBlocked,
    ...S.blockedIds.map(v => v.toLowerCase())
  ]);

  if (!gid || !blockedSet.has(gid)) return;
  if (document.getElementById("dcblock-overlay")) return; // 중복 실행 방지
  showOverlayAndRedirect();
}

function showOverlayAndRedirect(){
  /* 즉시 이동 */
  if (S.delay === 0){
    location.replace("https://www.dcinside.com");
    return;
  }

  /* 오버레이 UI */
  const ov = document.createElement("div");
  ov.id = "dcblock-overlay";
  Object.assign(ov.style,{
    position:"fixed", inset:0, zIndex:2147483647,
    background:"rgba(0,0,0,0.9)", color:"#fff",
    display:"flex", flexDirection:"column",
    justifyContent:"center", alignItems:"center",
    fontFamily:"Inter, sans-serif", fontSize:"24px",
    lineHeight:1.5, textAlign:"center", padding:"1.5rem"
  });
  document.documentElement.appendChild(ov);

  /* 안내 문구 + 카운트다운 구성 */
  const msgTop = document.createElement("div");
  msgTop.textContent = "이 갤러리는 차단되었습니다.";
  ov.append(msgTop);

  const span = document.createElement("span");
  span.style.fontSize = "32px";
  span.style.fontWeight = "600";
  ov.append(span);

  const msgBottom = document.createElement("div");
  msgBottom.textContent = "초 후 메인 페이지로 이동합니다";
  ov.append(msgBottom);

  let sec = Math.round(S.delay);
  span.textContent = sec;

  const timer = setInterval(() => {
    if (--sec <= 0){
      clearInterval(timer);
      location.replace("https://www.dcinside.com");
    } else {
      span.textContent = sec;
    }
  }, 1000);
}

/* pushState / replaceState / popstate 감지 (SPA 대응) */
["pushState","replaceState"].forEach(fn => {
  const orig = history[fn];
  history[fn] = function(...args){
    const ret = orig.apply(this, args);
    handleUrl();
    return ret;
  };
});
addEventListener("popstate", handleUrl);
if (document.readyState !== "loading") handleUrl();
else addEventListener("DOMContentLoaded", handleUrl);

/* ───────────────── 메인 페이지 클린업 ───────────────── */
function applyRemoveSelectors() {
  const selectors = S.removeSelectors;
  if (!selectors.length) return;

  /* style 태그 삽입해서 강제 숨김 */
  let style = document.getElementById("dcb-clean-style");
  if (!style){
    style = document.createElement("style");
    style.id = "dcb-clean-style";
    document.documentElement.appendChild(style);
  }
  style.textContent = selectors.map(s => `${s}{display:none!important}`).join("\n");

  /* 이미 렌더된 노드 즉시 제거 */
  selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));

  /* 동적 로딩 요소 대응 – MutationObserver */
  if (!applyRemoveSelectors.observer){
    const obs = new MutationObserver(() => {
      selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));
    });
    obs.observe(document.body, {childList:true, subtree:true});
    applyRemoveSelectors.observer = obs;
  }
}
if (document.readyState !== "loading") applyRemoveSelectors();
else addEventListener("DOMContentLoaded", applyRemoveSelectors);

/* ───────────────────── 메뉴 명령 ───────────────────── */

/* 기능 토글 */
GM_registerMenuCommand(
  S.enabled ? "❌ 차단 기능 끄기" : "✅ 차단 기능 켜기",
  () => {
    S.enabled = !S.enabled;
    alert(`차단 기능이 ${S.enabled ? "켜짐" : "꺼짐"}`);
  }
);

/* 차단 갤러리 추가 */
GM_registerMenuCommand("➕ 갤러리 ID 추가", () => {
  const id = prompt("차단할 갤러리 ID 입력 (쉼표로 복수 입력 가능)", "");
  if (!id) return;
  const add = id.split(/[, ]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
  S.blockedIds = [...new Set([...S.blockedIds, ...add])];
  alert("추가 완료! (새로고침 필요)");
});

/* 차단 갤러리 목록·삭제 */
GM_registerMenuCommand("🗂 차단 갤러리 목록,삭제", () => {
  const list = S.blockedIds;
  const msg = list.length
    ? `현재 차단:\n${list.join(", ")}\n\n삭제할 ID 입력`
    : "현재 사용자 차단 없음\n\n삭제할 ID 입력";
  const id = prompt(msg, "");
  if (!id) return;
  const del = id.split(/[, ]+/).map(v => v.trim().toLowerCase()).filter(Boolean);
  S.blockedIds = list.filter(v => !del.includes(v.toLowerCase()));
  alert("삭제 완료! (새로고침 필요)");
});

/* 추천 리스트 전체 추가 */
GM_registerMenuCommand("⭐️ 제작자가 추천하는 차단 갤러리 일괄 추가", () => {
  S.blockedIds = [...new Set([...S.blockedIds, ...recommendedIds])];
  alert("일괄 추가 완료!");
});

/* 지연시간 설정 */
GM_registerMenuCommand("⏱ 지연 시간(초) 설정", () => {
  const t = parseFloat(prompt("0 ~ 10 (소수 허용)", String(S.delay)));
  if (isNaN(t) || t < 0 || t > 10){
    alert("잘못된 값");
    return;
  }
  S.delay = t;
  alert(`지연시간이 ${t}초로 설정되었습니다`);
});

/* 메인 페이지 숨김 셀렉터 추가 */
GM_registerMenuCommand("🔍 메인 추천,광고 셀렉터 추가", () => {
  const sel = prompt("CSS Selector 입력 (쉼표로 복수)", "");
  if (!sel) return;
  const add = sel.split(",").map(s => s.trim()).filter(Boolean);
  S.removeSelectors = [...new Set([...S.removeSelectors, ...add])];
  alert("추가 완료! (새로고침 필요)");
});

/* 셀렉터 목록,삭제 */
GM_registerMenuCommand("📂 셀렉터 목록·삭제", () => {
  const list = S.removeSelectors;
  const msg = list.length
    ? `현재 셀렉터:\n${list.join(", ")}\n\n삭제할 셀렉터 입력`
    : "현재 사용자 지정 없음\n\n삭제할 셀렉터 입력";
  const sel = prompt(msg, "");
  if (!sel) return;
  const del = sel.split(",").map(v => v.trim()).filter(Boolean);
  S.removeSelectors = list.filter(v => !del.includes(v));
  alert("삭제 완료! (새로고침 필요)");
});
```
