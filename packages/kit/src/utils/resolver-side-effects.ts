/**
 * 供 unplugin-vue-components resolver 的 sideEffects 使用：
 * 从主包子路径发起副作用导入，由子包入口拉取样式（业务侧只解析主包）。
 */
import '@iswangh/element-plus-kit-form'
import '@iswangh/element-plus-kit-tag'
