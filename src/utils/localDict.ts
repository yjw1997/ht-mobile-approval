/****
 * * 存放本地的字典数据
 */
import {
  getAllEmployee,
  getAllGoods,
  getAllOrgt,
  getAllPort,
  getAllProject,
  getAllProjectGroup,
  getCountryList,
  getCurrencyInfoOptions,
  getExpenseAccountList,
  getExpenseCategoryTreeWithSubject,
  getGuestBusinessList,
  getListVesselInfo,
  getStatisticsSubjectList,
  getVoyageNoConfigList,
  getVoyageNoConfigSelectList,
} from '@/api/common'

/**
 * 字典数据类型接口
 */
export interface DictDataType {
  label: string
  value: any
  [key: string]: any
}

/**
 * 通用的根据options和value获取label的方法
 * @param options 字典选项数组
 * @param value 要查找的值
 * @returns 对应的label，找不到返回空字符串
 */
export function getLabelByOptions(options: DictDataType[], value: any): string {
  return options?.find?.(opt => opt.value === value)?.label || ''
}

/**
 * ==================== 合同状态相关 ====================
 */

/**
 * 合同状态选项列表
 */
export const CONTRACT_STATUS_OPTIONS: DictDataType[] = [
  { label: '待提交', value: 0 },
  { label: '审批中', value: 1 },
  { label: '审批通过', value: 2 },
  { label: '审批驳回', value: 3 },
  { label: '审批终止', value: 4 },
  { label: '变更审批中', value: 5 },
  { label: '变更终止', value: 6 },
  { label: '变更驳回', value: 7 },
  { label: '变更通过', value: 8 },
  { label: '作废审批中', value: 9 },
  { label: '已作废', value: 10 },
  { label: '待生效', value: 11 },
  { label: '已生效', value: 12 },
]

/**
 * 状态颜色映射
 * 根据状态 value 返回对应的颜色和样式类
 */
export const STATUS_COLOR_MAP = {
  // 通过状态 - 绿色
  approved: {
    color: '#07c160',
    class: 'status-approved',
    values: [2, 8], // 审批通过、变更通过
  },
  // 驳回状态 - 红色
  rejected: {
    color: '#ee0a24',
    class: 'status-rejected',
    values: [3, 7], // 审批驳回、变更驳回
  },
  // 审批中状态 - 浅蓝色
  approving: {
    color: '#1989fa',
    class: 'status-approving',
    values: [1, 5, 9], // 审批中、变更审批中、作废审批中
  },
  // 终止/撤回状态 - 橙色
  withdrawn: {
    color: '#ff976a',
    class: 'status-withdrawn',
    values: [4, 6, 10], // 审批终止、变更终止、已作废
  },
  // 默认状态 - 浅蓝色
  default: {
    color: '#1989fa',
    class: 'status-approving',
    values: [0, 11, 12], // 待提交、待生效、已生效
  },
} as const

/**
 * 状态信息接口
 */
export interface StatusInfo {
  label: string // 状态文本
  color: string // 状态颜色
  statusClass: string // 状态样式类
  value: number // 状态值
}

/**
 * 根据状态值或状态文本获取状态信息
 * @param status 状态值（number）或状态文本（string）
 * @returns 状态信息对象
 */
