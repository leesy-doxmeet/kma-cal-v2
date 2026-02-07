"use client"

import { useState, useEffect } from "react"
import { EventCard } from "./event-card"
import { EventDetail } from "./event-detail"
import type { MedicalEvent } from "@/lib/types"
import { CalendarX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EventListProps {
  events: MedicalEvent[]
  selectedEvent: MedicalEvent | null
  onSelectEvent: (event: MedicalEvent | null) => void
  selectedDate: Date | null
}

export function EventList({
  events,
  selectedEvent,
  onSelectEvent,
  selectedDate,
}: EventListProps) {
  // ===== 페이지네이션 설정 =====
  const PAGE_SIZE = 15
  const [page, setPage] = useState(1)

  // 필터/검색 결과(events)가 바뀌면 항상 1페이지로 초기화
  useEffect(() => {
    setPage(1)
  }, [events])

  if (selectedEvent) {
    return <EventDetail event={selectedEvent} onClose={() => onSelectEvent(null)} />
  }

  const formatSelectedDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  // ===== 페이지네이션 계산 =====
  const totalPages = Math.ceil(events.length / PAGE_SIZE)

  const pagedEvents = events.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {selectedDate
            ? `${formatSelectedDate(selectedDate)} 일정`
            : "전체 일정"}
        </h2>
        <span className="text-sm text-muted-foreground">
          {events.length}개의 교육
        </span>
      </div>

      {events.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <CalendarX className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {selectedDate
              ? "선택한 날짜에 예정된 교육이 없습니다."
              : "검색 조건에 맞는 교육이 없습니다."}
          </p>
        </div>
      ) : (
        <>
          {/* 이벤트 카드 리스트 */}
          <div className="space-y-3">
            {pagedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onSelectEvent(event)}
              />
            ))}
          </div>

          {/* ===== 페이지네이션 UI ===== */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                이전
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
