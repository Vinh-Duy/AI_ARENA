"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { motion, MotionConfig } from "framer-motion";
import { translateText, type Language } from "../lib/i18n";

const LanguageContext = createContext<{
  language: Language;
  toggleLanguage: () => void;
}>({ language: "vi", toggleLanguage: () => undefined });

const textSources = new WeakMap<Text, { source: string; rendered: string }>();
const attributeSources = new WeakMap<
  HTMLElement,
  Map<string, { source: string; rendered: string }>
>();

function translatePage(language: Language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node = walker.nextNode();
  while (node) {
    if (
      node.parentElement &&
      !node.parentElement.closest(
        "script,style,textarea,[data-no-translate],[data-translation-pending]",
      )
    ) {
      nodes.push(node as Text);
    }
    node = walker.nextNode();
  }
  nodes.forEach((textNode) => {
    const current = textNode.nodeValue || "";
    const previous = textSources.get(textNode);
    const value =
      previous && previous.rendered === current ? previous.source : current;
    const trimmed = value.trim();
    if (!trimmed) return;
    const translated = translateText(trimmed, language);
    const nextValue = value.replace(trimmed, translated);
    textSources.set(textNode, { source: value, rendered: nextValue });
    if (nextValue !== textNode.nodeValue) {
      textNode.nodeValue = nextValue;
    }
  });
  document.querySelectorAll<HTMLElement>("body *").forEach((element) => {
    if (["SCRIPT", "STYLE"].includes(element.tagName)) return;
    if (element.closest("[data-no-translate],[data-translation-pending]"))
      return;
    const sources =
      attributeSources.get(element) ||
      new Map<string, { source: string; rendered: string }>();
    ["aria-label", "placeholder", "title", "alt"].forEach((attribute) => {
      const current = element.getAttribute(attribute);
      if (current === null) return;
      const previous = sources.get(attribute);
      const source =
        previous && previous.rendered === current ? previous.source : current;
      const translated = translateText(source, language);
      sources.set(attribute, { source, rendered: translated });
      if (translated !== current) element.setAttribute(attribute, translated);
    });
    attributeSources.set(element, sources);
  });
}

let volatileLanguage: Language = "vi";
function readLanguage(): Language {
  try {
    return window.localStorage.getItem("viets-vibe-language") === "en"
      ? "en"
      : "vi";
  } catch {
    return volatileLanguage;
  }
}
function subscribeLanguage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("viets-language", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("viets-language", callback);
  };
}
export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeLanguage,
    readLanguage,
    () => "vi" as Language,
  );
  function toggleLanguage() {
    const nextLanguage: Language = language === "vi" ? "en" : "vi";
    volatileLanguage = nextLanguage;
    try {
      window.localStorage.setItem("viets-vibe-language", nextLanguage);
    } catch {}
    window.dispatchEvent(new Event("viets-language"));
  }
  useEffect(() => {
    document.documentElement.lang = language;
    translatePage(language);
    const options = {
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        "aria-label",
        "placeholder",
        "title",
        "alt",
        "data-translation-pending",
      ],
      subtree: true,
    };
    const observer = new MutationObserver(() => {
      observer.disconnect();
      translatePage(language);
      observer.observe(document.body, options);
    });
    observer.observe(document.body, options);
    return () => observer.disconnect();
  }, [language]);
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Streaming/Suspense may hydrate each island after the provider effect runs.
// Keep its server text untouched until that island has committed.
export function useTranslationReady<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.removeAttribute("data-translation-pending");
  }, []);
  return ref;
}
export function TranslationBoundary({ children }: { children: ReactNode }) {
  const ref = useTranslationReady<HTMLDivElement>();
  return (
    <div ref={ref} data-translation-pending="" style={{ display: "contents" }}>
      {children}
    </div>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useTranslationReady<HTMLDivElement>();
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        ref={ref}
        data-translation-pending=""
        className={`reveal ${className}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
export function Header({
  active = "home",
}: {
  active?: "home" | "studio" | "lookbook";
}) {
  const ref = useTranslationReady<HTMLElement>();
  const [open, setOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    setOpen(false);
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const target = new URL(event.currentTarget.href);
    if (
      target.pathname === window.location.pathname &&
      target.search === window.location.search &&
      !target.hash
    ) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }
  const links = [
    {
      href: "/heritage",
      text: language === "vi" ? "Khám phá" : "Explore",
      id: "home",
    },
    {
      href: "/mix-match",
      text: language === "vi" ? "Phòng phối đồ" : "Mix studio",
      id: "studio",
    },
    {
      href: "/lookbook",
      text: language === "vi" ? "Lookbook của bạn" : "Your lookbook",
      id: "lookbook",
    },
  ];
  return (
    <header ref={ref} data-translation-pending="" className="site-header">
      <div className="nav-wrap">
        <Link
          href="/"
          className="brand"
          aria-label="Việt's Vibe — Trang chủ"
          onClick={navigate}
        >
          <BrandMark className="brand-mark" size={34} />
          <span>
            Viets Vibe<span className="brand-dot">.</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {links.map((link) => (
            <Link
              className={active === link.id ? "active" : ""}
              key={link.id}
              href={link.href}
              onClick={navigate}
            >
              {link.text}
            </Link>
          ))}
        </nav>
        <Link
          href="/mix-match"
          className="button button-dark nav-cta"
          onClick={navigate}
        >
          {language === "vi" ? "Thử chất riêng" : "Try your style"}{" "}
          <ArrowUpRight size={16} />
        </Link>
        <button
          className="language-toggle"
          type="button"
          onClick={toggleLanguage}
          aria-label={
            language === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"
          }
          title={
            language === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"
          }
        >
          <span className={language === "vi" ? "selected" : ""}>VI</span>
          <span aria-hidden="true">/</span>
          <span className={language === "en" ? "selected" : ""}>EN</span>
        </button>
        <button
          className="mobile-toggle icon-button"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Điều hướng di động">
          {links.map((link) => (
            <Link key={link.id} href={link.href} onClick={navigate}>
              {link.text}
              <ArrowUpRight size={16} />
            </Link>
          ))}
          <button
            className="mobile-language-toggle"
            type="button"
            onClick={toggleLanguage}
            aria-label={
              language === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"
            }
          >
            {language === "vi" ? "English" : "Tiếng Việt"}
            <ArrowUpRight size={16} />
          </button>
        </nav>
      )}
    </header>
  );
}
export function Footer() {
  const ref = useTranslationReady<HTMLElement>();
  return (
    <footer ref={ref} data-translation-pending="" className="site-footer">
      <Link className="brand" href="/">
        <BrandMark className="brand-mark" size={28} />
        <span>Viets Vibe.</span>
      </Link>
      <p>Tự hào bản sắc. Tự do thể hiện.</p>
      <span>VIỆT PHỤC REMIX · 2026</span>
      <nav className="footer-links" aria-label="Thông tin dự án">
        <Link href="/about">Về dự án</Link>
        <Link href="/privacy">Quyền riêng tư</Link>
        <a href="/credits">
          Nguồn tư liệu <ArrowUpRight size={13} />
        </a>
      </nav>
    </footer>
  );
}