export function getStatusInfo(status: number | string): StatusInfo {
  // 如果 status 是字符串，尝试从 CONTRACT_STATUS_OPTIONS 中查找对应的 value
  let statusValue: number
  if (typeof status === 'string') {
    // 尝试匹配状态文本，获取对应的 value
    const matched = CONTRACT_STATUS_OPTIONS.find(opt => opt.label === status)
    statusValue = matched ? matched.value : 1 // 默认审批中 (value: 1)
  }
  else {
    statusValue = status
  }

  // 根据 value 查找对应的 label（用于显示文本）
  const statusOption = CONTRACT_STATUS_OPTIONS.find(opt => opt.value === statusValue)
  const label = statusOption?.label || '审批中'

  // 根据 value 设置颜色和样式类
  let color: string = STATUS_COLOR_MAP.default.color
  let statusClass: string = STATUS_COLOR_MAP.default.class

  // 遍历颜色映射，找到匹配的状态值
  for (const [key, config] of Object.entries(STATUS_COLOR_MAP)) {
    if (key !== 'default' && (config.values as readonly number[]).includes(statusValue)) {
      color = config.color
      statusClass = config.class
      break
    }
  }

  return {
    label, // 使用 label 显示文本
    color, // 使用 value 判断颜色
    statusClass,
    value: statusValue, // 保存 value 供调试使用
  }
}
/**
 * 合同类型选项列表
 * 0 揽货合同 1 TC期租合同 2 TCT航次期租合同 3 VC航次租船 4 COA包运合同
 */
export const CONTRACT_TYPE_OPTIONS: DictDataType[] = [
  { label: '揽货合同', value: 0 },
  { label: 'TC期租合同', value: 1 },
  { label: 'TCT航次期租合同', value: 2 },
  { label: 'VC航次租船', value: 3 },
  { label: 'COA包运合同', value: 4 },
]
/**
 * 经营模式选项列表
 * 0外贸OP 1外贸自营
 */
export const BUSINESS_MODE_OPTIONS: DictDataType[] = [
  { label: '外贸OP', value: 0 },
  { label: '外贸自营', value: 1 },
]

/**
 * 租赁方向选项列表
 * 0租入 1租出
 */
export const LEASE_TYPE_OPTIONS: DictDataType[] = [
  { label: '租入', value: 0 },
  { label: '租出', value: 1 },
]

// 港口目的 始、装、卸、中、修、备、待、补、运、交船、还船、装卸、其他
export const EXTERNAL_CARRY_OUT_VOYAGE_FLAG_DICT = [
  {
    value: '0',
    label: '始',
  },
  {
    value: '1',
    label: '装',
  },
  {
    value: '2',
    label: '卸',
  },
  {
    value: '3',
    label: '中',
  },
  {
    value: '4',
    label: '修',
  },
  {
    value: '5',
    label: '备',
  },
  {
    value: '6',
    label: '待',
  },
  {
    value: '7',
    label: '补',
  },
  {
    value: '8',
    label: '运',
  },
  {
    value: '9',
    label: '交船',
  },
  {
    value: '10',
    label: '还船',
  },
  {
    value: '11',
    label: '装卸',
  },
  {
    value: '12',
    label: '加油',
  },
  {
    value: '13',
    label: '其他',
  },
]
// 合同性质
export const externalContractNature = [
  { value: '0', label: '一般运输合同' },
  { value: '1', label: '超过2个航次且不超过半年' },
  { value: '2', label: 'COA超过3载' },
  { value: '3', label: '租金水平/运费价格过低' },
  { value: '4', label: '超过2个航次且超过半年' },
]
// 客户佣金类型
export const customerCommissionTypeOptions = [
  { value: '0', label: '到付' },
  { value: '1', label: '后付' },
]

// 支付方式
export const paymentTypeOptions: DictDataType[] = [
  { value: '0', label: '到付' },
  { value: '1', label: '后付' },
  { value: '2', label: '预付' },
  { value: '3', label: '船抵卸货港锚地前所有运费一次性结清' },
]

// 货量范围 百分比 MIN/MAX
export const EXTERNAL_CONTRACT_CARGO_RANGE_TYPE_DICT = [
  {
    value: '0',
    label: '百分比',
  },
  {
    value: '1',
    label: 'MIN/MAX',
  },
]

