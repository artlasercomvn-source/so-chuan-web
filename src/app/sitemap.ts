import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sochuan.vn';
  const tools = [
    '', '/lich-van-nien', '/quy-doi-ty-gia-vang', '/tinh-luong-gross-net', '/tinh-chi-so-bmi-tdee',
    '/quyet-toan-thue-tncn', '/tinh-bhxh-1-lan', '/tinh-tro-cap-that-nghiep', '/tinh-lai-tiet-kiem',
    '/tinh-lai-vay', '/tinh-thue-nha-dat', '/uoc-tinh-chi-phi-xay-nha', '/thuoc-lo-ban',
    '/du-toan-lan-banh-oto', '/tinh-chi-phi-nuoi-xe', '/tinh-tien-dien', '/tinh-cong-suat-dieu-hoa'
  ];

  return tools.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}