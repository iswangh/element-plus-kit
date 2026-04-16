/**
 * TS6 对副作用样式导入检查更严格：
 * 为样式资源补充模块声明，避免 side-effect import 报 TS2882。
 */
declare module '*.css'
declare module '*.scss'
