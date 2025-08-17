export interface SidebarContainerProps {
  expandWidth: number
  collapseWidth: number
}

export interface SidebarStateProps {
  activeRouteName: string
}

export interface SidebarStateEmits {
  (e: 'update:activeRouteName', name: string): void
}
