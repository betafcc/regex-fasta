export class SafeMap<K, V> {
  static create<K, V>(entries: [K, V][]): SafeMap<K, V> {
    return new SafeMap(new Map(entries))
  }

  constructor(private data: Map<K, V>) {}

  get size() {
    return this.data.size
  }

  keys() {
    return [...this.data.keys()]
  }

  entries() {
    return [...this.data.entries()]
  }

  values() {
    return [...this.data.values()]
  }

  has(key: K): boolean {
    return this.data.has(key)
  }

  get<U = V>(key: K, defaultValue: U): V | U {
    if (this.has(key)) return this.data.get(key) as V
    return defaultValue
  }

  remove(key: K): SafeMap<K, V> {
    if (!this.has(key)) return this

    const data = new Map(this.data)
    data.delete(key)

    return new SafeMap(data)
  }

  set(key: K, value: V): SafeMap<K, V> {
    if (this.has(key)) return this.remove(key).set(key, value)

    const data = new Map(this.data)
    data.set(key, value)

    return new SafeMap(data)
  }

  update(key: K, value: V): SafeMap<K, V> {
    if (!this.has(key)) return this

    const data = new Map(this.data)
    data.set(key, value)

    return new SafeMap(data)
  }

  concat(other: SafeMap<K, V>): SafeMap<K, V> {
    return other
      .entries()
      .reduce((acc, [key, value]) => acc.set(key, value), this as SafeMap<K, V>)
  }

  slice(start?: number, end?: number): SafeMap<K, V> {
    return SafeMap.create([...this.entries()].slice(start, end))
  }

  map<U>(f: (value: V, key: K) => U): SafeMap<K, U> {
    return SafeMap.create(
      this.entries().map(([key, value]) => [key, f(value, key)]),
    )
  }
}
