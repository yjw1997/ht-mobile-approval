/**
 * ResponsePaymentOrderDTO
 */
export interface Response {
  code: number
  data?: PaymentOrderDTO
  message?: string
  [property: string]: any
}

/**
 * PaymentOrderDTO
 */
export interface PaymentOrderDTO {
  /**
   * 账户类型
   */
  accountType?: string
  /**
   * 申请人所属部门
   */
  applicantDeptId?: number
  /**
   * 申请付款人
   */
  applicantId?: number
  /**
   * 申请付款金额
   */
  applyAmt?: number
  /**
   * 通过原因
   */
  approvalReason?: string
  /**
   * 银行账号
   */
  bankAccount?: string
  /**
   * 银行账号名称
   */
  bankAccountName?: string
  /**
   * 银行地址
   */
  bankAddress?: string
  /**
   * 银行汇款附言
   */
  bankMessage?: string
  /**
   * 银行名称
   */
  bankName?: string
  /**
   * 银行回单数据
   */
  bankReceiptList?: BankReceiptDTO[]
  /**
   * ncc单据号
   */
  billno?: string
  /**
   * 经营模式
   */
  businessModel?: number
  /**
   * 作废人
   */
  cancelledOptId?: number
  /**
   * 作废原因
   */
  cancelledReason?: string
  /**
   * 作废时间
   */
  cancelledTime?: string
  /**
   * 租赁方向
   */
  charterDirection?: number
  /**
   * 租船类型
   */
  charterType?: number
  /**
   * 业务主键
   */
  code?: string
  /**
   * 合同code
   */
  contractCode?: string

  /**
   * 合同号
   */
  contractNo?: string
  /**
   * 创建时间结束
   */
  createEndTime?: string
  /**
   * 创建人
   */
  createId?: number
  /**
   * 创建时间开始
   */
  createStartTime?: string
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 币种
   */
  currency?: string
  /**
   * 流程所属部门
   */
  deptId?: number
  /**
   * 执行航次codes
   */
  executeVoyageCodes?: string[]
  /**
   * 汇款手续费承担方式
   */
  feeBearType?: string
  /**
   * 费用类别
   */
  feeCategory?: string
  /**
   * 费用明细
   */
  feeDetailList?: FeeDetailDTO[]
  /**
   * 费用科目
   */
  feeSubject?: string
  /**
   * 附件信息
   */
  fileAttachmentDTOS?: FileAttachmentDTO[]
  /**
   * 财务支付说明
   */
  financeDesc?: string
  /**
   * 主键ID
   */
  id?: number
  /**
   * 是否指定中间行 0-否 1-是
   */
  intermediateBankFlag?: number
  /**
   * 中间行名称
   */
  intermediateBankName?: string
  /**
   * SWIFT CODE(中间行)
   */
  intermediateSwiftCode?: string
  /**
   * 是否删除：1为已删除,0为未删除
   */
  isDeleted?: number
  /**
   * 最迟付款日期
   */
  latestPayDate?: string
  /**
   * NCC合同主键
   */
  nccPkContract?: string
  /**
   * NCC推送状态 1-推送成功 0 推送失败
   */
  nccPushStatus?: number
  /**
   * 其他代码
   */
  otherCode?: string
  /**
   * 收款单位
   */
  payee?: string
  /**
   * 收款单位国别
   */
  payeeCountry?: string
  /**
   * 付款单位
   */
  payer?: string
  /**
   * 付款单位的银行账号
   */
  payerBankAccount?: string
  /**
   * 付款事项
   */
  payItem?: string
  /**
   * 审批单信息
   */
  paymentApprovalOrderList?: PaymentApprovalOrderDTO[]
  /**
   * 付款单编号
   */
  paymentNo?: string
  /**
   * 支付成功结束时间
   */
  paySuccessEndTime?: string
  /**
   * 支付成功开始时间
   */
  paySuccessStartTime?: string
  /**
   * 支付成功时间
   */
  paySuccessTime?: string
  /**
   * 付款类型 0-运费付款 1-租金付款 2-第三方费用付款 3-港使费预付款 4-港使费结算付款 5-运费收入退款 6-租金收入退款 7-第三方收入退款
   */
  payType?: string
  /**
   * ncc单据主键
   */
  pkBill?: string
  /**
   * ncc组织编码
   */
  pkOrg?: string
  /**
   * 额外字段 港口委托信息id
   */
  portEntrustmentInfoId?: string
  /**
   * 港口
   */
  portName?: string
  /**
   * 已预付金额金额
   */
  prePaidAmount?: number
  /**
   * 是否预付款 0-否 1-是
   */
  prepaymentFlag?: number
  /**
   * 推送失败原因
   */
  pushFailReason?: string
  /**
   * 驳回原因
   */
  rejectReason?: string
  /**
   * 备注
   */
  remark?: string
  /**
   * 租金期数
   */
  rentalPeriod?: string
  /**
   * 结算方式
   */
  settleMethod?: string

