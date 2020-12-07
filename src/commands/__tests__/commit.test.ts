import { validateCommitWithScope, validateCommitWithoutScope } from '../commit'

describe('[validateCommitWithScope]', () => {
  it('Should be able to validate message based on type', () => {
    expect(validateCommitWithScope('build(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('ci(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('docs(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('feat(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('fix(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('perf(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('refactor(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('style(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('test(ABC-123): did things')).toBe(true)

    expect(validateCommitWithScope('foo(ABC-123): did things')).toBe(false)
    expect(validateCommitWithScope('bar(ABC-123): did things')).toBe(false)
    expect(validateCommitWithScope('bar(ABC-123): did THINGS')).toBe(false)
    expect(validateCommitWithScope('did things')).toBe(false)
  })

  it('Should be able to validate message based on type with breaking change', () => {
    expect(validateCommitWithScope('build!(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('ci!(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('docs!(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('feat!(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('fix!(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('perf!(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('refactor!(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('style!(ABC-123): did things')).toBe(true)
    expect(validateCommitWithScope('test!(ABC-123): did things')).toBe(true)

    expect(validateCommitWithScope('foo!(ABC-123): did things')).toBe(false)
    expect(validateCommitWithScope('bar!(ABC-123): did things')).toBe(false)
    expect(validateCommitWithScope('bar!(ABC-123): did THINGS')).toBe(false)
  })
})
describe('[validateCommitWithoutScope]', () => {
  it('Should be able to validate message based on type', () => {
    expect(validateCommitWithoutScope('build: did things')).toBe(true)
    expect(validateCommitWithoutScope('ci: did things')).toBe(true)
    expect(validateCommitWithoutScope('docs: did things')).toBe(true)
    expect(validateCommitWithoutScope('feat: did things')).toBe(true)
    expect(validateCommitWithoutScope('fix: did things')).toBe(true)
    expect(validateCommitWithoutScope('perf: did things')).toBe(true)
    expect(validateCommitWithoutScope('refactor: did things')).toBe(true)
    expect(validateCommitWithoutScope('style: did things')).toBe(true)
    expect(validateCommitWithoutScope('test: did things')).toBe(true)

    expect(validateCommitWithoutScope('foo: did things')).toBe(false)
    expect(validateCommitWithoutScope('bar: did things')).toBe(false)
    expect(validateCommitWithoutScope('bar: did THINGS')).toBe(false)
  })
  it('Should be able to validate message based on type with breaking change', () => {
    expect(validateCommitWithoutScope('build!: did things')).toBe(true)
    expect(validateCommitWithoutScope('ci!: did things')).toBe(true)
    expect(validateCommitWithoutScope('docs!: did things')).toBe(true)
    expect(validateCommitWithoutScope('feat!: did things')).toBe(true)
    expect(validateCommitWithoutScope('fix!: did things')).toBe(true)
    expect(validateCommitWithoutScope('perf!: did things')).toBe(true)
    expect(validateCommitWithoutScope('refactor!: did things')).toBe(true)
    expect(validateCommitWithoutScope('style!: did things')).toBe(true)
    expect(validateCommitWithoutScope('test!: did things')).toBe(true)

    expect(validateCommitWithoutScope('foo!: did things')).toBe(false)
    expect(validateCommitWithoutScope('bar!: did things')).toBe(false)
    expect(validateCommitWithoutScope('bar!: did THINGS')).toBe(false)
  })
})
