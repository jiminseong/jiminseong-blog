"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: "sans-serif", textAlign: "center", paddingTop: "6rem" }}>
        <p style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
          문제가 발생했습니다.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            border: "1px solid #ccc",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}
