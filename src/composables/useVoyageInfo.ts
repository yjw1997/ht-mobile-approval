import { computed, ref } from 'vue'
import { getCarryOutVoyage, getVoyageByContractCode } from '@/api/contract'
import { formatDate } from '@/utils/formatData'

export function useVoyageInfo() {
  const voyageData = ref<any>(null)
  const showVoyageSheet = ref(false)
  const loading = ref(false)
  const isTCWithTCTPage = ref(false)

  // 获取航次信息
  async function fetchVoyageInfo(contractCode: string, isTCWithTCT = false) {
    if (!contractCode) {
      voyageData.value = null
      return
    }

    try {
      loading.value = true
      isTCWithTCTPage.value = isTCWithTCT
      const res = await getVoyageByContractCode(contractCode)
      voyageData.value = { id: res.id, vesselName: res?.vesselName, externalVoyageNo: res?.externalVoyageNo }
      const voyageInfo = await getCarryOutVoyage(res.id) as any

      // 处理 TC/TCT 页面的特殊数据
      if (isTCWithTCT && voyageInfo) {
        let obj: any = {}

        // 处理交还船信息
        if (voyageInfo.deliveryReturnDTO) {
          obj = {
            deliveryTime: formatDate(voyageInfo.deliveryReturnDTO.deliveryTime),
            returnTime: formatDate(voyageInfo.deliveryReturnDTO.returnTime),
            deliveryLocation: voyageInfo.deliveryReturnDTO.deliveryLocation,
            returnLocation: voyageInfo.deliveryReturnDTO.returnLocation,
          }
        }

        // 处理外部订单信息
        if (voyageInfo.externalOrderDTO) {
          obj = Object.assign(obj, voyageInfo.externalOrderDTO, {
            signDate: formatDate(voyageInfo.externalOrderDTO.signDate),
          })
        }

        // 合并处理后的数据
        voyageData.value = { ...voyageData.value, ...voyageInfo, ...obj }
      }
      else {
        voyageData.value = { ...voyageData.value, ...voyageInfo }
      }
    }
    catch (error) {
      console.error('获取航次信息失败:', error)
      voyageData.value = null
    }
    finally {
      loading.value = false
    }
  }

  // 航次信息内容
  const voyageContent = computed(() => {
    const vesselName = voyageData.value?.vesselName || '-'
    const voyageNo = voyageData.value?.externalVoyageNo || '-'
    return `${vesselName} - ${voyageNo}`
  })

  // 航次标题
  const voyageTitle = computed(() => {
    const vesselName = voyageData.value?.vesselName || '-'
    const voyageNo = voyageData.value?.externalVoyageNo || '-'
    return `航次：${vesselName} - ${voyageNo}`
  })

  // 显示弹窗
  function showVoyageSheetDialog() {
    showVoyageSheet.value = true
  }

  // 关闭弹窗
  function closeVoyageSheet() {
    showVoyageSheet.value = false
  }

  return {
    voyageData,
    showVoyageSheet,
    loading,
    voyageContent,
    voyageTitle,
    fetchVoyageInfo,
    showVoyageSheetDialog,
    closeVoyageSheet,
  }
}
