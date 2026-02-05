"use client"

import { X, MapPin, Calendar, Phone, Building, Award, FileText, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { MedicalEvent } from "@/lib/types"

interface EventDetailProps {
  event: MedicalEvent
  onClose: () => void
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-primary/5 p-4 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant={event.isOnline ? "default" : "secondary"}
                className={event.isOnline 
                  ? "bg-primary text-primary-foreground" 
                  : ""
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
              <Badge variant="outline" className="max-w-[260px] truncate">
                {event.organizer}
              </Badge>
            </div>
            <h2 className="text-lg font-semibold text-card-foreground leading-snug">
              {event.title}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">닫기</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Credits section */}
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-primary" />
            <span className="font-medium text-card-foreground">평점 정보</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{event.totalCredits}</div>
              <div className="text-xs text-muted-foreground">총 평점</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{event.generalCredits}</div>
              <div className="text-xs text-muted-foreground">일반 평점</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-card-foreground">{event.requiredCredits}</div>
              <div className="text-xs text-muted-foreground">필수 평점</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-card-foreground">일정</div>
              <div className="text-sm text-muted-foreground">
                {event.startDate === event.endDate 
                  ? formatDate(event.startDate)
                  : `${formatDate(event.startDate)} ~ ${formatDate(event.endDate)}`
                }
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-card-foreground">주최</div>
              <div className="text-sm text-muted-foreground">{event.organizer}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-card-foreground">장소</div>
              <div className="text-sm text-muted-foreground">{event.location}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-card-foreground">연락처</div>
              <div className="text-sm text-muted-foreground">{event.contact}</div>
            </div>
          </div>

          {event.notes && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-card-foreground">비고</div>
                <div className="text-sm text-muted-foreground">{event.notes}</div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            신청하기
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            캘린더에 추가
          </Button>
        </div>
      </div>
    </div>
  )
}
