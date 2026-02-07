"use client"

import Link from "next/link"
import Image from "next/image"

import { Search, SlidersHorizontal, Calendar as CalendarIcon, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { SPECIALTIES } from "@/lib/types"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

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

export function TopNav({
  searchQuery,
  onSearchChange,
  selectedSpecialty,
  onSpecialtyChange,
  onlineOnly,
  onOnlineOnlyChange,
  onOpenFilters,
  dateRange,
  onDateRangeChange,
  activeFilterCount,
}: TopNavProps) {
  // ===== 여기 숫자만 바꾸면 로고 크기 조절 가능 =====
  const LOGO_WIDTH = 140
  const LOGO_HEIGHT = 36
  // =============================================

  // ✅ 실제 인테리어 페이지(외부 링크)
  const INTERIOR_URL = "https://doxtalk.co.kr"

  return (
    <header className="bg-card border-b border-border sticky top-0 z-30">
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        {/* 상단: 로고 + 타이틀 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* ✅ 링크는 로고/타이틀 영역만 감싸기 (입력/버튼 클릭 방해 방지) */}
            <Link
              href="https://www.doxmeet.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 min-w-0"
              aria-label="doxmeet으로 이동"
            >
              <div className="flex items-center shrink-0">
                <Image
                  src="/brand/doxmeet-logo.png"
                  alt="doxmeet"
                  width={LOGO_WIDTH}
                  height={LOGO_HEIGHT}
                  priority
                  className="h-8 w-auto object-contain"
                />
              </div>

              <div className="min-w-0">
                <h1 className="text-lg font-bold text-card-foreground leading-tight truncate">
                  KMA 의학교육 캘린더
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  doxmeet에서 제공하는 연수교육 캘린더 입니다.
                </p>
              </div>
            </Link>
          </div>

          {/* ===== 우측: 데스크톱 버튼 + 모바일 햄버거(메뉴 1개) ===== */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 데스크톱: 외부 링크 버튼 */}
            <Button asChild variant="outline" className="hidden md:inline-flex h-9">
              <a href={INTERIOR_URL} target="_blank" rel="noreferrer">
                인테리어 업체 모음
              </a>
            </Button>

            {/* 모바일: 햄버거 -> Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle>메뉴</SheetTitle>
                </SheetHeader>

                <div className="mt-6">
                  <a
                    href={INTERIOR_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-base font-semibold py-3 border-b border-border"
                  >
                    인테리어 업체 모음
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {/* ======================================================= */}
        </div>

        {/* ✅ 검색/필터 컨트롤: 모바일에서도 보이게 유지 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="교육명, 키워드 검색..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 bg-secondary border-0"
            />
          </div>

          {/* Specialty select */}
          <Select value={selectedSpecialty} onValueChange={onSpecialtyChange}>
            <SelectTrigger className="w-[140px] h-9 bg-secondary border-0">
              <SelectValue placeholder="전문과목" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 과목</SelectItem>
              {SPECIALTIES.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date range picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" className="h-9 gap-2 bg-secondary border-0">
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "M/d", { locale: ko })} - {format(dateRange.to, "M/d", { locale: ko })}
                      </>
                    ) : (
                      format(dateRange.from, "M/d", { locale: ko })
                    )
                  ) : (
                    "기간 선택"
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => onDateRangeChange(range ?? { from: undefined, to: undefined })}
                numberOfMonths={2}
                locale={ko}
              />
            </PopoverContent>
          </Popover>

          {/* Online only toggle */}
          <div className="flex items-center gap-2 px-3 h-9 bg-secondary rounded-md">
            <Switch
              id="online-only"
              checked={onlineOnly}
              onCheckedChange={onOnlineOnlyChange}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="online-only" className="text-sm cursor-pointer whitespace-nowrap text-secondary-foreground">
              온라인만
            </Label>
          </div>

          {/* Advanced filter button */}
          <Button variant="outline" className="h-9 gap-2 relative bg-transparent" onClick={onOpenFilters}>
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">필터</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
