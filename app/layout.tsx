import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"

import "./globals.css"

// 우리가 수정한 헤더 컴포넌트
import { TopNav } from "@/header/top-nav"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

export const metadata: Metadata = {
  title: "KMA 의학교육 캘린더",
  description: "대한의사협회 의학교육 일정 및 학술대회 정보",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        <div className="min-h-dvh flex flex-col">
          {/* 상단 헤더 영역 */}
          <TopNav
            searchQuery=""
            onSearchChange={() => {}}
            selectedSpecialty="all"
            onSpecialtyChange={() => {}}
            onlineOnly={false}
            onOnlineOnlyChange={() => {}}
            onOpenFilters={() => {}}
            dateRange={{ from: undefined, to: undefined }}
            onDateRangeChange={() => {}}
            activeFilterCount={0}
          />

          {/* 실제 페이지 내용 */}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
