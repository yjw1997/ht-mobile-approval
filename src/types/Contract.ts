/**
 * 单条数据
 *
 * ResponseContractExternalResp
 */
export interface Response {
  code: number
  data?: ContractExternalResp
  message?: string
  [property: string]: any
}

/**
 * ContractExternalResp
 */
export interface ContractExternalResp {
  /**
   * 运费预收付比例%
   */
  advancePaymentRatio?: number
  /**
   * 合同状态  0 待提交 1 审批中 2 审批通过 3 审批驳回 4 审批终止 5 变更审批中 6 变更终止 7 变更驳回 8 变更通过 9 作废审批中 10 已作废
   */
  approvalStatus?: number
  /**
   * 商务经理
   */
  businessManager?: number
  /**
   * 经营模式 0外贸OP 1外贸自营
   */
  businessMode?: number
  /**
   * 货量范围类型
   */
  cargoRangeType?: string
  /**
   * 货量范围数量
   */
  cargoRangeValue?: string
  /**
   * ''变更说明''
   */
  changeDescription?: string
  /**
   * 变更人id
   */
  changeId?: number
  /**
   * 变更人名称
   */
  changeName?: string
  /**
   * '变更原因 0人为错误 1合同方要求变更 2其他原因'
   */
  changeReason?: string
  /**
   * 变更人时间
   */
  changeTime?: string
  /**
   * 租期时长
   */
  charterPeriodDuration?: string
  /**
   * 业务主键
   */
  code?: string
  /**
   * 合同经济信息集合
   */
  contractExternalBrokerInfoDTOS?: ContractExternalBrokerInfoDTO[]
  /**
   * 运费信息集合
   */
  contractExternalFreightInfoDTOS?: ContractExternalFreightInfoDTO[]
  /**
   * 租家支付费用信息集合
   */
  contractExternalPaymentInfoDTOS?: ContractExternalPaymentInfoDTO[]
  /**
   * 外贸船舶航向集合
   */
  contractExternalRouteDTOS?: ContractExternalRouteDTO[]
  /**
   * 合同性质 来源字典表
   */
  contractNature?: string
  /**
   * 合同编号
   */
  contractNo?: string
  /**
   * 合同备注
   */
  contractRemark?: string
  /**
   * 合同类型 0 揽货合同 1 TC期租合同 2 TCT航次期租合同 3 VC航次租船 4 COA包运合同
   */
  contractType?: number
  /**
   * 创建人ID
   */
  createId?: number
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 币种编码 来源币种表
   */
  currencyCode?: string
  /**
   * 客户/租家佣金金额
   */
  customerCommissionAmt?: number
  /**
   * 客户/租家佣金类型 来源字典表
   */
  customerCommissionType?: string
  /**
   * 客商名称
   */
  customerName?: string
  /**
   * 交船地点 开源港口表
   */
  deliveryVesselPort?: string
  /**
   * 所属部门
   */
  deptId?: number
  /**
   * 所属部门名称
   */
  deptName?: string
  /**
   * 滞期/速遣条款
   */
  dispatchClause?: string
  /**
   * 受载期结束时间
   */
  endLaycan?: string
  /**
   * 额外费用收取
   */
  extraChargesCollection?: string
  /**
   * 航次唯一标识 来自航次号维护子表
   */
  extVoyageCode?: string
  /**
   * 附件信息
   */
  fileAttachmentDTOS?: FileAttachmentDTO[]
  /**
   * 油耗范围
   */
  fuelConsumptionRange?: string
  /**
   * 油款收/支方式
   */
  fuelMethod?: string
  /**
   * 货物名称
   */
  goodsName?: string
  /**
   * 客商编码 客商表业务主键
   */
  guestBusinessCode?: string
  /**
   * 重油类型 来源字典表
   */
  heavyFuelType?: string
  /**
   * 重油数量
   */
  heavyFuelValue?: number
  /**
   * 自增主键ID
   */
  id?: number
  /**
   * 是否删除：1为已删除,0为未删除
   */
  isDeleted?: number
  /**
   * 是否多航线 0否 1是
   */
  isMultipleRoutes?: number
  /**
   * 是否累计租金计算
   */
  isTotalHireAmount?: number
  /**
   * 受载期
   */
  laycan?: string
  /**
   * 租金收/支方式
   */
  leaseAmountMethod?: string
  /**
   * 租赁方式 0租入 1租出
   */
  leaseType?: number
  /**
   * 轻油类型 来源字典表
   */
  lightFuelType?: string
  /**
   * 轻油数量
   */
  lightFuelValue?: number
  /**
   * 装卸港名称
   */
  loadingAndUnloadingPortName?: string
  /**
   * 经办人名称
   */
  operator?: string
  /**
   * 经办人
   */
  operatorId?: number
  /**
   * 结算单位(我方)
   */
  oppositeSettlementUnit?: string
  /**
   * 签约主体(我方)
   */
  oppositeSigningUnit?: string
  /**
   * 其他注意事项
   */
  otherPrecautions?: string
  /**
   * 结算单位(我方)
   */
  ourSettlementUnit?: string
  /**
   * 签约主体(我方)
   */
  ourSigningUnit?: string
  /**
   * 签约主体(我方) 组织机构名称
   */
  ourSigningUnitName?: string
  /**
   * 结算周期数量
   */
  paymentCycleNumber?: number
  /**
   * 结算周期类型 来源字典表
   */
  paymentCycleType?: string
  /**
   * 回款账期(数据字典payment_period : 1 开票后 2 航次结束后 )
   */
  paymentPeriod?: string
  /**
   * 回款账期天数
   */
  paymentPeriodDay?: number
  /**
   * 支付方式 来源字典表
   */
  paymentType?: string
  /**
   * 还船地点 开源港口表
   */
  repayVesselPort?: string
  /**
   * 航行区域
   */
  sailingRegion?: string
  /**
   * 签订日期
   */
  signDate?: string
  /**
   * 受载期开始时间
   */
  startLaycan?: string
  /**
   * 合同总金额
   */
  totalAmount?: number
  /**
   * 合同总货量
   */
  totalCargoNumber?: number
  /**
   * 更新人ID
   */
  updateId?: number
  /**
   * 更新时间
   */
  updateTime?: string
  /**
   * 船舶编码 船舶表业务主键
   */
  vesselCode?: string
  /**
   * 船名
   */
  vesselName?: string
  /**
   * 作废描述
   */
  voidedDescription?: string
  /**
   * 作废人id
   */
  voidedId?: number
  /**
   * 作废人名称
   */
  voidedName?: string
  /**
   * 作废原因
   */
  voidedReason?: string
  /**
   * 作废人时间
   */
  voidedTime?: string
  /**
   * 航次唯一标识 来自航次号维护表
   */
  voyageCode?: string
  /**
   * 航次号
   */
  voyageNo?: string
  /**
   * 航次类型/航线
   */
  voyageType?: string
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
 * 运费信息表(ContractExternalFreightInfo)DTO
 * author: gejiajie
 * date: 2025-10-31
 *
 * ContractExternalFreightInfoDTO
 */
export interface ContractExternalFreightInfoDTO {
  /**
   * 运费预收付比例%
   */
  advancePaymentRatio?: number
  /**
   * 合同唯一标识 关联外贸合同表
   */
  bizCode?: string
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
   * 运价类别 来自字典表
   */
  freightCategory?: string
  /**
   * 运价
   */
  freightNumber?: number
  /**
   * 运价小计
   */
  freightTotalNumber?: number
  /**
   * 货物编码 来自货物表
   */
  goodsCode?: string
  /**
   * 货物数量
   */
  goodsNumber?: number
  /**
   * 自增主键ID
   */
  id?: number
  /**
   * 装港 来自港口表
   */
  loadingPort?: string
  /**
   * 装港名称
   */
  loadingPortName?: string
  /**
   * 装运条款 来自字典表
   */
  shippingTerms?: string
  /**
   * 单位 来源字典表
   */
  unit?: string
  /**
   * 卸港 来自港口表
   */
  unloadingPort?: string
  /**
   * 卸港名称
   */
  unloadingPortName?: string
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
