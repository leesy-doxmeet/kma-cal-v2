"use client"

import { EventCard } from "./event-card"
import { EventDetail } from "./event-detail"
import type { MedicalEvent } from "@/lib/types"
import { CalendarX } from "lucide-react"

interface EventListProps {
  events: MedicalEvent[]
  selectedEvent: MedicalEvent | null
  onSelectEvent: (event: MedicalEvent | null) => void
  selectedDate: Date | null
}

export function EventList({ events, selectedEvent, onSelectEvent, selectedDate }: EventListProps) {
  if (selectedEvent) {
    return <EventDetail event={selectedEvent} onClose={() => onSelectEvent(null)} />
  }

  const formatSelectedDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {selectedDate ? `${formatSelectedDate(selectedDate)} 일정` : "전체 일정"}
        </h2>
        <span className="text-sm text-muted-foreground">{events.length}개의 교육</span>
      </div>

      {events.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <CalendarX className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {selectedDate 
              ? "선택한 날짜에 예정된 교육이 없습니다."
              : "검색 조건에 맞는 교육이 없습니다."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => onSelectEvent(event)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
