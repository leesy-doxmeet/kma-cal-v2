"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MedicalEvent } from "@/lib/types"

interface CalendarViewProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  events: MedicalEvent[]
}

export function CalendarView({
  currentDate,
  onDateChange,
  selectedDate,
  onSelectDate,
  events,
}: CalendarViewProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => {
    onDateChange(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    onDateChange(new Date(year, month + 1, 1))
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => {
      const start = event.startDate
      const end = event.endDate
      return dateStr >= start && dateStr <= end
    })
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    )
  }

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"]

  const calendarDays = []
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">
          {year}년 {month + 1}월
        </h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">이전 달</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">다음 달</span>
          </Button>
        </div>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={cn(
              "text-center text-xs font-medium py-2",
              index === 0 && "text-destructive",
              index === 6 && "text-primary",
              index !== 0 && index !== 6 && "text-muted-foreground"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const dayEvents = getEventsForDate(day)
          const hasEvents = dayEvents.length > 0
          const dayOfWeek = (startingDayOfWeek + day - 1) % 7

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDate(new Date(year, month, day))}
              className={cn(
                "aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition-colors relative",
                "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                isToday(day) && "ring-1 ring-primary",
                isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary/90",
                !isSelected(day) && dayOfWeek === 0 && "text-destructive",
                !isSelected(day) && dayOfWeek === 6 && "text-primary",
                !isSelected(day) && hasEvents && "font-medium"
              )}
            >
              <span>{day}</span>
              {hasEvents && (
                <span
                  className={cn(
                    "text-[10px] min-w-[18px] h-[14px] flex items-center justify-center rounded-full px-1",
                    isSelected(day)
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {dayEvents.length}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
