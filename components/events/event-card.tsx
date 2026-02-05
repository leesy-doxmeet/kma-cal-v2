"use client"

import { MapPin, Video, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { MedicalEvent } from "@/lib/types"

interface EventCardProps {
  event: MedicalEvent
  onClick: () => void
  isSelected?: boolean
}

export function EventCard({ event, onClick, isSelected }: EventCardProps) {
  const formatDate = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const startStr = `${startDate.getMonth() + 1}/${startDate.getDate()}`
    const endStr = `${endDate.getMonth() + 1}/${endDate.getDate()}`
    
    if (start === end) {
      return startStr
    }
    return `${startStr} - ${endStr}`
  }

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
        isSelected ? "border-primary shadow-md bg-primary/5" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Title and badges row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-medium text-card-foreground leading-snug line-clamp-2 flex-1">
            {event.title}
          </h3>
          <Badge 
            variant={event.isOnline ? "default" : "secondary"}
            className={event.isOnline 
              ? "bg-primary text-primary-foreground shrink-0" 
              : "shrink-0"
            }
          >
            {event.isOnline ? (
              <span className="flex items-center gap-1">
                <Video className="h-3 w-3" />
                온라인
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                오프라인
              </span>
            )}
          </Badge>
        </div>

        {/* Meta info row */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
          <Badge variant="outline" className="font-normal max-w-[240px] truncate">
            {event.organizer}
          </Badge>
          <span className="text-muted-foreground">•</span>
          <span>{event.region}</span>
          <span className="text-muted-foreground">•</span>
          <span>{formatDate(event.startDate, event.endDate)}</span>
        </div>

        {/* Credits row */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-primary">
            <Award className="h-4 w-4" />
            <span className="font-medium">{event.totalCredits} 평점</span>
          </div>
          <span className="text-muted-foreground text-xs">
            (일반 {event.generalCredits} / 필수 {event.requiredCredits})
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
