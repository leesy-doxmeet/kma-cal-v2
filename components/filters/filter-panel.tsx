"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { REGIONS, SORT_OPTIONS } from "@/lib/types"

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedRegions: string[]
  onRegionsChange: (regions: string[]) => void
  minRequiredCredits: number
  onMinRequiredCreditsChange: (value: number) => void
  minGeneralCredits: number
  onMinGeneralCreditsChange: (value: number) => void
  sortBy: string
  onSortChange: (value: string) => void
  onReset: () => void
  onApply: () => void
}

export function FilterPanel({
  isOpen,
  onClose,
  selectedRegions,
  onRegionsChange,
  minRequiredCredits,
  onMinRequiredCreditsChange,
  minGeneralCredits,
  onMinGeneralCreditsChange,
  sortBy,
  onSortChange,
  onReset,
  onApply,
}: FilterPanelProps) {
  if (!isOpen) return null

  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      onRegionsChange(selectedRegions.filter((r) => r !== region))
    } else {
      onRegionsChange([...selectedRegions, region])
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" 
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="필터 닫기"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-card-foreground">상세 필터</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">닫기</span>
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Region filter */}
          <div>
            <Label className="text-sm font-medium text-card-foreground mb-3 block">
              지역 선택
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-3">
              {REGIONS.map((region) => (
                <label
                  key={region}
                  className="flex items-center gap-2.5 cursor-pointer min-w-0 py-1"
                >
                  <Checkbox
                    checked={selectedRegions.includes(region)}
                    onCheckedChange={() => toggleRegion(region)}
                  />
                  <span className="text-sm text-card-foreground whitespace-nowrap">
                    {region}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Required credits filter */}
          <div>
            <Label className="text-sm font-medium text-card-foreground mb-3 block">
              최소 필수 평점: {minRequiredCredits}점 이상
            </Label>
            <Slider
              value={[minRequiredCredits]}
              onValueChange={([value]) => onMinRequiredCreditsChange(value)}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          {/* General credits filter */}
          <div>
            <Label className="text-sm font-medium text-card-foreground mb-3 block">
              최소 일반 평점: {minGeneralCredits}점 이상
            </Label>
            <Slider
              value={[minGeneralCredits]}
              onValueChange={([value]) => onMinGeneralCreditsChange(value)}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          <Separator />

          {/* Sort options */}
          <div>
            <Label className="text-sm font-medium text-card-foreground mb-3 block">
              정렬 기준
            </Label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="정렬 기준 선택" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-2">
          <Button variant="outline" onClick={onReset} className="flex-1 bg-transparent">
            초기화
          </Button>
          <Button onClick={onApply} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            적용하기
          </Button>
        </div>
      </div>
    </>
  )
}
