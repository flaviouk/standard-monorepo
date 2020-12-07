import { fromPairs } from 'lodash'

import { Package } from '../core/types'

export const createPackage = ({
  name,
  version = '1.0.0',
  dependencies = {},
  devDependencies = {},
}: Partial<Package>): Package => ({
  name,
  version,
  private: false,
  location: `/packages/${name}`,
  dependencies,
  devDependencies,
  peerDependencies: {},
  optionalDependencies: {},
})

export const createDep = (name: string, links: string[]) =>
  createPackage({
    name,
    dependencies: fromPairs(links.map((dep) => [dep, '1.0.0'])),
  })

export const graphs = {
  NO_CYCLE: [
    createDep('@foo/a', ['@foo/b', 'react']),
    createDep('@foo/b', ['@foo/a', '@foo/c', 'redux']),
    createDep('@foo/c', ['foo', 'bar']),
  ],
  ONE_CYCLE: [
    createDep('a', ['b', 'c']),
    createDep('b', ['c']),
    createDep('c', []),
    createDep('d', ['a', 'e']),
    createDep('e', ['f']),
    createDep('f', ['d']),
  ],
  TWO_CYCLES: [
    createDep('a', ['b', 'c']),
    createDep('b', ['c']),
    createDep('c', ['a']),
    createDep('d', ['a', 'e']),
    createDep('e', ['f']),
    createDep('f', ['g']),
    createDep('g', ['d']),
  ],
}
