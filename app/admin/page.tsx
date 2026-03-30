'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

// ─── Types ────────────────────────────────────────────────────────────

interface CsvEvent {
  event_id: string
  start_date: string
  title: string
  organizer: string
  contact_name: string
  contact_email: string
  education_type: string
  expected_attendees: string
  region: string
  fee: string
  fee_detail: string
  notes: string
  location: string
  branch_or_department: string
  contact_phone: string
  credits: string
  education_hours: string
  is_online: string
  credits_normal: string
  credits_ness: string
  credits_all: string
}

type DiffStatus = 'keep' | 'add' | 'delete'

interface DiffEvent extends CsvEvent {
  _status: DiffStatus
}

type Step = 'idle' | 'parsing' | 'merging' | 'preview' | 'committing' | 'done' | 'error'

const CSV_COLUMNS: (keyof CsvEvent)[] = [
  'event_id', 'start_date', 'title', 'organizer', 'contact_name', 'contact_email',
  'education_type', 'expected_attendees', 'region', 'fee', 'fee_detail', 'notes',
  'location', 'branch_or_department', 'contact_phone', 'credits', 'education_hours',
  'is_online', 'credits_normal', 'credits_ness', 'credits_all',
]

const ONLINE_KEYWORDS = ['zoom', '온라인', 'webinar', '화상', 'online', '녹화강연', 'web']

const GITHUB_OWNER = 'leesy-doxmeet'
const GITHUB_REPO = 'kma-cal-v2'
const GITHUB_BRANCH = 'main'
const CSV_PATH = 'public/events.csv'

// ─── Auth credentials ─────────────────────────────────────────────────
const AUTH_ID = 'doxmeet_cal'
const AUTH_PW = 'doxmeet_cal_leesy01'

// ─── Helpers ──────────────────────────────────────────────────────────

function isOnline(location: string, title: string): boolean {
  const combined = (location + ' ' + title).toLowerCase()
  return ONLINE_KEYWORDS.some((kw) => combined.includes(kw))
}

