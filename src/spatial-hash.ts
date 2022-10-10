import { Entity } from "ecs";

class SpatialHash {
  private map = new Map<string, Set<Entity>>();

  public add(x: number, y: number, entity: Entity) {
    const key = Math.floor(x) + "," + Math.floor(y);

    if (!this.map.has(key)) {
      this.map.set(key, new Set<Entity>([entity]));
    } else {
      this.map.get(key)?.add(entity);
    }
  }

  public remove(x: number, y: number, entity: Entity) {
    const key = Math.floor(x) + "," + Math.floor(y);

    if (!this.map.has(key)) {
      this.map.get(key)?.delete(entity);
    }
  }

  public removeInRange(
    xRaw: number,
    yRaw: number,
    padding: number,
    entity: Entity
  ) {
    const x = Math.floor(xRaw);
    const y = Math.floor(yRaw);

    for (let xSearch = x - padding; xSearch < x + padding; xSearch++) {
      for (let ySearch = y - padding; ySearch < y + padding; ySearch++) {
        this.map.get(`${xSearch},${ySearch}`)?.delete(entity);
      }
    }
  }

  public getInRange(xRaw: number, yRaw: number, padding: number) {
    const x = Math.floor(xRaw);
    const y = Math.floor(yRaw);
    const arr: Entity[] = [];

    for (let xSearch = x - padding; xSearch < x + padding; xSearch++) {
      for (let ySearch = y - padding; ySearch < y + padding; ySearch++) {
        this.map.get(`${xSearch},${ySearch}`)?.forEach((entity) => {
          arr.push(entity);
        });
      }
    }

    return arr;
  }

  public clear(): void {
    this.map.clear();
  }
}

export default new SpatialHash();
