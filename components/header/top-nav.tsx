"use client"

import { Search, SlidersHorizontal, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
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
  return (
    <header className="bg-card border-b border-border sticky top-0 z-30">
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        {/* Logo and main title */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-card-foreground leading-tight">KMA 의학교육 캘린더</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">대한의사협회 의학교육 일정</p>
            </div>
          </div>
        </div>

        {/* Filter controls */}
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
          <Button
            variant="outline"
            className="h-9 gap-2 relative bg-transparent"
            onClick={onOpenFilters}
          >
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