function extractCreditsNumber(raw: string): number {
  const m = raw.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

function clean(v: unknown): string {
  return String(v ?? '').trim()
}

function eventKey(e: { start_date: string; title: string; organizer: string }): string {
  return `${e.start_date}|||${e.title}|||${e.organizer}`
}

/** Extract reference date from filename like ExcelDown_2026-03-27.xlsx */
function extractRefDate(filename: string): string | null {
  const m = filename.match(/(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : null
}

/** Generate CSV string from events array. Uses PapaParse to handle quoting. */
function eventsToCsv(events: CsvEvent[]): string {
  return Papa.unparse(events, { columns: CSV_COLUMNS })
}

// ─── Excel Parsing ────────────────────────────────────────────────────

function parseExcel(data: ArrayBuffer): CsvEvent[] {
  const wb = XLSX.read(data, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows: (string | number | null | undefined)[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: false,
  })

  const events: CsvEvent[] = []
  let i = 0

  while (i < rows.length) {
    const row = rows[i]
    if (clean(row?.[0]) === '신청일자') {
      // Found a block start
      const block: Record<string, (string | number | null | undefined)[]> = {}
      // Read rows until next block or end
      let j = i
      while (j < rows.length) {
        const r = rows[j]
        const label = clean(r?.[0])
        if (label) {
          if (label === '신청일자' && j !== i) break // next block
          block[label] = r ?? []
        }
        j++
      }

      const getVal = (label: string, col: number): string => clean(block[label]?.[col])

      const creditsRaw = getVal('참석예상인', 5) // e.g. "6점"
      const creditsNormal = extractCreditsNumber(creditsRaw)
      const loc = getVal('교육일자', 5)
      const titleVal = getVal('교육주제', 1)
      const online = isOnline(loc, titleVal)

      events.push({
        event_id: '', // will be renumbered
        start_date: getVal('교육일자', 1),
        title: titleVal,
        organizer: getVal('주최기관', 1),
        contact_name: getVal('담당자', 1),
        contact_email: getVal('이메일', 1),
        education_type: getVal('교육종류', 1),
        expected_attendees: getVal('참석예상인', 1),
        region: getVal('지역', 1),
        fee: getVal('수강료', 1),
        fee_detail: getVal('세부수강료', 1),
        notes: getVal('비고', 1),
        location: loc,
        branch_or_department: getVal('주최기관', 5),
        contact_phone: getVal('담당자', 5),
        credits: creditsRaw,
        education_hours: getVal('지역', 5),
        is_online: online ? 'TRUE' : 'FALSE',
        credits_normal: String(creditsNormal),
        credits_ness: '0',
        credits_all: String(creditsNormal),
      })

      i = j
    } else {
      i++
    }
  }

  return events
}

// ─── Merge Logic ──────────────────────────────────────────────────────

function mergeEvents(existing: CsvEvent[], newEvents: CsvEvent[], refDate: string): DiffEvent[] {
  const result: DiffEvent[] = []

  // 1. Events BEFORE reference date → keep all
  const before = existing.filter((e) => e.start_date < refDate)
  before.forEach((e) => result.push({ ...e, _status: 'keep' }))

  // 2. Events ON or AFTER reference date
  const existingAfter = existing.filter((e) => e.start_date >= refDate)
  const newSet = new Map<string, CsvEvent>()
  newEvents.forEach((e) => newSet.set(eventKey(e), e))

  const existingKeys = new Set<string>()
  existingAfter.forEach((e) => existingKeys.add(eventKey(e)))

  // In both → keep (update from new data)
  // In new only → add
  // In existing only → delete

  // Process existing-after events
  for (const e of existingAfter) {
    const key = eventKey(e)
    if (newSet.has(key)) {
      // Update from new data
      result.push({ ...newSet.get(key)!, _status: 'keep' })
      newSet.delete(key) // consumed
    } else {
      result.push({ ...e, _status: 'delete' })
    }
  }

  // Remaining new events (not in existing)
  for (const [, e] of newSet) {
    result.push({ ...e, _status: 'add' })
  }

  // Sort by start_date then title for clean output
  result.sort((a, b) => {
    if (a.start_date !== b.start_date) return a.start_date.localeCompare(b.start_date)
    return a.title.localeCompare(b.title)
  })

  return result
}

function applyDiff(diff: DiffEvent[]): CsvEvent[] {
  const kept = diff.filter((e) => e._status !== 'delete')
  return kept.map((e, i) => {
    const { _status, ...rest } = e
    return { ...rest, event_id: String(i + 1) }
  })
}

// ─── GitHub API ───────────────────────────────────────────────────────

async function getFileSha(token: string, path: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.sha ?? null
}

async function commitFile(
  token: string,
  path: string,
  content: string,
  message: string,
  sha: string | null
): Promise<void> {
  const body: Record<string, string> = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: GITHUB_BRANCH,
  }
  if (sha) body.sha = sha

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`GitHub API error (${res.status}): ${err.message ?? res.statusText}`)
  }
}

// ─── Component ────────────────────────────────────────────────────────