  /**
   * 单据状态 0-待提交 1-审批中 2-审批通过 3-审批驳回 4-审批终止 5-待支付 6-支付中 7-支付成功 8-支付失败 9-确认退回中 10-作废审批中 11-已作废
   */
  status?: number
  /**
   * SWIFT CODE
   */
  swiftCode?: string
  /**
   * 更新人
   */
  updateId?: number
  /**
   * 更新时间
   */
  updateTime?: string
  /**
   * 是否急付：0-否 1-是
   */
  urgentFlag?: number
  /**
   * 船名
   */
  vesselCode?: string
  /**
   * 船名
   */
  vesselName?: string
  /**
   * 航次号
   */
  voyageCode?: string
  /**
   * 是否航次结算 0-否 1-是
   */
  voyageSettleFlag?: number
  /**
   * 撤回原因
   */
  withdrawReason?: string
  [property: string]: any
}

/**
 * 银行回单表(BankReceipt)DTO
 * author: liwenzhu
 * date: 2025-12-05
 *
 * BankReceiptDTO
 */
export interface BankReceiptDTO {
  /**
   * 实际付款账户
   */
  actualPayAccount?: string
  /**
   * 实际付款公司
   */
  actualPayCompany?: string
  /**
   * 交易金额
   */
  amount?: number
  /**
   * 银行流水号
   */
  bankFlowNo?: string
  /**
   * 目标业务主键
   */
  bizCode?: string
  /**
   * 回单编号
   */
  code?: string
  /**
   * 创建人
   */
  createId?: number
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 主键ID
   */
  id?: number
  /**
   * 支付状态：0-未支付 1-成功 2-失败
   */
  payStatus?: number
  /**
   * 银行回单文件地址
   */
  receiptFileUrl?: string
  /**
   * 数据表分类 0-付款单表 1-收款认领表
   */
  type?: number
  [property: string]: any
}

/**
 * 合同经纪信息表(ContractExternalBrokerInfo)DTO
 * author: gejiajie
 * date: 2025-10-31
 *
 * ContractExternalBrokerInfoDTO
 */
export interface ContractExternalBrokerInfoDTO {
  /**
   * 合同唯一标识 关联外贸合同表
   */
  bizCode?: string
  /**
   * 经纪佣金类型
   */
  brokerCommissionType?: string
  /**
   * 经纪佣金%
   */
  brokerCommissionValue?: number
  /**
   * 业务主键
   */
  code?: string
  /**
   * 创建人ID
   */
  createId?: number
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 客商编码 来自客商信息表
   */
  guestBusinessCode?: string
  /**
   * 自增主键ID
   */
  id?: number
  /**
   * 是否客户/租家代付
   */
  isClientSettlement?: number
  /**
   * 更新人ID
   */
  updateId?: number
  /**
   * 更新时间
   */
  updateTime?: string
  [property: string]: any
}

/**
 * 租家支付费用信息表(ContractExternalPaymentInfo)DTO
 * author: gejiajie
 * date: 2025-10-31
 *
 * ContractExternalPaymentInfoDTO
 */
