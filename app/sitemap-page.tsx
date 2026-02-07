import Link from "next/link"

export default function SitemapPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-6">사이트맵</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* 닥스밋 인테리어 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            닥스밋 인테리어
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                인테리어 업체 모음
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-foreground">
                업체 등록하기
              </Link>
            </li>
            <li>
              <Link href="/quote" className="hover:text-foreground">
                무료 개원 상담 신청
              </Link>
            </li>
          </ul>
        </section>

        {/* KMA 서비스 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            KMA 서비스
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="https://doxtalk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                KMA 연수교육 캘린더
              </a>
            </li>
          </ul>
        </section>

        {/* DOXMEET */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            DOXMEET
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="https://www.doxmeet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                닥스밋 공식홈페이지
              </a>
            </li>
            <li>
              <a
                href="https://www.doxmeet.com/about/tos"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                이용약관
              </a>
            </li>
            <li>
              <a
                href="https://www.doxmeet.com/about/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                개인정보처리방침
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-10 text-sm text-muted-foreground">
        본 사이트맵은 DOXMEET 서비스 구조를 안내하기 위한 페이지입니다.
      </div>
    </div>
  )
}
