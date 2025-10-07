'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'nextjs-blog-starter-theme';

export default function Comments() {
  const commentsRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // 현재 테마 가져오기
  const getGiscusTheme = () => {
    const mode = localStorage.getItem(STORAGE_KEY) ?? 'system';
    const isDark = document.documentElement.classList.contains('dark');

    if (mode === 'system') {
      return 'preferred_color_scheme';
    }
    return isDark ? 'dark' : 'light';
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'jiminseong/jiminseong-blog');
    script.setAttribute('data-repo-id', 'R_kgDON2QV6w');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDON2QV684CwWOm');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', getGiscusTheme());
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    if (commentsRef.current) {
      commentsRef.current.appendChild(script);
    }

    // 테마 변경 감지
    const handleThemeChange = () => {
      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: getGiscusTheme() } } },
          'https://giscus.app'
        );
      }
    };

    // MutationObserver로 dark 클래스 변경 감지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' || mutation.attributeName === 'data-mode') {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-mode'],
    });

    // localStorage 변경 감지 (다른 탭에서의 변경)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        handleThemeChange();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
      if (commentsRef.current) {
        commentsRef.current.innerHTML = '';
      }
    };
  }, [mounted]);

  return <div ref={commentsRef} className="mt-8" />;
}