export interface ContractExternalPaymentInfoDTO {
  /**
   * 金额
   */
  amount?: number
  /**
   * 合同唯一标识 关联外贸合同表
   */
  bizCode?: string
  /**
   * 唯一标识
   */
  code?: string
  /**
   * 创建人ID
   */
  createId?: number
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 费用科目唯一主键 关联费用科目表
   */
  expenseSubjectCode?: string
  /**
   * 自增主键ID
   */
  id?: number
  /**
   * 支付周期
   */
  paymentCycle?: string
  /**
   * 拆分规则 来源字典表
   */
  splitRule?: string
  /**
   * 更新人ID
   */
  updateId?: number
  /**
   * 更新时间
   */
  updateTime?: string
  [property: string]: any
}

/**
 * 外贸船舶航向表(ContractExternalRoute)DTO
 * author: gejiajie
 * date: 2025-10-31
 *
 * ContractExternalRouteDTO
 */
export interface ContractExternalRouteDTO {
  /**
   * 合同唯一标识 关联外贸合同表
   */
  bizCode?: string
  /**
   * 唯一标识
   */
  code?: string
  /**
   * 外贸船舶航向信息集合
   */
  contractExternalRouteInfoDTOS?: ContractExternalRouteInfoDTO[]
  /**
   * 创建人ID
   */
  createId?: number
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 自增主键ID
   */
  id?: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 更新人ID
   */
  updateId?: number
  /**
   * 更新时间
   */
  updateTime?: string
  /**
   * 船舶航向名称
   */
  vesselRouteName?: string
  [property: string]: any
}

/**
 * 外贸船舶航向信息表(ContractExternalRouteInfo)DTO
 * author: gejiajie
 * date: 2025-10-31
 *
 * ContractExternalRouteInfoDTO
 */
export interface ContractExternalRouteInfoDTO {
  /**
   * 外贸船舶航向表唯一标识 关联外贸船舶航向表
   */
  bizCode?: string
  /**
   * 唯一标识
   */
  code?: string
  /**
   * 创建人ID
   */
  createId?: number
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 自增主键ID
   */
  id?: number
  /**
   * 指数类型 来源指数表
   */
  indexType?: string
  /**
   * 百分比
   */
  proportion?: number
  /**
   * 日租金
   */
  rentalNumber?: number
  /**
   * 租金类型 来源字典表
   */
  rentalType?: string
  /**
   * 天数范围
   */
  timeRangeDay?: string
  /**
   * 结束日期
   */
  timeRangeEnd?: string
  /**
   * 开始日期
   */
  timeRangeStart?: string
  /**
   * 来源字典表
   */
  timeType?: string
  /**
   * 卸货范围 来源字典表
   */
  unloadRange?: string
  /**
   * 更新人ID
   */
  updateId?: number
  /**
   * 更新时间
   */
  updateTime?: string
  [property: string]: any
}

/**
 * com.highton.basic.data.api.dto.fileAttachment.FileAttachmentDTO
 *
 * FileAttachmentDTO
 */
export interface FileAttachmentDTO {
  appCode?: string
  bizCode?: string
  bizExtend?: JSONObject
  createId?: number
  createTime?: string
  fileCode?: string
  fileName?: string
  filePath?: string
  fileSize?: string
  fileType?: string
  id?: number
  isDeleted?: number
  updateId?: number
  updateTime?: string
  [property: string]: any
}

/**
 * JSONObject
 */
export interface JSONObject {
  key?: { [key: string]: any }
  [property: string]: any
}

/**
 * 费用明细表 FeeDetailPO
 *
 * FeeDetailDTO
 */
