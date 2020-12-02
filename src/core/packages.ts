import { join } from 'path'
import { defaultTo, flattenDeep } from 'lodash'
import Glob from 'glob'
import PackageGraph from '@lerna/package-graph'

const root = process.cwd()

interface Deps {
  [dependencyName: string]: string
}

export interface Package {
  name: string
  version: string
  private: boolean
  location: string
  dependencies: Deps
  devDependencies: Deps
  peerDependencies: Deps
}

const findByGlob = async (glob: string) =>
  new Promise<Package[]>((resolve, reject) => {
    // @ts-expect-error
    new Glob(
      join(root + '/' + glob + '/package.json'),
      // @ts-expect-error
      { cache: 'FILE' },
      (err, pkgLocations: string[]) => {
        if (err) return reject(err)
        return resolve(
          pkgLocations.map((location) => {
            const {
              name,
              version,
              private: priv = false,
              dependencies = {},
              devDependencies = {},
              peerDependencies = {},
            } = require(location)
            if (!name) {
              throw Error('All packages must have a name: ' + location)
            }
            if (!version) {
              throw Error('All packages must have a version: ' + location)
            }
            return {
              name,
              version,
              private: priv,
              location,
              dependencies,
              devDependencies,
              peerDependencies,
            }
          }),
        )
      },
    )
  })

export const getAllPackages = async (): Promise<Package[]> => {
  const pkg = require(join(root, 'package.json'))
  const packagesGlobs = defaultTo(
    Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces?.packages,
    [],
  )
  return flattenDeep(await Promise.all(packagesGlobs.map(findByGlob)))
}

export const getCircularDependencies = async (rejectCycles: boolean) => {
  const packages = await getAllPackages()
  const graph = new PackageGraph(packages)
  const [cyclePaths, _cycleNodes]: [
    Set<string[]>,
    Set<object[]>,
  ] = graph.partitionCycles(rejectCycles)
  return cyclePaths.size
}
