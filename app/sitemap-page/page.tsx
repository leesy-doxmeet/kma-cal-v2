import Link from "next/link"

export default function SitemapPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-foreground">사이트맵</h1>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {/* 닥스밋 인테리어 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">닥스밋 인테리어</h2>
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
          <h2 className="mb-3 text-lg font-semibold text-foreground">KMA 서비스</h2>
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
          <h2 className="mb-3 text-lg font-semibold text-foreground">DOXMEET</h2>
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

      <p className="mt-10 text-sm text-muted-foreground">
        본 페이지는 DOXMEET 서비스의 주요 메뉴를 안내합니다.
      </p>
    </div>
  )
}
