"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { TopNav } from "@/components/header/top-nav"
import { CalendarView } from "@/components/calendar/calendar-view"
import { EventList } from "@/components/events/event-list"
import { FilterPanel } from "@/components/filters/filter-panel"
import { MobileDrawer } from "@/components/mobile/mobile-drawer"
import { loadEventsFromCsv } from "@/lib/load-events"
import type { MedicalEvent } from "@/lib/types"

export default function HomePage() {
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)) // February 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<MedicalEvent | null>(null)

  // Data
  const [allEvents, setAllEvents] = useState<MedicalEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

// Load events once (public/data/events.csv)
useEffect(() => {
  let cancelled = false
  ;(async () => {
    try {
      setIsLoading(true)
      setLoadError(null)
      const events = await loadEventsFromCsv("/data/events.csv")
      if (!cancelled) setAllEvents(events)
    } catch (e: any) {
      console.error(e)
      if (!cancelled) setLoadError(e?.message ?? "Failed to load events")
    } finally {
      if (!cancelled) setIsLoading(false)
    }
  })()
  return () => {
    cancelled = true
  }
}, [])

  // Advanced filter state
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [minRequiredCredits, setMinRequiredCredits] = useState(0)
  const [minGeneralCredits, setMinGeneralCredits] = useState(0)
  const [sortBy, setSortBy] = useState("date-asc")

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (selectedRegions.length > 0) count++
    if (minRequiredCredits > 0) count++
    if (minGeneralCredits > 0) count++
    return count
  }, [selectedRegions, minRequiredCredits, minGeneralCredits])

  // Filter events
  const filteredEvents = useMemo(() => {
    let events = [...allEvents]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.specialty.toLowerCase().includes(query) ||
          e.organizer.toLowerCase().includes(query)
      )
    }

    // Specialty filter
    if (selectedSpecialty !== "all") {
      events = events.filter((e) => e.specialty === selectedSpecialty)
    }

    // Online only filter
    if (onlineOnly) {
      events = events.filter((e) => e.isOnline)
    }

    // Date range filter
    if (dateRange.from) {
      const fromStr = dateRange.from.toISOString().split("T")[0]
      events = events.filter((e) => e.startDate >= fromStr || e.endDate >= fromStr)
    }
    if (dateRange.to) {
      const toStr = dateRange.to.toISOString().split("T")[0]
      events = events.filter((e) => e.startDate <= toStr)
    }

    // Region filter
    if (selectedRegions.length > 0) {
      events = events.filter((e) => selectedRegions.includes(e.region) || (e.isOnline && selectedRegions.includes("온라인")))
    }

    // Credits filter
    if (minRequiredCredits > 0) {
      events = events.filter((e) => e.requiredCredits >= minRequiredCredits)
    }
    if (minGeneralCredits > 0) {
      events = events.filter((e) => e.generalCredits >= minGeneralCredits)
    }

    // Selected date filter
    if (selectedDate) {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
      events = events.filter((e) => dateStr >= e.startDate && dateStr <= e.endDate)
    }

    // Sort
    events.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.startDate.localeCompare(a.startDate)
        case "credits-desc":
          return b.totalCredits - a.totalCredits
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "date-asc":
        default:
          return a.startDate.localeCompare(b.startDate)
      }
    })

    return events
  }, [
    allEvents,
    searchQuery,
    selectedSpecialty,
    onlineOnly,
    dateRange,
    selectedRegions,
    minRequiredCredits,
    minGeneralCredits,
    sortBy,
    selectedDate,
  ])

  // Events for calendar (without date selection filter)
  const calendarEvents = useMemo(() => {
    let events = [...allEvents]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.specialty.toLowerCase().includes(query)
      )
    }

    if (selectedSpecialty !== "all") {
      events = events.filter((e) => e.specialty === selectedSpecialty)
    }

    if (onlineOnly) {
      events = events.filter((e) => e.isOnline)
    }

    if (dateRange.from) {
      const fromStr = dateRange.from.toISOString().split("T")[0]
      events = events.filter((e) => e.startDate >= fromStr || e.endDate >= fromStr)
    }
    if (dateRange.to) {
      const toStr = dateRange.to.toISOString().split("T")[0]
      events = events.filter((e) => e.startDate <= toStr)
    }

    if (selectedRegions.length > 0) {
      events = events.filter((e) => selectedRegions.includes(e.region) || (e.isOnline && selectedRegions.includes("온라인")))
    }

    if (minRequiredCredits > 0) {
      events = events.filter((e) => e.requiredCredits >= minRequiredCredits)
    }
    if (minGeneralCredits > 0) {
      events = events.filter((e) => e.generalCredits >= minGeneralCredits)
    }

    return events
  }, [
    allEvents,
    searchQuery,
    selectedSpecialty,
    onlineOnly,
    dateRange,
    selectedRegions,
    minRequiredCredits,
    minGeneralCredits,
  ])

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate((prev) => {
      if (
        prev &&
        prev.getFullYear() === date.getFullYear() &&
        prev.getMonth() === date.getMonth() &&
        prev.getDate() === date.getDate()
      ) {
        return null
      }
      return date
    })
    setSelectedEvent(null)
  }, [])

  const handleResetFilters = useCallback(() => {
    setSelectedRegions([])
    setMinRequiredCredits(0)
    setMinGeneralCredits(0)
    setSortBy("date-asc")
  }, [])

  const handleApplyFilters = useCallback(() => {
    setIsFilterPanelOpen(false)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <TopNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={setSelectedSpecialty}
        onlineOnly={onlineOnly}
        onOnlineOnlyChange={setOnlineOnly}
        onOpenFilters={() => setIsFilterPanelOpen(true)}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        activeFilterCount={activeFilterCount}
      />

      {/* Desktop Layout */}
      <main className="max-w-screen-2xl mx-auto px-4 py-6 hidden lg:block">
        <div className="flex gap-6">
          {/* Left: Calendar */}
          <div className="w-[380px] shrink-0">
            <div className="sticky top-[140px]">
              <CalendarView
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                events={calendarEvents}
              />

              {/* Quick stats */}
              <div className="mt-4 bg-card rounded-xl border border-border p-4">
                <h3 className="text-sm font-medium text-card-foreground mb-3">필터 요약</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">전체 교육</span>
                    <span className="font-medium text-card-foreground">{allEvents.length}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">검색 결과</span>
                    <span className="font-medium text-primary">{filteredEvents.length}개</span>
                  </div>
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">선택 날짜</span>
                      <span className="font-medium text-card-foreground">
                        {selectedDate.getMonth() + 1}/{selectedDate.getDate()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Event list */}
          <div className="flex-1 min-w-0">
            <EventList
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </main>

      {/* Mobile Layout */}
      <main className="lg:hidden px-4 py-4 pb-[160px]">
        <CalendarView
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          events={calendarEvents}
        />

        <MobileDrawer eventCount={filteredEvents.length}>
          <EventList
            events={filteredEvents}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
            selectedDate={selectedDate}
          />
        </MobileDrawer>
      </main>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        selectedRegions={selectedRegions}
        onRegionsChange={setSelectedRegions}
        minRequiredCredits={minRequiredCredits}
        onMinRequiredCreditsChange={setMinRequiredCredits}
        minGeneralCredits={minGeneralCredits}
        onMinGeneralCreditsChange={setMinGeneralCredits}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      />
    </div>
  )
}
