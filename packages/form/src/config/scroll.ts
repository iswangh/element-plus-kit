/**
 * 默认滚动选项配置
 *
 * 用于表单验证错误滚动和展开/收起功能滚动
 */
export const DEFAULT_SCROLL_OPTIONS: ScrollIntoViewOptions = {
  behavior: 'smooth', // 平滑滚动
  block: 'center', // 垂直居中，让错误项在视窗中间
  inline: 'nearest', // 水平方向保持最近位置
}
