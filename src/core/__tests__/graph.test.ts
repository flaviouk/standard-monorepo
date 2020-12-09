import { Graph } from '../graph'
import { graphs } from '../../test/utils'

describe('[Graph]', () => {
  it('should initialise no cycle graph', () => {
    const graph = new Graph(graphs.NO_CYCLE)

    expect(graph.nodes).toEqual({
      '@foo/a': ['@foo/b'],
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
      graph.getChangedPackages([
        '/packages/@foo/b/somefile.txt',
        '/randomfile.txt',
      ]),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "dependencies": Object {
            "@foo/a": "1.0.0",
            "@foo/c": "1.0.0",
            "redux": "1.0.0",
          },
          "devDependencies": Object {},
          "location": "/packages/@foo/b/package.json",
          "name": "@foo/b",
          "optionalDependencies": Object {},
          "peerDependencies": Object {},
          "private": false,
          "version": "1.0.0",
        },
        Object {
          "dependencies": Object {
            "@foo/b": "1.0.0",
            "react": "1.0.0",
          },
          "devDependencies": Object {},
          "location": "/packages/@foo/a/package.json",
          "name": "@foo/a",
          "optionalDependencies": Object {},
          "peerDependencies": Object {},
          "private": false,
          "version": "1.0.0",
        },
        Object {
          "dependencies": Object {
            "@foo/d": "1.0.0",
            "bar": "1.0.0",
            "foo": "1.0.0",
          },
          "devDependencies": Object {},
          "location": "/packages/@foo/c/package.json",
          "name": "@foo/c",
          "optionalDependencies": Object {},
          "peerDependencies": Object {},
          "private": false,
          "version": "1.0.0",
        },
        Object {
          "dependencies": Object {
            "@foo/e": "1.0.0",
            "bar": "1.0.0",
            "foo": "1.0.0",
          },
          "devDependencies": Object {},
          "location": "/packages/@foo/d/package.json",
          "name": "@foo/d",
          "optionalDependencies": Object {},
          "peerDependencies": Object {},
          "private": false,
          "version": "1.0.0",
        },
        Object {
          "dependencies": Object {
            "bar": "1.0.0",
            "foo": "1.0.0",
          },
          "devDependencies": Object {},
          "location": "/packages/@foo/e/package.json",
          "name": "@foo/e",
          "optionalDependencies": Object {},
          "peerDependencies": Object {},
          "private": false,
          "version": "1.0.0",
        },
      ]
    `)
  })
})
