import type { ElDialog, ElLoading, ElScrollbar } from 'element-plus'

/** Element Plus Dialog Props */
export type ElDialogProps = InstanceType<typeof ElDialog>['$props']

/** Element Plus Scrollbar Props */
export type ElScrollbarProps = InstanceType<typeof ElScrollbar>['$props']

/** Element Plus Loading Options */
export type ElLoadingOptions = Parameters<typeof ElLoading.service>[0]