export interface FeeDetailDTO {
  /**
   * 实际货量/体积
   */
  actualCargoVolume?: number
  /**
   * 预收比例
   */
  advancePercent?: number
  /**
   * 代理结算单位
   */
  agentSettlementUnit?: string
  /**
   * 不含税金额
   */
  amountWithoutTax?: number
  /**
   * 外部系统主键
   */
  bizCode?: string
  /**
   * 经营模式
   */
  businessModel?: BusinessModel
  /**
   * 计算说明
   */
  calculationNote?: string
  /**
   * 货差(%)
   */
  cargoDamageRate?: number
  /**
   * 货差原因
   */
  cargoDamageReason?: string
  /**
   * 货主/租家
   */
  cargoOwner?: string
  /**
   * 费用类型编码
   */
  categoryCode?: string
  /**
   * 费用类型
   */
  categoryName?: string
  /**
   * 租赁方向
   */
  charterDirection?: CharterDirection
  /**
   * 租赁方向(code值)
   */
  charterDirectionCode?: number
  /**
   * 租赁方向(名称)
   */
  charterDirectionName?: string
  /**
   * 租船类型
   */
  charterType?: CharterType
  /**
   * 系统主键
   */
  code?: string
  /**
   * 已收/付金额
   */
  collectedAmount?: number
  /**
   * 收/付中金额
   */
  collectingAmount?: number
  /**
   * 收/付款状态（0-未收/付款，1-已收/付款 2-部分收/付款）
   */
  collectionStatus?: CollectionStatus
  /**
   * 佣金比例
   */
  commissionRate?: number
  /**
   * 合同货量/体积
   */
  contractCargoVolume?: number
  /**
   * 合同号
   */
  contractCode?: string
  /**
   * 承运方式
   */
  contractMode?: string
  /**
   * 合同号
   */
  contractNo?: string
  /**
   * 合同类型
   */
  contractType?: ContractType
  /**
   * 数量（如果是燃油费，则是油量；如果是租金，则是计算天数；如果是亏舱，则为亏舱货量）
   */
  count?: number
  /**
   * 对方结算单位
   */
  counterSettlementUnit?: string
  /**
   * 国家编码(查询字段)
   */
  countryCode?: string
  /**
   * 国家名称
   */
  countryName?: string
  /**
   * 数量单位
   */
  countUnit?: string
  /**
   * 创建人id
   */
  createId?: number
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 币种编码
   */
  currencyCode?: string
  /**
   * 币种
   */
  currencyName?: string
  /**
   * 本次付款金额(额外入参数字段 不是记录这张表)
   */
  currentPayAmt?: number
  /**
   * 提单号
   */
  deliveryOrderNo?: string
  /**
   * 卸港编码
   */
  dischargePortCode?: string
  /**
   * 暂估金额
   */
  estimateAmount?: number
  /**
   * 暂估状态
   */
  estimateStatus?: EstimateStatus
  /**
   * 暂估类型
   */
  estimateType?: number
  /**
   * 汇率
   */
  exchangeRate?: number
  /**
   * 执行单号
   */
  executeVoyageCode?: string
  /**
   * 航次执行id
   */
  executeVoyageId?: number
  /**
   * 航次执行状态 查询字段
   */
  executeVoyageStatus?: number
  /**
   * 港序
   */
  executionSort?: number
  /**
   * 费用code
   */
  feeCode?: string
  /**
   * 事项说明
   */
  feeExplain?: string
  /**
   * 费用ID
   */
  feeId?: number
  /**
   * 费用标准
   */
  feeStandard?: string
  /**
   * 费用类型
   */
  feeType?: FeeType
  /**
   * 附件信息
   */
  fileAttachmentDTOS?: FileAttachmentDTO[]
  /**
   * 文件业务关联列表
   */
  fileBizRelationDTOList?: FileBizRelationDTO[]
  /**
   * 燃油类型
   */
  fuelType?: FuelType
  /**
   * 0-应收 1-应付
   */
  fundDirection?: FundDirection
  /**
   * 货物编码
   */
  goodsCode?: string
  /**
   * 费用明细id
   */
  id?: number
  /**
   * 指数租金百分比
   */
  indexedRentPercentage?: number
  /**
   * 已开/收票金额
   */
  invoicedAmount?: number
  /**
   * 开/收票状态（0-未/收开票，1-已开/收票 2-部分开/收票）
   */
  invoiceStatus?: InvoiceStatus
  /**
   * 开/收票中金额
   */
  invoicingAmount?: number
  /**
   * 1删除0未删
   */
  isDeleted?: number
  /**
   * 装港编码
   */
  loadPortCode?: string
  /**
   * 已支付金额(额外入参数字段 不是记录这张表)
   */
  paidAmt?: number
  /**
   * 支付中的金额(额外入参数字段 不是记录这张表)
   */
  payingAmt?: number
  /**
   * 付款说明
   */
  paymentDesc?: string
  /**
   * 计划抵港日期(查询字段)
   */
  plannedArrivalDate?: string
  /**
   * 计划离港日期(查询字段)
   */
  plannedDepartureDate?: string
  /**
   * 港口编码
   */
  portCode?: string
  /**
   * 港口归属国家
   */
  portCountry?: string
  /**
   * 港口目的
   */
  portGoal?: string
  /**
   * 港口
   */
  portName?: string
  /**
   * 项目code
   */
  projectCode?: string
  /**
   * 项目组code
   */
  projectGroupCode?: string
  /**
   * 项目组
   */
  projectGroupName?: string
  /**
   * 项目
   */
  projectName?: string
  /**
   * 实收金额(额外入参数字段)
   */
  receiptAmt?: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 租金结束时间(查询字段)
   */
  rentalEndTime?: string
  /**
   * 租金期数
   */
  rentalPeriod?: string
  /**
   * 租金开始时间(查询字段)
   */
  rentalStartTime?: string
  /**
   * 扣租比例
   */
  rentDeductionRatio?: number
  /**
   * 结算金额
   */
  settlementAmount?: number
  /**
   * 结算币种编码
   */
  settlementCurrencyCode?: string
  /**
   * 结算币种
   */
  settlementCurrencyName?: string
  /**
   * 本方结算单位
   */
  settlementUnit?: string
  /**
   * 科目类型编码
   */
  subjectCode?: string
  /**
   * 科目类型
   */
  subjectName?: string
  /**
   * 税额
   */
  taxAmount?: number
  /**
   * 含税金额
   */
  taxIncludeAmount?: number
  /**
   * 税率
   */
  taxRate?: number
  /**
   * 未收/付款金额
   */
  uncollectedAmount?: number
  /**
   * 未开/收票金额
   */
  unInvoicedAmount?: number
  /**
   * 单价
   */
  unitPrice?: number
  /**
   * 更新人id
   */
  updateId?: number
  /**
   * 更新时间
   */
  updateTime?: string
  /**
   * 版本号
   */
  version?: number
  /**
   * 船名
   */
  vesselCode?: string
  /**
   * 船名
   */
  vesselName?: string
  /**
   * 航次号
   */
  voyageCode?: string
  /**
   * 航次结束时间(查询字段)
   */
  voyageEndTime?: string
  /**
   * 航次号
   */
  voyageNo?: string
  /**
   * 航次开始时间(查询字段)
   */
  voyageStartTime?: string
  [property: string]: any
}

