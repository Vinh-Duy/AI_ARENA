"use client";
import { useState, type ReactNode, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { motion, MotionConfig } from "framer-motion";
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
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
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en">(() =>
    typeof window !== "undefined" &&
    window.localStorage.getItem("viets-vibe-language") === "en"
      ? "en"
      : "vi",
  );
  function toggleLanguage() {
    const nextLanguage = language === "vi" ? "en" : "vi";
    setLanguage(nextLanguage);
    window.localStorage.setItem("viets-vibe-language", nextLanguage);
  }
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
    <header className="site-header">
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
  return (
    <footer className="site-footer">
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
