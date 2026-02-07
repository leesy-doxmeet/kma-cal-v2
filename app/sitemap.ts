import type { MetadataRoute } from "next"

export const dynamic = "force-static"
export const revalidate = 86400 // 하루에 1번 갱신

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://doxtalk.com"

  // ✅ lastModified를 "고정"하면 매 요청마다 시간이 바뀌지 않아서 더 깔끔함
  // 배포할 때마다 날짜만 업데이트해도 충분
  const lastModified = new Date("2026-02-07")

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sitemap-page`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]
}