// 燃油规格
export const fuelSpecificationOptions: DictDataType[] = [
  { label: '高硫重油(HSFO)', value: '0' },
  { label: '超低硫重质油(ULSFO)', value: '1' },
  { label: '普通重质油(FO)', value: '2' },
  { label: '低硫重质油(LSFO)', value: '3' },
  { label: '普通重柴油(DO)', value: '4' },
  { label: '低硫重柴油(LSDO)', value: '5' },
  { label: '普通轻柴油(GO)', value: '6' },
  { label: '低硫轻柴油(LSGO)', value: '7' },
  { label: 'LNG', value: '8' },
  { label: '长城', value: '9' },
]
// 回款账期
export const repaymentPeriodOptions: DictDataType[] = [
  { label: '开票后', value: '0' },
  { label: '航次结束后', value: '1' },
]

// 运价类别
export const freightRateModelDictOptions: DictDataType[] = [
  { label: '运量', value: '0' },
  { label: '包干', value: '1' },
]

// 单位
export const unitDictOptions: DictDataType[] = [
  { label: '运费吨', value: '0' },
  { label: '立方米', value: '1' },
  { label: '重量吨', value: '2' },
  { label: '件', value: '3' },
]

// 装运条款
export const shippingTermsDictOptions: DictDataType[] = [
  { label: 'FLT管装管卸', value: '0' },
  { label: 'FIO不管装不管卸', value: '1' },
  { label: 'FILO不管装管卸', value: '2' },
  { label: 'LIFO管装不管卸', value: '3' },
]

// 经纪佣金类型
export const brokerCommissionTypeDictOptions: DictDataType[] = [
  { label: '运费', value: '0' },
  { label: '租金', value: '3' },
]

// 承运方式/航次类型
export const VOYAGE_TYPE_OPTIONS: DictDataType[] = [
  {
    value: '1',
    label: 'TC（期租）',
  },
  {
    value: '2',
    label: 'TCT（航次期租）',
  },
  {
    value: '3',
    label: 'VC（航次租船）',
  },
]

// 船型
export const VESSEL_TYPE_OPTIONS: DictDataType[] = [
  { label: '散货船', value: '0' },
  { label: '集装箱船', value: '1' },
  { label: '油轮', value: '2' },
  { label: '化学品船', value: '3' },
  { label: 'LNG船', value: '4' },
  { label: '其他', value: '5' },
]

// 结算周期类型
export const PAYMENT_CYCLE_TYPE_OPTIONS: DictDataType[] = [
  { label: '天', value: '0' },
  { label: '周', value: '1' },
  { label: '月', value: '2' },
  { label: '季', value: '3' },
  { label: '年', value: '4' },
]

// 支付周期
export const paymentCycleDictOptions: DictDataType[] = [
  {
    value: '0',
    label: '每月',
  },
  {
    value: '3',
    label: '合计',
  },
]

// 拆分规则
export const splitRuleTypeDictOptions: DictDataType[] = [
  { label: '30天（eg:1500/30*days）', value: '0' },
  { label: '31天（eg:1500/31*days）', value: '1' },
  { label: '365天（eg:1500*12/365*days）', value: '2' },
  { label: '366天（eg:1500*12/366*days）', value: '3' },
  { label: '不拆分', value: '5' },
]

// 租金类型
export const EXTERNAL_CONTRACT_RENTAL_TYPE_DICT: DictDataType[] = [
  { label: '固定租金', value: '0' },
  { label: '指数租金', value: '1' },
]

// 时间类型
export const EXTERNAL_CONTRACT_TIME_TYPE_DICT: DictDataType[] = [
  { label: '天数', value: '0' },
  { label: '日期', value: '1' },
]
// 卸货范围
export const EXTERNAL_CONTRACT_UNLOAD_RANGE_DICT: DictDataType[] = [
  { label: '北中国', value: '1' },
  { label: '东南亚', value: '2' },
  { label: '南中国', value: '3' },
  { label: '空', value: '0' },
]

