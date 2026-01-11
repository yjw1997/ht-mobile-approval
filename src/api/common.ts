import request from '@/utils/request'

// 公共接口的api可以放在这边 比如说下拉,全局组件获取等

// 币种下拉
export function getCurrencyInfoOptions() {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/currencyInfo/dropDownList`)
}

// 客商下拉
export function getGuestBusinessList(customerFullName = '') {
  return request.post(`${import.meta.env.VITE_API_VESSEL_URL}/guestBusiness/getGuestBusinessList?customerFullName=${customerFullName}`)
}

// 根据id获取客商详情
export function getGuestBusinessDetail(id: number | string) {
  return request.post(`${import.meta.env.VITE_API_VESSEL_URL}/guestBusiness/getById?id=${id}`)
}

// 项目下拉
export function getAllProject() {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/projectInfo/dropdownList`)
}

// 船舶档案
export function getListVesselInfo() {
  return request.post(`${import.meta.env.VITE_API_VESSEL_URL}/vesselInfo/listAll`)
}

// 获取地区树形
export function getAreaTreeOptions() {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/area/tree`)
}

// 根据id查询对应得省市区
export function getAreaIdInfo(areaId: string) {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/area/parentChainByAreaId?areaId=${areaId}`)
}

// 获取全部港口
export function getAllPort() {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/port/list`)
}

// 查询组织列表接口
export function getAllOrgt(data: any = {}) {
  return request.post(`${import.meta.env.VITE_API_EMPLOYEE_URL}/org/selectAll`, data)
}

// 获取全部货物
export function getAllGoods() {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/goodsInfo/list`)
}

// 获取全部指数
export function getAllIndexArchives() {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/indexArchives/getIndexTypeGroup`)
}

// 查询全部国家
export function getCountryList() {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/countryInfo/getAll`)
}

// 获取费用类别/科目tree下拉
export function getExpenseCategoryTreeWithSubject() {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/expenseCategory/treeWithSubject`)
}

// 下拉列表不分页
export function getVoyageNoConfigSelectList(data: any = {}) {
  return request.post(`${import.meta.env.VITE_API_VESSEL_URL}/voyageNoConfig/list`, data)
}

// 获取全部费用科目
export async function getExpenseSubjectList(data: any = {}) {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/expenseSubject/getSubjectList`, data)
}

// 下拉列表不分页 外部航次编号配置(业务真实航次号)
export function getVoyageNoConfigList(data: any = {}) {
  return request.post(`${import.meta.env.VITE_API_VESSEL_URL}/voyageNoConfigExt/list`, data)
}

// 查询所有员工
export async function getAllEmployee() {
  return request.post(`${import.meta.env.VITE_API_EMPLOYEE_URL}/employee/selectAll`, {})
}

// 项目组-查询所有
export async function getAllProjectGroup() {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/projectGroup/dropDownList`, {})
}

// 获取统计科目
export function getStatisticsSubjectList() {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/expenseSubject/getSubjectList`)
}

// 获取全部费用
export function getExpenseAccountList() {
  return request.post(`${import.meta.env.VITE_API_BASIC_URL}/expenseCategory/getCategoryList`)
}