export default function AdminPage() {
  // Auth
  const [isAuthed, setIsAuthed] = useState(false)
  const [loginId, setLoginId] = useState('')
  const [loginPw, setLoginPw] = useState('')
  const [loginError, setLoginError] = useState('')

  // Check session on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_auth') === 'true') {
      setIsAuthed(true)
    }
  }, [])

  // GitHub PAT
  const [pat, setPat] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPat(localStorage.getItem('github_pat') ?? '')
    }
  }, [])

  // State
  const [step, setStep] = useState<Step>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [refDate, setRefDate] = useState('')
  const [existingEvents, setExistingEvents] = useState<CsvEvent[]>([])
  const [diffEvents, setDiffEvents] = useState<DiffEvent[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addCount = diffEvents.filter((e) => e._status === 'add').length
  const deleteCount = diffEvents.filter((e) => e._status === 'delete').length
  const keepCount = diffEvents.filter((e) => e._status === 'keep').length

  // ─── Login ────────────────────────────────────────────────────────
  const handleLogin = useCallback(() => {
    if (loginId === AUTH_ID && loginPw === AUTH_PW) {
      setIsAuthed(true)
      sessionStorage.setItem('admin_auth', 'true')
      setLoginError('')
    } else {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  }, [loginId, loginPw])

  const handleLogout = useCallback(() => {
    setIsAuthed(false)
    sessionStorage.removeItem('admin_auth')
  }, [])

  // ─── PAT ──────────────────────────────────────────────────────────
  const savePat = useCallback(() => {
    localStorage.setItem('github_pat', pat)
  }, [pat])

  const clearPat = useCallback(() => {
    setPat('')
    localStorage.removeItem('github_pat')
  }, [])

  // ─── File Processing ─────────────────────────────────────────────
  const processFile = useCallback(
    async (file: File) => {
      try {
        setStep('parsing')
        setErrorMsg('')

        // Extract reference date from filename
        const date = extractRefDate(file.name)
        if (!date) {
          throw new Error('파일명에서 기준일자를 추출할 수 없습니다. (예: ExcelDown_2026-03-27.xlsx)')
        }
        setRefDate(date)

        // Parse Excel
        const buffer = await file.arrayBuffer()
        const newEvents = parseExcel(buffer)

        if (newEvents.length === 0) {
          throw new Error('엑셀 파일에서 이벤트를 찾을 수 없습니다.')
        }

        setStep('merging')

        // Load existing CSV from public
        const res = await fetch('/events.csv', { cache: 'no-store' })
        if (!res.ok) throw new Error('기존 events.csv를 불러올 수 없습니다.')
        const csvText = await res.text()
        const parsed = Papa.parse<CsvEvent>(csvText, { header: true, skipEmptyLines: true })
        const existing = parsed.data.filter((r) => r && r.start_date)
        setExistingEvents(existing)

        // Merge
        const diff = mergeEvents(existing, newEvents, date)
        setDiffEvents(diff)
        setStep('preview')
      } catch (e: any) {
        setErrorMsg(e?.message ?? '처리 중 오류가 발생했습니다.')
        setStep('error')
      }
    },
    []
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file && file.name.endsWith('.xlsx')) {
        processFile(file)
      } else {
        setErrorMsg('.xlsx 파일만 업로드 가능합니다.')
        setStep('error')
      }
    },
    [processFile]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  // ─── Apply (commit to GitHub) ─────────────────────────────────────
  const handleApply = useCallback(async () => {
    if (!pat.trim()) {
      setErrorMsg('GitHub Personal Access Token을 먼저 설정해주세요.')
      setStep('error')
      return
    }

    try {
      setStep('committing')
      const finalEvents = applyDiff(diffEvents)
      const csvContent = eventsToCsv(finalEvents)

      // Get current file SHA
      const sha = await getFileSha(pat, CSV_PATH)

      // Commit CSV
      await commitFile(
        pat,
        CSV_PATH,
        csvContent,
        `data: update events.csv (ref: ${refDate}, +${addCount} -${deleteCount})`,
        sha
      )

      setStep('done')
    } catch (e: any) {
      setErrorMsg(e?.message ?? '커밋 중 오류가 발생했습니다.')
      setStep('error')
    }
  }, [pat, diffEvents, refDate, addCount, deleteCount])

  // ─── Reset ────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setStep('idle')
    setErrorMsg('')
    setRefDate('')
    setDiffEvents([])
    setExistingEvents([])
  }, [])

  // ─── Login Screen ─────────────────────────────────────────────────
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-card rounded-xl border border-border p-6 shadow-sm">
          <h1 className="text-xl font-bold text-card-foreground mb-1">관리자 로그인</h1>
          <p className="text-sm text-muted-foreground mb-6">KMA 의학교육 캘린더 관리</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">아이디</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-secondary-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="아이디 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">비밀번호</label>
              <input
                type="password"
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-secondary-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="비밀번호 입력"
              />
            </div>
            {loginError && <p className="text-sm text-destructive">{loginError}</p>}
            <button
              onClick={handleLogin}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Admin Dashboard ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-card-foreground">관리자 페이지</h1>
            <p className="text-xs text-muted-foreground">KMA 의학교육 캘린더 데이터 관리</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        {/* ─── GitHub PAT Settings ──────────────────────────────── */}
        <section className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-base font-semibold text-card-foreground mb-3">GitHub 설정</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-secondary-foreground outline-none focus:ring-2 focus:ring-primary"
              placeholder="GitHub Personal Access Token 입력"
            />
            <div className="flex gap-2 shrink-0">
              <button
                onClick={savePat}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                저장
              </button>
              <button
                onClick={clearPat}
                className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-card-foreground hover:bg-muted transition-colors"
              >
                초기화
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            토큰은 브라우저 localStorage에 저장됩니다. repo 권한이 필요합니다.
          </p>
        </section>

        {/* ─── Progress Steps ──────────────────────────────────── */}
        {step !== 'idle' && (
          <div className="flex items-center gap-2 text-sm">
            <StepIndicator label="파싱" active={step === 'parsing'} done={['merging', 'preview', 'committing', 'done'].includes(step)} />
            <ChevronRight />
            <StepIndicator label="머지" active={step === 'merging'} done={['preview', 'committing', 'done'].includes(step)} />
            <ChevronRight />
            <StepIndicator label="미리보기" active={step === 'preview'} done={['committing', 'done'].includes(step)} />
            <ChevronRight />
            <StepIndicator label="커밋" active={step === 'committing'} done={step === 'done'} />
            <ChevronRight />
            <StepIndicator label="완료" active={step === 'done'} done={false} />
          </div>
        )}

        {/* ─── Error message ───────────────────────────────────── */}
        {step === 'error' && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
            <p className="text-sm text-destructive font-medium">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-2 text-sm text-destructive underline hover:no-underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* ─── Upload Zone ─────────────────────────────────────── */}
        {(step === 'idle' || step === 'error') && (
          <section
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`bg-card rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  엑셀 파일을 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ExcelDown_YYYY-MM-DD.xlsx 형식 (파일명에서 기준일자 추출)
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </section>
        )}

        {/* ─── Loading states ──────────────────────────────────── */}
        {(step === 'parsing' || step === 'merging') && (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-card-foreground">
              {step === 'parsing' ? '엑셀 파일 파싱 중...' : '데이터 머지 중...'}
            </p>
          </div>
        )}

        {/* ─── Preview / Diff ──────────────────────────────────── */}
        {step === 'preview' && (
          <section className="space-y-4">
            {/* Summary */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="text-base font-semibold text-card-foreground mb-3">변경 요약</h2>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-muted-foreground">기준일자: <strong className="text-card-foreground">{refDate}</strong></span>
                <span className="text-muted-foreground">기존: <strong className="text-card-foreground">{existingEvents.length}개</strong></span>
                <span className="text-green-500">추가: <strong>{addCount}개</strong></span>
                <span className="text-red-500">삭제: <strong>{deleteCount}개</strong></span>
                <span className="text-muted-foreground">유지: <strong className="text-card-foreground">{keepCount}개</strong></span>
                <span className="text-muted-foreground">최종: <strong className="text-card-foreground">{keepCount + addCount}개</strong></span>
              </div>
            </div>

            {/* Diff table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground w-16">상태</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground w-28">날짜</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">교육명</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground w-40">주최기관</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground w-28">지역</th>
                      <th className="px-3 py-2 text-center font-medium text-muted-foreground w-16">평점</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diffEvents.map((e, i) => (
                      <tr
                        key={`${e.start_date}-${e.title}-${i}`}
                        className={`border-b border-border last:border-0 ${
                          e._status === 'add'
                            ? 'bg-green-500/5'
                            : e._status === 'delete'
                            ? 'bg-red-500/5'
                            : ''
                        }`}
                      >
                        <td className="px-3 py-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              e._status === 'add'
                                ? 'bg-green-500/10 text-green-600'
                                : e._status === 'delete'
                                ? 'bg-red-500/10 text-red-600'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {e._status === 'add' ? '추가' : e._status === 'delete' ? '삭제' : '유지'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-card-foreground whitespace-nowrap">{e.start_date}</td>
                        <td className="px-3 py-2 text-card-foreground max-w-xs truncate">{e.title}</td>
                        <td className="px-3 py-2 text-muted-foreground truncate">{e.organizer}</td>
                        <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{e.region}</td>
                        <td className="px-3 py-2 text-center text-card-foreground">{e.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="rounded-lg border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleApply}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                적용 (GitHub에 커밋)
              </button>
            </div>
          </section>
        )}

        {/* ─── Committing ──────────────────────────────────────── */}
        {step === 'committing' && (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-card-foreground">GitHub에 커밋 중...</p>
          </div>
        )}

        {/* ─── Done ────────────────────────────────────────────── */}
        {step === 'done' && (
          <div className="bg-green-500/5 border border-green-500/30 rounded-xl p-6 text-center">
            <svg className="h-10 w-10 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-card-foreground mb-1">커밋 완료!</p>
            <p className="text-xs text-muted-foreground mb-4">
              Cloudflare Pages가 자동으로 재배포합니다.
            </p>
            <button
              onClick={handleReset}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              새 파일 업로드
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────

function StepIndicator({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : done
          ? 'bg-primary/10 text-primary'
          : 'bg-muted text-muted-foreground'
      }`}
    >
      {label}
    </span>
  )
}

function ChevronRight() {
  return (
    <svg className="h-4 w-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
