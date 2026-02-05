import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"

import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

export const metadata: Metadata = {
  title: "Doxmeet: KMA 의학교육 캘린더",
  description: "닥스밋에서 제공하는 평점교육 일정",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
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
      <body className={`${geist.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
