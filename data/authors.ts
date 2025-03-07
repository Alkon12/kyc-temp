import __authors from './jsons/__users.json'
import { AuthorType } from './types'
import avatar1 from '@/images/avatars/rodri.jpg'

import { Route } from '@/types/next-route'

const imgs = [
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
  avatar1,
]

const DEMO_AUTHORS: AuthorType[] = __authors.map((item, index) => ({
  ...item,
  avatar: imgs[index] || item.avatar,
  href: item.href as Route,
}))

export { DEMO_AUTHORS }
