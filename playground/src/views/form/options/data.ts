/**
 * @file data.ts
 * @description 省市区数据，供选项示例页面复用
 */

/**
 * 选项数据类型
 */
export interface OptionItem {
  label: string
  value: string
}

/**
 * 省份数据（3个）
 */
export const provinces: OptionItem[] = [
  { label: '广东省', value: '1' },
  { label: '江苏省', value: '2' },
  { label: '浙江省', value: '3' },
]

/**
 * 城市数据（9个，每个省3个）
 */
export const cities: OptionItem[] = [
  { label: '广州市', value: '1-1' },
  { label: '深圳市', value: '1-2' },
  { label: '珠海市', value: '1-3' },
  { label: '南京市', value: '2-1' },
  { label: '苏州市', value: '2-2' },
  { label: '无锡市', value: '2-3' },
  { label: '杭州市', value: '3-1' },
  { label: '宁波市', value: '3-2' },
  { label: '温州市', value: '3-3' },
]

/**
 * 区县数据（27个，每个市3个）
 */
export const districts: OptionItem[] = [
  { label: '天河区', value: '1-1-1' },
  { label: '越秀区', value: '1-1-2' },
  { label: '海珠区', value: '1-1-3' },
  { label: '南山区', value: '1-2-1' },
  { label: '福田区', value: '1-2-2' },
  { label: '罗湖区', value: '1-2-3' },
  { label: '香洲区', value: '1-3-1' },
  { label: '斗门区', value: '1-3-2' },
  { label: '金湾区', value: '1-3-3' },
  { label: '玄武区', value: '2-1-1' },
  { label: '秦淮区', value: '2-1-2' },
  { label: '建邺区', value: '2-1-3' },
  { label: '虎丘区', value: '2-2-1' },
  { label: '吴中区', value: '2-2-2' },
  { label: '相城区', value: '2-2-3' },
  { label: '梁溪区', value: '2-3-1' },
  { label: '锡山区', value: '2-3-2' },
  { label: '惠山区', value: '2-3-3' },
  { label: '西湖区', value: '3-1-1' },
  { label: '上城区', value: '3-1-2' },
  { label: '下城区', value: '3-1-3' },
  { label: '海曙区', value: '3-2-1' },
  { label: '江北区', value: '3-2-2' },
  { label: '北仑区', value: '3-2-3' },
  { label: '鹿城区', value: '3-3-1' },
  { label: '龙湾区', value: '3-3-2' },
  { label: '瓯海区', value: '3-3-3' },
]
