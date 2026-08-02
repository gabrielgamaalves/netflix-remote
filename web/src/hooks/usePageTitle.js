import { useLocation } from "react-router";
import { useEffect } from "react";

export function usePageTitleByRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = pathname
      .split("/")
      .filter(Boolean)
      .map(s => (s[0].toLocaleUpperCase() + s.slice(1)))
      .join(" ")

    document.title = `${title && (title + ' — ')}Netflix Remote`;
  }, [pathname]);
}

export function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title && (title + " — ")}Netflix Remote`;
  }, [title]);
}