// 客商评级 1-A1，2-A2，3-A3，4-B，5-黑名单
export const guestRatingMap: Record<number, string> = {
  1: 'A1',
  2: 'A2',
  3: 'A3',
  4: 'B',
  5: '黑名单',
}

// 核銷审核状态
export const verificationAuditStatusOptions: DictDataType[] = [
  // 0-待提交
  { label: '待提交', value: 0 },

  // 1-审批中
  { label: '审批中', value: 1 },

  // 2-审批通过
  { label: '审批通过', value: 2 },

  // 3-审批驳回
  { label: '审批驳回', value: 3 },

  // 4-已撤回
  { label: '已撤回', value: 4 },

  // 5-待支付
  { label: '待支付', value: 5 },

  // 6-支付中
  { label: '支付中', value: 6 },

  // 7-支付成功
  { label: '支付成功', value: 7 },

  // 8-支付失败
  { label: '支付失败', value: 8 },

  // 9-确认退回中
  { label: '确认退回中', value: 9 },

  // 10-作废审批中
  { label: '作废审批中', value: 10 },

  // 11-已作废
  { label: '已作废', value: 11 },

]

/**
 * 核销/付款单状态颜色映射
 * 根据状态 value 返回对应的颜色和样式类
 */
export const VERIFICATION_STATUS_COLOR_MAP = {
  // 通过状态 - 绿色
  approved: {
    color: '#07c160',
    class: 'status-approved',
    values: [2, 7], // 审批通过、支付成功
  },
  // 驳回状态 - 红色
  rejected: {
    color: '#ee0a24',
    class: 'status-rejected',
    values: [3, 8], // 审批驳回、支付失败
  },
  // 审批中/支付中状态 - 浅蓝色
  approving: {
    color: '#1989fa',
    class: 'status-approving',
    values: [1, 5, 6, 9, 10], // 审批中、待支付、支付中、确认退回中、作废审批中
  },
  // 撤回/作废状态 - 橙色
  withdrawn: {
    color: '#ff976a',
    class: 'status-withdrawn',
    values: [4, 11], // 已撤回、已作废
  },
  // 默认状态 - 浅蓝色
  default: {
    color: '#1989fa',
    class: 'status-approving',
    values: [0], // 待提交
  },
} as const

/**
 * 根据核销/付款单状态值获取状态信息
 * @param status 状态值（number）或状态文本（string）
 * @returns 状态信息对象
 */
export function getVerificationStatusInfo(status: number | string): StatusInfo {
  // 如果 status 是字符串，尝试从 verificationAuditStatusOptions 中查找对应的 value
  let statusValue: number
  if (typeof status === 'string') {
    // 尝试匹配状态文本，获取对应的 value
    const matched = verificationAuditStatusOptions.find(opt => opt.label === status)
    statusValue = matched ? matched.value : 1 // 默认审批中 (value: 1)
  }
  else {
    statusValue = status
  }

  // 根据 value 查找对应的 label（用于显示文本）
  const statusOption = verificationAuditStatusOptions.find(opt => opt.value === statusValue)
  const label = statusOption?.label || '审批中'

  // 根据 value 设置颜色和样式类
  let color: string = VERIFICATION_STATUS_COLOR_MAP.default.color
  let statusClass: string = VERIFICATION_STATUS_COLOR_MAP.default.class

  // 遍历颜色映射，找到匹配的状态值
  for (const [key, config] of Object.entries(VERIFICATION_STATUS_COLOR_MAP)) {
    if (key !== 'default' && (config.values as readonly number[]).includes(statusValue)) {
      color = config.color
      statusClass = config.class
      break
    }
  }

  return {
    label, // 使用 label 显示文本
    color, // 使用 value 判断颜色
    statusClass,
    value: statusValue, // 保存 value 供调试使用
  }
}
// 核销类型
export const verificationTypeOptions: DictDataType[] = [
  { label: '运费应收核销', value: 1 },
  { label: '租金应收核销', value: 2 },
  { label: '第三方应收核销', value: 3 },
  { label: '运费退款核销', value: 4 },
  { label: '租金退款核销', value: 5 },
  { label: '港使费退款核销', value: 6 },
  { label: '第三方退款核销', value: 7 },
]

