import Image from "next/image"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Top row: logo + policy links */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <a
            href="https://www.doxmeet.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-8 w-32"
            aria-label="DOXMEET 공식 홈페이지"
          >
            <Image
              src="/logos/doxmeet.png"
              alt="DOXMEET 로고"
              fill
              className="object-contain object-left"
              sizes="128px"
            />
          </a>

          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href="https://www.doxmeet.com/about/tos"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              이용약관
            </a>

            <span className="text-border">|</span>

            <a
              href="https://www.doxmeet.com/about/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              개인정보처리방침
            </a>

            <span className="text-border">|</span>

            <Link href="/sitemap-page" className="transition-colors hover:text-foreground">
              사이트맵
            </Link>
          </nav>
        </div>

        <div className="my-6 h-px bg-border" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
  <div>
    <p className="text-sm font-semibold text-foreground">닥스밋 인테리어</p>
    <ul className="mt-3 space-y-2 text-sm">
      <li>
        <a
          href="https://doxtalk.co.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          인테리어 업체 모음
        </a>
      </li>
      <li>
        <a
          href="https://doxtalk.co.kr/register"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          업체 등록하기
        </a>
      </li>
      <li>
        <a
          href="https://doxtalk.co.kr/quote"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          무료 개원 상담 신청
        </a>
      </li>
    </ul>
  </div>


          <div>
            <p className="text-sm font-semibold text-foreground">KMA 서비스</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="https://doxtalk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  KMA 연수교육 캘린더
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">DOXMEET</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="https://www.doxmeet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  닥스밋 공식홈페이지
                </a>
              </li>
              <li>
                <a
                  href="https://www.doxmeet.com/about/tos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  이용약관
                </a>
              </li>
              <li>
                <a
                  href="https://www.doxmeet.com/about/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  개인정보처리방침
                </a>
              </li>
              <li>
                <Link href="/sitemap-page" className="transition-colors hover:text-foreground">
                  사이트맵
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="my-6 h-px bg-border" />

        <div className="space-y-1.5 text-xs leading-relaxed">
          <p>
            <span className="font-medium text-foreground">닥스밋(DOXMEET)</span>
            {" | 대표 : 홍진우 | 사업자등록번호 : 385-88-02455"}
          </p>
          <p>{"주소 : 서울특별시 성동구 연무장 15길 11 에스팩토리 B동 스파크플러스 207호"}</p>
          <p>{"Tel : 070-7834-8371 | Email : leesy@doxmeet.com"}</p>
        </div>

        <p className="mt-5 text-xs text-muted-foreground/60">
          {"Copyright \u00A9 2026 DOXMEET. All Rights Reserved."}
        </p>
      </div>
    </footer>
  )
}
