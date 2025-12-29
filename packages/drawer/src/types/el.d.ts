import type { ElDrawer, ElLoading } from 'element-plus'

/** Element Plus Drawer Props */
export type ElDrawerProps = InstanceType<typeof ElDrawer>['$props']

/** Element Plus Loading Options */
export type ElLoadingOptions = Parameters<typeof ElLoading.service>[0]
