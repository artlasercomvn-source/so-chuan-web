// src/config/tax.ts

export const TAX_CONFIG = {
  // 1. Mức giảm trừ gia cảnh (VNĐ)
  DEDUCTION_PERSONAL: 11000000,
  DEDUCTION_DEPENDENT: 4400000,

  // 2. Tỷ lệ trích đóng bảo hiểm (Phần người lao động đóng)
  INSURANCE_RATES: {
    BHXH: 0.08,  // Hưu trí, tử tuất 8%
    BHYT: 0.015, // Bảo hiểm y tế 1.5%
    BHTN: 0.01,  // Bảo hiểm thất nghiệp 1%
  },

  // 3. Mức lương cơ sở và tối thiểu vùng mới nhất (VNĐ)
  BASE_SALARY: 2340000, // Dùng để tính mức trần BHXH, BHYT (Tối đa 20 tháng lương cơ sở)
  MIN_WAGE_REGION_1: 4960000, // Dùng để tính trần BHTN (Tối đa 20 tháng lương tối thiểu vùng)
  
  // 4. Biểu thuế suất lũy tiến từng phần (Gồm 7 bậc)
  // subtraction là số tiền trừ lùi giúp tính nhanh thuế TNCN
  TAX_BRACKETS: [
    { upTo: 5000000, rate: 0.05, subtraction: 0 },
    { upTo: 10000000, rate: 0.10, subtraction: 250000 },
    { upTo: 18000000, rate: 0.15, subtraction: 750000 },
    { upTo: 32000000, rate: 0.20, subtraction: 1650000 },
    { upTo: 52000000, rate: 0.25, subtraction: 3250000 },
    { upTo: 80000000, rate: 0.30, subtraction: 5850000 },
    { upTo: Infinity, rate: 0.35, subtraction: 9850000 },
  ]
};