"use client"

import Link from "next/link"
import Image from "next/image"

interface TopNavProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedSpecialty: string
  onSpecialtyChange: (specialty: string) => void
  onlineOnly: boolean
  onOnlineOnlyChange: (value: boolean) => void
  onOpenFilters: () => void
  dateRange: { from: Date | undefined; to: Date | undefined }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  activeFilterCount: number
}

export function TopNav(_props: TopNavProps) {
  // ==========================
  // ✅ 여기 숫자만 바꾸면 됨
  const LOGO_WIDTH = 90
  const LOGO_HEIGHT = 24
  // ==========================

  return (
    <header className="bg-card border-b border-border sticky top-0 z-30">
      <div className="max-w-screen-2xl mx-auto px-4 py-2">
        <Link
          href="https://www.doxmeet.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3"
          aria-label="doxmeet으로 이동"
        >
          {/* 박스 없이 순수 로고만 표시 (높이 줄임) */}
          <Image
            src="/brand/doxmeet-logo.png"
            alt="doxmeet"
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            priority
            style={{
              background: "transparent",
              border: "none",
              borderRadius: 0,
              boxShadow: "none",
              outline: "none",
              display: "block",
            }}
            className="h-5 w-auto object-contain"
          />

          {/* 텍스트 영역 (줄바꿈/크기 정리) */}
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-card-foreground leading-tight">
              KMA 의학교육 캘린더
            </h1>
            <p className="text-xs text-muted-foreground leading-snug">
              doxmeet에서 제공하는 연수교육 캘린더 입니다.
            </p>
          </div>
        </Link>
      </div>
    </header>
  )
}