// 款项性质
export const bizItemTypeOptions: DictDataType[] = [
  { label: '运费收入', value: '1' },
  { label: '租金收入', value: '2' },
  { label: '第三方收入', value: '3' },
  { label: '运费退款', value: '4' },
  { label: '租金退款', value: '5' },
  { label: '第三方退款', value: '6' },
  { label: '港使费退款', value: '7' },
]

// 结算方式
export const settlementMethodOptions: DictDataType[] = [
  {
    label: '现金',
    value: '0',
  },
  {
    label: '现金支票',
    value: '1',
  },
  {
    label: '银行转账',
    value: '10',
  },
  {
    label: '银企直联',
    value: '3',
  },
  {
    label: '电汇',
    value: '4',
  },
  {
    label: '银承兑汇',
    value: '5',
  },
]

// 银行回单-支付状态
export const bankPayStatusOptions: DictDataType[] = [
  {
    label: '未支付',
    value: 0,
  },
  {
    label: '支付成功',
    value: 1,
  },
  {
    label: '支付失败',
    value: 2,
  },
  {
    label: '支付中',
    value: 3,
  },
]

// 汇款手续费方式
export const bankFeeTypeOptions: DictDataType[] = [
  {
    label: 'SHA（共同承担）',
    value: '1',
  },
  {
    label: 'OUR（汇款人承担）',
    value: '2',
  },
  {
    label: 'BEN（收款人承担）',
    value: '3',
  },
]

// 缓存对象，用于存储初始化的数据
const initDataCache = {
  businessCodeDictOptions: null as any[] | null,
  projectDictOptions: null as any[] | null,
  projectGroupDictOptions: null as any[] | null,
  operatorDictOptions: null as any[] | null,
  shipOptions: null as any[] | null,
  portOptions: null as any[] | null,
  goodTypesOptions: null as any[] | null,
  orgOptions: null as any[] | null,
  isoOPtions: null as any[] | null,
  expenseCategoryOptions: null as any[] | null,
  categoryWithSubjectTree: null as any[] | null,
  voyageNoConfigSelectListOptions: null as any[] | null,
  subjectListOptions: null as any[] | null,
  voyageNoConfigListOptions: null as any[] | null, // 航次号真实数据
  countryInfoListOptions: null as any[] | null, // 国家列表
  initialized: false,
  pendingPromise: null as Promise<any> | null, // 正在进行的请求 Promise
}
/**
 * 初始化所有选项数据，带有缓存机制
 * 第一次调用时加载数据，后续调用直接返回缓存数据
 */
