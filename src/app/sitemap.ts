import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sochuan.vn'
  
  // Khai báo các đường dẫn công cụ hiện có
  const routes = [
    '',
    '/du-toan-lan-banh-oto',
    '/quyet-toan-thue-tncn',
    '/tinh-bhxh-1-lan',
    '/tinh-lai-tiet-kiem',
    '/tinh-lai-vay',
    '/tinh-luong-gross-net'
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.9,
  }))
}