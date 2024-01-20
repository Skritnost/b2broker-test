export class ChildElement {
  constructor(public id: string, public color: string) {}
}

export class DataElement {
  constructor(
    public id: string,
    public int: number,
    public float: number,
    public color: string,
    public child: ChildElement
  ) {
  }
}
