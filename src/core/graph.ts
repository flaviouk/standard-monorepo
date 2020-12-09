import { fromPairs, isUndefined, uniq, isEmpty } from 'lodash'
import semver from 'semver'

import { Package, Nodes, CycleSet, Cycle } from './types'

// https://www.youtube.com/watch?v=rKQaZuoUR4M&feature=youtu.be
export class Graph {
  packages: Package[]
  packageList: {
    [packageName: string]: Package
  }
  nodes: Nodes
  private unvisited: CycleSet = new Set()
  private visiting: CycleSet = new Set()
  private visited: CycleSet = new Set()
  private cycles: Cycle[]

  constructor(packages: Package[]) {
    this.intialiseNodes = this.intialiseNodes.bind(this)
    this.packages = packages
    this.packageList = fromPairs(packages.map((pkg) => [pkg.name, pkg]))
    this.nodes = this.intialiseNodes(packages)
  }

  detectCycle = (): Cycle[] => {
    // We already calculated before, no need to do it again
    if (!isUndefined(this.cycles)) return this.cycles

    Object.keys(this.nodes).map((node) => this.unvisited.add(node))

    const cycles: Cycle[] = []

    while (this.unvisited.size > 0) {
      // Take the first item in the unvisited set
      const [node] = Array.from(this.unvisited)

      const dfsResult = this.dfs(node)

      if (dfsResult.length > 0) cycles.push(dfsResult)
    }

    this.cycles = cycles.map((cycle) => [...uniq(cycle), cycle[0]])
    return this.cycles
  }

  private dfs = (current: string): Cycle => {
    this.moveVertex(current, this.unvisited, this.visiting)

    let cycle: Cycle = [current]

    // loop through the list of linked nodes
    for (const neighbor of this.nodes[current]) {
      //if visited it means already explored so continue
      if (this.visited.has(neighbor)) {
        continue
      }

      //if in visiting then cycle found
      if (this.visiting.has(neighbor)) {
        cycle.push(neighbor)
        continue
      }

      const dfsResult = this.dfs(neighbor)
      if (dfsResult.length > 0) {
        cycle = [...cycle, ...dfsResult]
      }
    }

    this.moveVertex(current, this.visiting, this.visited)
    return cycle.length === 1 ? [] : cycle
  }

  private moveVertex = (
    node: string,
    sourceSet: CycleSet,
    destinationSet: CycleSet,
  ) => {
    sourceSet.delete(node)
    destinationSet.add(node)
  }

  private intialiseNodes = (packages: Package[]): Nodes => {
    // version is internal
    const nodes = fromPairs(
      packages.map(({ name, version }) => [name, { version, links: [] }]),
    )

    const isLocalDependency = (name: string, versionRange: string) =>
      !isUndefined(nodes[name]) &&
      semver.satisfies(nodes[name].version, versionRange)

    for (const {
      name: packageName,
      dependencies,
      devDependencies,
    } of packages) {
      const handler = ([name, versionRange]) => {
        if (isLocalDependency(name, versionRange)) {
          nodes[packageName].links.push(name)
        }
      }

      if (!isEmpty(dependencies)) Object.entries(dependencies).forEach(handler)
      if (!isEmpty(devDependencies))
        Object.entries(devDependencies).forEach(handler)
    }

    return fromPairs(
      Object.entries(nodes).map(([name, { links }]) => [
        name,
        uniq(links).filter((link) => link !== name),
      ]),
    )
  }

  getChangedPackages = (filesChanged: string[]): Package[] => {
    const cycles = this.detectCycle()
    // Can't accurately decide which packages have changed if there are circular dependencies
    if (cycles.length > 0) return this.packages

    const packagesChanged = new Set<string>()

    // For every file changed, loop through the package list and see if
    // it's located inside, if it is add it to the list and exit the loop
    filesChanged.forEach((file) => {
      for (const { name, location } of this.packages) {
        if (file.startsWith(location.replace('/package.json', ''))) {
          return packagesChanged.add(name)
        }
      }
    })

    // For every initially changed package, look at which packages depend
    // on them and add them to the list too, as packagesChanged get updated
    // it keeps running, until it has looped through everything in the set
    packagesChanged.forEach((pkg) => {
      Object.entries(this.nodes).forEach(
        ([name, links]) => links.includes(pkg) && packagesChanged.add(name),
      )
    })

    return Array.from(packagesChanged).map(
      (changed) => this.packageList[changed],
    )
  }
}