export async function initOptions() {
  // 如果已经初始化过，则直接返回缓存数据
  // 多页面调用时，判断是否已经发送请求,如果没有发送请求，再发送请求,否则等待请求返回

  if (initDataCache.initialized) {
    return {
      businessCodeDictOptions: initDataCache.businessCodeDictOptions,
      projectDictOptions: initDataCache.projectDictOptions,
      projectGroupDictOptions: initDataCache.projectGroupDictOptions,
      operatorDictOptions: initDataCache.operatorDictOptions,
      shipOptions: initDataCache.shipOptions,
      portOptions: initDataCache.portOptions,
      goodTypesOptions: initDataCache.goodTypesOptions,
      orgOptions: initDataCache.orgOptions,
      isoOPtions: initDataCache.isoOPtions,
      expenseCategoryOptions: initDataCache.expenseCategoryOptions,
      categoryWithSubjectTree: initDataCache.categoryWithSubjectTree,
      voyageNoConfigSelectListOptions: initDataCache.voyageNoConfigSelectListOptions,
      subjectListOptions: initDataCache.subjectListOptions,
      voyageNoConfigListOptions: initDataCache.voyageNoConfigListOptions,
      countryInfoListOptions: initDataCache.countryInfoListOptions, // 国家列表
    }
  }

  // 多页面调用时，判断是否已经发送请求,如果没有发送请求,再发送请求,否则等待请求返回
  if (initDataCache.pendingPromise) {
    return await initDataCache.pendingPromise
  }

  // 创建新的请求 Promise
  initDataCache.pendingPromise = (async () => {
    try {
      // 并行请求所有数据以提高性能
      const [
        guestBusinessList,
        employeeList,
        projectList,
        projectGroupList,
        shipList,
        portList,
        goodsCategoryList,
        orgList,
        isoList,
        categoryWithSubjectTree,
        voyageNoConfigSelectList,
        subjectList,
        categoryList,
        voyageNoConfigList,
        countryInfoList,
      ] = await Promise.all([
        getGuestBusinessList(),
        getAllEmployee(),
        getAllProject(),
        getAllProjectGroup(),
        getListVesselInfo(),
        getAllPort(),
        getAllGoods(),
        getAllOrgt(),
        getCurrencyInfoOptions(),
        getExpenseCategoryTreeWithSubject(),
        getVoyageNoConfigSelectList(),
        getStatisticsSubjectList(),
        getExpenseAccountList(),
        getVoyageNoConfigList(),
        getCountryList(),
      ])

      // 处理客商档案下拉
      const businessCodeDictOptions
        = guestBusinessList?.map(item => ({
          value: item.code,
          id: item.id,
          label: `${item.customerFullName}(${guestRatingMap[item.guestRating as number] ?? '未知等级'})`,
          disabled: item.isEnable === 0,
        })) || []

      // 处理员工下拉
      const employeeDictOptions = employeeList.map(item => ({
        label: item.employeeName,
        value: item.employeeId,
      }))

      // 处理项目下拉
      const projectDictOptions = projectList.map(item => ({
        label: item.projectName,
        value: item.code,
        projectLeaderId: item.projectLeaderId,
        projectLeaderName: item.projectLeaderName,
      }))

      // 处理项目组下拉
      const projectGroupDictOptions = projectGroupList.map(item => ({
        label: item.groupName,
        value: item.code,
        groupLeaderId: item.groupLeaderId,
      }))

      // 处理船舶档案
      const shipOptions = shipList.map(item => ({
        ...item,
        label: item.cnName,
        value: item.code,
      }))

      // 处理港口下拉
      const portOptions = portList.map(item => ({
        label: item.portCnName,
        value: item.code,
      }))

      // 处理货种下拉
      const goodTypesOptions = goodsCategoryList.map((item) => {
        return {
          label: item.goodsCnName,
          value: item.goodsCode,
        }
      })
      // 组织下拉
      const orgOptions = orgList.map((item) => {
        return {
          label: item.orgName,
          value: item.orgCode,
        }
      })
      const isoOPtions = isoList.map((i) => {
        return {
          label: i.cnName,
          value: i.currencyCode,
          disabled: i.isEnable === 0,
        }
      })

      // 处理航次号下拉
      const voyageNoConfigSelectListOptions = voyageNoConfigSelectList.map((i) => {
        return {
          label: i.voyageNo,
          value: i.voyageCode,
          vesselCode: i.vesselCode,
        }
      })
      // 处理费用科目下拉
      const subjectListOptions = subjectList.map((i) => {
        return {
          label: i.cnName,
          value: i.code,
        }
      })
      // 处理费用类别下拉
      const expenseCategoryOptions = categoryList.map((i) => {
        return {
          label: i.cnName,
          value: i.categoryCode,
        }
      })
      // 处理外部航次编号配置下拉-真实数据
      const voyageNoConfigListOptions = voyageNoConfigList.map((i) => {
        return {
          label: i.externalVoyageNo,
          value: i.extVoyageCode,
        }
      })
      // 处理国家下拉
      const countryInfoListOptions = countryInfoList.map((i) => {
        return {
          label: i.countryCnName,
          value: i.code,
        }
      })

      // 缓存所有数据
      initDataCache.businessCodeDictOptions = businessCodeDictOptions
      initDataCache.projectDictOptions = projectDictOptions
      initDataCache.projectGroupDictOptions = projectGroupDictOptions
      initDataCache.operatorDictOptions = employeeDictOptions
      initDataCache.shipOptions = shipOptions
      initDataCache.portOptions = portOptions
      initDataCache.goodTypesOptions = goodTypesOptions
      initDataCache.orgOptions = orgOptions
      initDataCache.isoOPtions = isoOPtions
      initDataCache.categoryWithSubjectTree = categoryWithSubjectTree
      initDataCache.initialized = true
      initDataCache.voyageNoConfigSelectListOptions = voyageNoConfigSelectListOptions
      initDataCache.subjectListOptions = subjectListOptions
      initDataCache.expenseCategoryOptions = expenseCategoryOptions
      initDataCache.voyageNoConfigListOptions = voyageNoConfigListOptions
      initDataCache.countryInfoListOptions = countryInfoListOptions

      // 返回处理后的数据
      const result = {
        businessCodeDictOptions,
        projectDictOptions,
        projectGroupDictOptions,
        operatorDictOptions: employeeDictOptions,
        shipOptions,
        portOptions,
        goodTypesOptions,
        orgOptions,
        isoOPtions,
        categoryWithSubjectTree,
        voyageNoConfigSelectListOptions,
        subjectListOptions,
        expenseCategoryOptions,
        voyageNoConfigListOptions,
        countryInfoListOptions,
      }

      // 清除 pendingPromise，允许后续请求
      // initDataCache.pendingPromise = null
      return result
    }
    catch (error) {
      // 请求失败时也要清除 pendingPromise，允许重试
      initDataCache.pendingPromise = null
      console.error('初始化选项数据失败:', error)
      throw error
    }
  })()

  return await initDataCache.pendingPromise
}

