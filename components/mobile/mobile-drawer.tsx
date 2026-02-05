"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronUp, GripHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileDrawerProps {
  children: React.ReactNode
  eventCount: number
}

export function MobileDrawer({ children, eventCount }: MobileDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const drawerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = startY - e.touches[0].clientY
    setCurrentTranslate(Math.max(0, Math.min(diff, 300)))
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (currentTranslate > 100) {
      setIsExpanded(true)
    } else if (currentTranslate < -50) {
      setIsExpanded(false)
    }
    setCurrentTranslate(0)
  }

  useEffect(() => {
    if (!isDragging) {
      setCurrentTranslate(0)
    }
  }, [isDragging])

  return (
    <div
      ref={drawerRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl shadow-lg border-t border-border z-40 transition-transform duration-300 lg:hidden",
        isExpanded ? "translate-y-0" : "translate-y-[calc(100%-140px)]"
      )}
      style={{
        height: "calc(100vh - 200px)",
        transform: isDragging 
          ? `translateY(calc(${isExpanded ? "0%" : "100% - 140px"} - ${currentTranslate}px))`
          : undefined,
      }}
    >
      {/* Drag handle */}
      <div
        className="flex flex-col items-center pt-2 pb-3 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-label={isExpanded ? "일정 목록 접기" : "일정 목록 펼치기"}
      >
        <GripHorizontal className="h-5 w-5 text-muted-foreground" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium text-card-foreground">
            교육 일정
          </span>
          <span className="text-sm text-muted-foreground">
            ({eventCount}개)
          </span>
          <ChevronUp 
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )} 
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 overflow-y-auto" style={{ height: "calc(100% - 60px)" }}>
        {children}
      </div>
    </div>
  )
}
