"use client";

import { useState, useEffect } from "react";

const FALLBACK = {
  text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  author: "Martin Fowler",
};

export default function QuoteFooter() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    fetch("https://api.quotable.io/random?tags=technology")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) =>
        setQuote(
          data?.content && data?.author
            ? { text: data.content, author: data.author }
            : FALLBACK
        )
      )
      .catch(() => setQuote(FALLBACK));
  }, []);

  if (!quote) {
    return (
      <div className="h-[30px] w-[240px] animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60" />
    );
  }

  return (
    <p className="line-clamp-2 w-[240px] text-[12px] italic leading-snug text-zinc-400 dark:text-zinc-600">
      &ldquo;{quote.text}&rdquo; &mdash; {quote.author}
    </p>
  );
}
