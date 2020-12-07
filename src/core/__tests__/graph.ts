import { Graph } from '../graph'
import { graphs } from '../../test/utils'

describe('[Graph]', () => {
  it('should initialise the graph', () => {
    const graph = new Graph(graphs.NO_CYCLE)

    expect(graph.nodes).toEqual({
      '@foo/a': ['@foo/b'],
      '@foo/b': ['@foo/a', '@foo/c'],
      '@foo/c': [],
    })
  })

  it('should initialise a more complex graph', () => {
    const graph = new Graph(graphs.ONE_CYCLE)

    expect(graph.nodes).toEqual({
      a: ['b', 'c'],
      b: ['c'],
      c: [],
      d: ['a', 'e'],
      e: ['f'],
      f: ['d'],
    })
  })

  it('should detect cycles', () => {
    const graph = new Graph(graphs.ONE_CYCLE)

    expect(graph.detectCycle()).toEqual([['d', 'e', 'f', 'd']])
  })

  it('should detect large cycles', () => {
    const graph = new Graph(graphs.TWO_CYCLES)

    expect(graph.detectCycle()).toEqual([
      ['a', 'b', 'c', 'a'],
      ['d', 'e', 'f', 'g', 'd'],
    ])
  })
})
