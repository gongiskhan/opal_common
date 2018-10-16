import {Util} from "../util";

export abstract class Model<T> {

  id?: number;
  type: any;

  protected constructor(type: new () => T) {
    this.type = type;
  }

  toServerType(obj: T) {
    return Util.mapToServer(obj, {});
  }

  fromServerType(obj:any): T {
    return Util.mapFromServer(obj, new this.type());
  }
}
