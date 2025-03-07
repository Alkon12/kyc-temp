import type { Route as NextRoute } from 'next'
import { ComponentType } from 'react'

export type Route<T = string> = NextRoute
export type PathName = Route<string>

export interface Page {
  path: PathName
  exact?: boolean
  component: ComponentType<Object>
}