/**
 * 经营模式
 */
export enum BusinessModel {
  Op = 'OP',
  Self = 'SELF',
}

/**
 * 租赁方向
 */
export enum CharterDirection {
  DeliveryStorage = 'DELIVERY_STORAGE',
  EstimatedReturnStorage = 'ESTIMATED_RETURN_STORAGE',
}

/**
 * 租船类型
 */
export enum CharterType {
  Tc = 'TC',
  Tct = 'TCT',
  Vc = 'VC',
}

/**
 * 收/付款状态（0-未收/付款，1-已收/付款 2-部分收/付款）
 */
export enum CollectionStatus {
  Collected = 'COLLECTED',
  Collecting = 'COLLECTING',
  Part = 'PART',
  Uncollected = 'UNCOLLECTED',
}

/**
 * 合同类型
 */
export enum ContractType {
  CoaContractOfAffreightment = 'COA_CONTRACT_OF_AFFREIGHTMENT',
  HaulingContract = 'HAULING_CONTRACT',
  TcTimeCharter = 'TC_TIME_CHARTER',
  TctVoyageTimeCharter = 'TCT_VOYAGE_TIME_CHARTER',
  VcVoyageCharter = 'VC_VOYAGE_CHARTER',
}

/**
 * 暂估状态
 */
