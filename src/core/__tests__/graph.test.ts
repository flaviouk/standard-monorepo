import { Graph } from '../graph'
import { graphs } from '../../test/utils'

describe('[Graph]', () => {
  it('should initialise no cycle graph', () => {
    const graph = new Graph(graphs.NO_CYCLE)

    expect(graph.nodes).toEqual({
      '@foo/a': [],
      '@foo/b': ['@foo/a', '@foo/c'],
      '@foo/c': ['@foo/d'],
      '@foo/d': ['@foo/e'],
      '@foo/e': [],
    })
  })

  it('should initialise one cycle graph', () => {
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

  it('should detect one cycles', () => {
    const graph = new Graph(graphs.ONE_CYCLE)

    expect(graph.detectCycle()).toEqual([['d', 'e', 'f', 'd']])
  })

  it('should detect two cycles', () => {
    const graph = new Graph(graphs.TWO_CYCLES)

    expect(graph.detectCycle()).toEqual([
      ['a', 'b', 'c', 'a'],
      ['d', 'e', 'f', 'g', 'd'],
    ])
  })

  it('should detect one large cycle', () => {
    const graph = new Graph(graphs.LARGE_CYCLE)

    expect(graph.detectCycle()).toEqual([
      [
        '@foo/3',
        '@foo/26',
        '@foo/23',
        '@foo/5',
        '@foo/7',
        '@foo/28',
        '@foo/11',
        '@foo/19',
        '@foo/20',
        '@foo/30',
        '@foo/31',
        '@foo/32',
        '@foo/33',
        '@foo/21',
        '@foo/37',
        '@foo/27',
        '@foo/34',
        '@foo/36',
        '@foo/40',
        '@foo/4',
        '@foo/6',
        '@foo/8',
        '@foo/13',
        '@foo/15',
        '@foo/10',
        '@foo/12',
        '@foo/14',
        '@foo/17',
        '@foo/24',
        '@foo/29',
        '@foo/3',
      ],
    ])
  })

  it('should detect changed packages', () => {
    const graph = new Graph(graphs.NO_CYCLE)

    expect(
      graph
        .getChangedPackages([
          '/packages/@foo/e/somefile.txt',
          '/randomfile.txt',
        ])
        .map(({ name }) => name),
    ).toEqual(['@foo/e', '@foo/d', '@foo/c', '@foo/b'])
  })

  it('should return all packages if theres at least one circular dependency', () => {
    const graph = new Graph(graphs.ONE_CYCLE)

    expect(
      graph.getChangedPackages([
        '/packages/@foo/b/somefile.txt',
        '/randomfile.txt',
      ]),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "dependencies": Object {
            "b": "1.0.0",
            "c": "1.0.0",
          },
          "devDependencies": Object {},
          "location": "/packages/a/package.json",
          "name": "a",
          "optionalDependencies": Object {},
          "peerDependencies": Object {},
          "private": false,
          "version": "1.0.0",
        },
        Object {
          "dependencies": Object {
            "c": "1.0.0",
          },
          "devDependencies": Object {},
          "location": "/packages/b/package.json",
          "name": "b",
          "optionalDependencies": Object {},
          "peerDependencies": Object {},
          "private": false,
          "version": "1.0.0",
        },
        Object {
          "dependencies": Object {},
          "devDependencies": Object {},
          "location": "/packages/c/package.json",
          "name": "c",
          "optionalDependencies": Object {},
          "peerDependencies": Object {},
          "private": false,
          "version": "1.0.0",
        },
        Object {
          "dependencies": Object {
            "a": "1.0.0",
            "e": "1.0.0",
          },
          "devDependencies": Object {},
          "location": "/packages/d/package.json",
          "name": "d",
          "optionalDependencies": Object {},
          "peerDependencies": Object {},
          "private": false,
          "version": "1.0.0",
        },
        Object {
          "dependencies": Object {
            "f": "1.0.0",
          },
          "devDependencies": Object {},
          "location": "/packages/e/package.json",
          "name": "e",
          "optionalDependencies": Object {},
          "peerDependencies": Object {},
          "private": false,
          "version": "1.0.0",
        },
        Object {
          "dependencies": Object {
            "d": "1.0.0",
          },
          "devDependencies": Object {},
          "location": "/packages/f/package.json",
          "name": "f",
          "optionalDependencies": Object {},
          "peerDependencies": Object {},
          "private": false,
          "version": "1.0.0",
        },
      ]
    `)
  })
})
