import request from '@/utils/request'

// 查询外贸合同详情
export function getSelfOperatedContract(id: number) {
  return request.post(`${import.meta.env.VITE_API_VESSEL_URL}/contractExternal/getById?id=${id}`)
}

// 查询外贸合同关联单据 -获取执行航次id和单据信息
export function getVoyageByContractCode(contractCode: string): Promise<{ id: number, vesselName: string, externalVoyageNo: string }> {
  return request.post(`${import.meta.env.VITE_API_VESSEL_URL}/externalVoyage/getVoyageByContractCode?contractCode=${contractCode}`)
}

// 查询执行航次详情
export function getCarryOutVoyage(id: number) {
  return request.post(`${import.meta.env.VITE_API_VESSEL_URL}/externalVoyage/getById?id=${id}`)
}

// 获取核销详情
export function getVerificationDetail(id: string) {
  return request.post(`${import.meta.env.VITE_API_VESSEL_URL}/receiptOffsetApply/detail?id=${id}`)
}
// 获取付款详情
export function getPaymentDetail(id: string) {
  return request.post(`${import.meta.env.VITE_API_VESSEL_URL}/paymentOrder/detail?id=${id}`)
}