export enum EstimateStatus {
  NotNeeded = 'NOT_NEEDED',
}

/**
 * 费用类型
 */
export enum FeeType {
  AgentCommission = 'AGENT_COMMISSION',
  Commission = 'COMMISSION',
  DeadFreight = 'DEAD_FREIGHT',
  DeliveryReturnFuel = 'DELIVERY_RETURN_FUEL',
  Demurrage = 'DEMURRAGE',
  Dispatch = 'DISPATCH',
  Freight = 'FREIGHT',
  FreightHandlingFee = 'FREIGHT_HANDLING_FEE',
  Other = 'OTHER',
  Port = 'PORT',
  PreviousRent = 'PREVIOUS_RENT',
  Rent = 'RENT',
  RentDeduction = 'RENT_DEDUCTION',
  RentOther = 'RENT_OTHER',
  RenterAgentCommission = 'RENTER_AGENT_COMMISSION',
  Third = 'THIRD',
  ThirdHandlingFee = 'THIRD_HANDLING_FEE',
}

/**
 * 文件业务关联 DTO
 * author: Deng's
 * since: 2025-12-13
 *
 * FileBizRelationDTO
 */
export interface FileBizRelationDTO {
  /**
   * 业务主键
   */
  bizCode?: string
  /**
   * 业务模块
   */
  bizModule?: string
  /**
   * 业务类型
   */
  bizType?: string
  /**
   * 创建人
   */
  createId?: number
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 文件唯一编码
   */
  fileCode?: string
  /**
   * 文件名称（扩展字段，来源附件服务）
   */
  fileName?: string
  /**
   * 文件路径（扩展字段，来源附件服务）
   */
  filePath?: string
  /**
   * 文件大小（扩展字段，来源附件服务）
   */
  fileSize?: string
  /**
   * 文件类型（扩展字段，来源附件服务）
   */
  fileType?: string
  /**
   * 主键ID
   */
  id?: number
  /**
   * 关联类型，默认 ATTACH
   */
  relationType?: string
  [property: string]: any
}

/**
 * 燃油类型
 */
export enum FuelType {
  HeavyOilPumping = 'HEAVY_OIL_PUMPING',
  HeavyOilRefuelling = 'HEAVY_OIL_REFUELLING',
  HeavyOilTransport = 'HEAVY_OIL_TRANSPORT',
  LightOilPumping = 'LIGHT_OIL_PUMPING',
  LightOilRefuelling = 'LIGHT_OIL_REFUELLING',
  LightOilTransport = 'LIGHT_OIL_TRANSPORT',
}

/**
 * 0-应收 1-应付
 */
export enum FundDirection {
  Payable = 'PAYABLE',
  Receivable = 'RECEIVABLE',
}

/**
 * 开/收票状态（0-未/收开票，1-已开/收票 2-部分开/收票）
 */
export enum InvoiceStatus {
  Issue = 'ISSUE',
  Issuing = 'ISSUING',
  Part = 'PART',
  Unissued = 'UNISSUED',
}

/**
 * 付款审批单表(PaymentApprovalOrder)DTO
 * author: liwenzhu
 * date: 2025-12-05
 *
 * PaymentApprovalOrderDTO
 */