/**
 * 不同核销类型对应的表头配置
 * 用于控制 FinancialReceiptDetailTable 组件中列的显示
 * 运费(1,4): 所有现有字段
 * 港使费(6): 船名、航次、港口、国家地区、港口目的、费用科目、实收金额、币种、备注、结算单位（我方）、结算单位（对方）、港序、计划抵港日期、计划离港日期、租赁方向
 * 第三方(3,7): 船名、航次、费用科目、金额、币种、实收金额、费用标准、备注、结算单位（我方）、结算单位（对方）、附件、合同号、租赁方向
 * 租金(2,5): 船名、航次、租金期数、费用科目、实收金额、币种、计算说明、备注、结算单位（我方）、结算单位（对方）、租期开始时间、租期结束时间、扣租事项、租赁方向
 */
export const verificationTypeTableColumnsConfig: Record<
  number,
  {
    vesselCode?: boolean // 船名
    voyageCode?: boolean // 航次
    portCode?: boolean // 港口
    countryRegion?: boolean // 国家地区
    portPurpose?: boolean // 港口目的
    subjectCode?: boolean // 费用科目
    receiptAmt?: boolean // 实收金额
    amount?: boolean // 金额（第三方）
    currencyCode?: boolean // 币种
    remark?: boolean // 备注
    counterSettlementUnit?: boolean // 结算单位（我方）
    settlementUnit?: boolean // 结算单位（对方）
    portSequence?: boolean // 港序
    plannedArrivalDate?: boolean // 计划抵港日期
    plannedDepartureDate?: boolean // 计划离港日期
    charterDirection?: boolean // 租赁方向
    feeStandard?: boolean // 费用标准（第三方）
    attachment?: boolean // 附件（第三方）
    contractNo?: boolean // 合同号（第三方）
    leasePeriod?: boolean // 租金期数（租金）
    calculationNote?: boolean // 计算说明（租金）
    leaseStartTime?: boolean // 租期开始时间（租金）
    leaseEndTime?: boolean // 租期结束时间（租金）
    deductionItem?: boolean // 扣租事项（租金）
    // 运费专用字段
    cargoDamageReason?: boolean // 差异原因
    voyageStartTime?: boolean // 航次开始时间
    voyageEndTime?: boolean // 航次结束时间
    loadPortCode?: boolean // 装港
    dischargePortCode?: boolean // 卸港
    goodsCode?: boolean // 货物
    actualCargoVolume?: boolean // 结算货量
  }
