"use client";

import { useEffect } from "react";

const ICON =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

// 본문(dangerouslySetInnerHTML)의 모든 <pre>에 복사 버튼을 붙인다.
// 마크다운 HTML은 서버에서 만들어지므로, 마운트 후 DOM을 훑어 버튼만 얹는다.
export function CopyCode() {
  useEffect(() => {
    const root = document.querySelector("[data-post-body]");
    if (!root) return;

    const pres = Array.from(root.querySelectorAll<HTMLPreElement>("pre"));
    const added: HTMLButtonElement[] = [];

    pres.forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.setAttribute("aria-label", "코드 복사");
      btn.innerHTML = `${ICON}<span>복사</span>`;

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        const text = (code ?? pre).innerText.replace(/\n$/, "");
        try {
          await navigator.clipboard.writeText(text);
          btn.dataset.copied = "true";
          btn.innerHTML = `${ICON}<span>복사됨</span>`;
          window.setTimeout(() => {
            delete btn.dataset.copied;
            btn.innerHTML = `${ICON}<span>복사</span>`;
          }, 1500);
        } catch {
          btn.innerHTML = `${ICON}<span>실패</span>`;
        }
      });

      pre.appendChild(btn);
      added.push(btn);
    });

    return () => added.forEach((b) => b.remove());
  }, []);

  return null;
}
