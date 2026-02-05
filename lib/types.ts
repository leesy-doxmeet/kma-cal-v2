export interface MedicalEvent {
  // Core (used by UI)
  id: string
  title: string
  specialty: string
  region: string
  isOnline: boolean
  startDate: string
  endDate: string
  generalCredits: number
  requiredCredits: number
  totalCredits: number
  organizer: string
  location: string
  contact: string
  notes: string

  // Extra fields (available for future UI)
  contactName?: string
  contactEmail?: string
  expectedAttendees?: string
  fee?: string
  feeDetail?: string
  branchOrDepartment?: string
  creditsRaw?: string
  educationHours?: string
}

export const SPECIALTIES = [
  '내과',
  '신경과',
  '정신건강의학과',
  '외과',
  '정형외과',
  '신경외과',
  '심장혈관흉부외과',
  '성형외과',
  '마취통증의학과',
  '산부인과',
  '소아청소년과',
  '안과',
  '이비인후과',
  '피부과',
  '비뇨의학과',
  '영상의학과',
  '방사선종양학과',
  '병리과',
  '진단검사의학과',
  '결핵과',
  '재활의학과',
  '예방의학과',
  '가정의학과',
  '직업환경의학과',
  '핵의학과',
  '응급의학과',
]

export const REGIONS = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
]

export const SORT_OPTIONS = [
  { value: 'date-asc', label: '날짜 오름차순' },
  { value: 'date-desc', label: '날짜 내림차순' },
  { value: 'credits-desc', label: '평점 높은순' },
  { value: 'title-asc', label: '제목순' },
]
