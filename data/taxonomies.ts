import __taxonomies from './jsons/__taxonomies.json'

import __experiencesTaxonomies from './jsons/__experiencesTaxonomies.json'
import { TaxonomyType } from './types'
import { Route } from '@/types/next-route'

const DEMO_CATEGORIES: TaxonomyType[] = __taxonomies.map((item) => ({
  ...item,
  taxonomy: 'category',
  href: item.href as Route,
}))

const DEMO_TAGS: TaxonomyType[] = __taxonomies.map((item) => ({
  ...item,
  taxonomy: 'tag',
  href: item.href as Route,
}))

const DEMO_EXPERIENCES_CATEGORIES: TaxonomyType[] = __experiencesTaxonomies.map((item) => ({
  ...item,
  taxonomy: 'category',
  listingType: 'experiences',
  href: item.href as Route,
}))

export { DEMO_CATEGORIES, DEMO_TAGS, DEMO_EXPERIENCES_CATEGORIES }
