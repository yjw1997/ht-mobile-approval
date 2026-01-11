import { computed } from 'vue'
import { formatDateTime } from '@/utils/formatData'
import type { ContractExternalResp } from '@/types/Contract'

export interface ApprovalInfo {
  initiator: string
  documentType: string
  initiationDate: string
  department: string
  applicationNo: string
  status: number
}

/**
 * 从合同数据中提取审批信息
 * @param contractData 合同数据
 * @param documentType 单据类型，默认为'合同申请单'
 * @returns 审批信息对象
 */
export function useContractApprovalInfo(
  contractData: Ref<ContractExternalResp | null>,
  documentType = '合同申请单',
) {
  const approvalInfo = computed<ApprovalInfo>(() => {
    if (!contractData.value) {
      return {
        initiator: '-',
        documentType,
        initiationDate: '-',
        department: '-',
        applicationNo: '-',
        status: 0,
      }
    }

    const data = contractData.value
    return {
      initiator: data.operator || '-',
      documentType,
      initiationDate: formatDateTime(data.createTime),
      department: data.deptName || '-',
      applicationNo: data.contractNo || '-',
      status: data.approvalStatus ?? 0,
    }
  })

  return {
    approvalInfo,
  }
}