export interface PaymentApprovalOrderDTO {
  /**
   * 账户类型
   */
  accountType?: string
  /**
   * 申请人所属部门
   */
  applicantDeptId?: number
  /**
   * 申请付款人
   */
  applicantId?: number
  /**
   * 申请付款金额
   */
  applyAmt?: number
  /**
   * 付款审批单编号
   */
  approvalNo?: string
  /**
   * 通过原因
   */
  approvalReason?: string
  /**
   * 银行账号
   */
  bankAccount?: string
  /**
   * 银行账号名称
   */
  bankAccountName?: string
  /**
   * 银行地址
   */
  bankAddress?: string
  /**
   * 银行汇款附言
   */
  bankMessage?: string
  /**
   * 银行名称
   */
  bankName?: string
  /**
   * ncc单据号
   */
  billno?: string
  /**
   * 作废人
   */
  cancelledOptId?: number
  /**
   * 作废原因
   */
  cancelledReason?: string
  /**
   * 作废时间
   */
  cancelledTime?: string
  /**
   * 业务主键
   */
  code?: string
  /**
   * 合同code
   */
  contractCode?: string
  /**
   * 合同号
   */
  contractNo?: string
  /**
   * 创建人
   */
  createId?: number
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 币种
   */
  currency?: string
  /**
   * 流程所属部门
   */
  deptId?: number
  /**
   * 汇款手续费承担方式
   */
  feeBearType?: string
  /**
   * 费用类别
   */
  feeCategory?: string
  /**
   * 费用科目
   */
  feeSubject?: string
  /**
   * 财务支付说明
   */
  financeDesc?: string
  /**
   * 流程id
   */
  flowId?: string
  /**
   * 主键ID
   */
  id?: number
  /**
   * 是否指定中间行 0-否 1-是
   */
  intermediateBankFlag?: number
  /**
   * 中间行名称
   */
  intermediateBankName?: string
  /**
   * SWIFT CODE(中间行)
   */
  intermediateSwiftCode?: string
  /**
   * 是否删除：1为已删除,0为未删除
   */
  isDeleted?: number
  /**
   * 最迟付款日期
   */
  latestPayDate?: string
  /**
   * NCC推送状态 1-推送成功 0 推送失败
   */
  nccPushStatus?: number
  /**
   * 其他代码
   */
  otherCode?: string
  /**
   * 收款单位
   */
  payee?: string
  /**
   * 收款单位国别
   */
  payeeCountry?: string
  /**
   * 付款单位
   */
  payer?: string
  /**
   * 付款单位的银行账号
   */
  payerBankAccount?: string
  /**
   * 付款事项
   */
  payItem?: string
  /**
   * 关联付款单code
   */
  paymentCode?: string
  /**
   * 支付成功时间
   */
  paySuccessTime?: string
  /**
   * 付款类型 0-运费付款 1-租金付款 2-第三方费用付款 3-港使费预付款 4-港使费结算付款 5-运费收入退款 6-租金收入退款 7-第三方收入退款
   */
  payType?: string
  /**
   * ncc单据主键
   */
  pkBill?: string
  /**
   * ncc组织编码
   */
  pkOrg?: string
  /**
   * 港口
   */
  portName?: string
  /**
   * 是否预付款 0-否 1-是
   */
  prepaymentFlag?: number
  /**
   * 推送失败原因
   */
  pushFailReason?: string
  /**
   * 驳回原因
   */
  rejectReason?: string
  /**
   * 备注
   */
  remark?: string
  /**
   * 租金期数
   */
  rentalPeriod?: string
  /**
   * 结算方式
   */
  settleMethod?: string
  /**
   * 0 未提交 1 审批中 2 审批通过 3 审批驳回 4 审批终止 5 变更审批中 6 变更终止 7 变更驳回 8 变更通过 9 作废审批中 10 已作废
   */
  status?: number
  /**
   * SWIFT CODE
   */
  swiftCode?: string
  /**
   * 更新人
   */
  updateId?: number
  /**
   * 更新时间
   */
  updateTime?: string
  /**
   * 是否急付：0-否 1-是
   */
  urgentFlag?: number
  /**
   * 船名
   */
  vesselCode?: string
  /**
   * 航次号
   */
  voyageCode?: string
  /**
   * 是否航次结算 0-否 1-是
   */
  voyageSettleFlag?: number
  /**
   * 撤回原因
   */
  withdrawReason?: string
}