> = {
  // 运费应收核销 (1) - 所有现有字段
  1: {
    vesselCode: true,
    voyageCode: true,
    subjectCode: true,
    receiptAmt: true,
    currencyCode: true,
    settlementUnit: true,
    counterSettlementUnit: true,
    charterDirection: true,
    calculationNote: true,
    cargoDamageReason: true,
    remark: true,
    voyageStartTime: true,
    voyageEndTime: true,
    loadPortCode: true,
    dischargePortCode: true,
    goodsCode: true,
    actualCargoVolume: true,
  },
  // 租金应收核销 (2)
  2: {
    vesselCode: true,
    voyageCode: true,
    leasePeriod: true,
    subjectCode: true,
    receiptAmt: true,
    currencyCode: true,
    calculationNote: true,
    remark: true,
    counterSettlementUnit: true,
    settlementUnit: true,
    leaseStartTime: true,
    leaseEndTime: true,
    deductionItem: true,
    charterDirection: true,
  },
  // 第三方应收核销 (3)
  3: {
    vesselCode: true,
    voyageCode: true,
    subjectCode: true,
    amount: true,
    currencyCode: true,
    receiptAmt: true,
    feeStandard: true,
    remark: true,
    counterSettlementUnit: true,
    settlementUnit: true,
    attachment: true,
    contractNo: true,
    charterDirection: true,
  },
  // 运费退款核销 (4) - 所有现有字段
  4: {
    vesselCode: true,
    voyageCode: true,
    subjectCode: true,
    receiptAmt: true,
    currencyCode: true,
    settlementUnit: true,
    counterSettlementUnit: true,
    charterDirection: true,
    calculationNote: true,
    cargoDamageReason: true,
    remark: true,
    voyageStartTime: true,
    voyageEndTime: true,
    loadPortCode: true,
    dischargePortCode: true,
    goodsCode: true,
    actualCargoVolume: true,
  },
  // 租金退款核销 (5)
  5: {
    vesselCode: true,
    voyageCode: true,
    leasePeriod: true,
    subjectCode: true,
    receiptAmt: true,
    currencyCode: true,
    calculationNote: true,
    remark: true,
    counterSettlementUnit: true,
    settlementUnit: true,
    leaseStartTime: true,
    leaseEndTime: true,
    deductionItem: true,
    charterDirection: true,
  },
  // 港使费退款核销 (6)
  6: {
    vesselCode: true,
    voyageCode: true,
    portCode: true,
    countryRegion: true,
    portPurpose: true,
    subjectCode: true,
    receiptAmt: true,
    currencyCode: true,
    remark: true,
    counterSettlementUnit: true,
    settlementUnit: true,
    portSequence: true,
    plannedArrivalDate: true,
    plannedDepartureDate: true,
    charterDirection: true,
  },
  // 第三方退款核销 (7)
  7: {
    vesselCode: true,
    voyageCode: true,
    subjectCode: true,
    amount: true,
    currencyCode: true,
    receiptAmt: true,
    feeStandard: true,
    remark: true,
    counterSettlementUnit: true,
    settlementUnit: true,
    attachment: true,
    contractNo: true,
    charterDirection: true,
  },
}
