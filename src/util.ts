import {OpalStoreService} from "./services/store";
import {Toast} from "./model/toast";
import {Model} from "./model/model";

export class Util {

  private static spinningCount = 0;

  public static startSpinning() {
    this.spinningCount++;
    if (this.spinningCount === 1) {
      OpalStoreService.setProperty('spin', true);
    }
  }

  public static stopSpinning() {
    this.spinningCount--;
    if (this.spinningCount <= 0) {
      OpalStoreService.setProperty('spin', false);
      this.spinningCount = 0;
    }
  }

  public static showToast(toast: Toast) {
    OpalStoreService.setProperty('toast', toast);
  }

  public static hideToast() {
    OpalStoreService.setProperty('toast', null);
  }

  public static removeEmptyProperties(obj:any) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'undefined') {
        delete obj[key];
      }
    });
  }

  public static splitCamelCase(value: string) {
    return value.replace(/([a-z](?=[A-Z]))/g, '$1 ').split(' ');
  }

  public static joinCamelCaseByHifen(value: string) {
    return Util.splitCamelCase(value).join('-').toLowerCase();
  }

  public static joinCamelCaseByUnderscore(value: string) {
    return Util.splitCamelCase(value).join('_').toLowerCase();
  }

  public static capitalize(value: string) {
    return value.replace(/\b\w/g, (l) => l.toUpperCase());
  }

  public static splitCapitalized(value: string) {
    return Util.capitalize(value).split(/(?=[A-Z])/).join(' ');
  }

  public static readAsBinaryString(fileData:any, callback:any) {
    let binary = "";
    let reader = new FileReader();
    reader.onload = () => {
      // @ts-ignore
      let bytes = new Uint8Array(reader.result);
      let length = bytes.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      callback(binary);
    };
    reader.readAsArrayBuffer(fileData);
  }

  private static convertServerChildToModel(serverObj:any, modelObj:any, key:any) {

    let keyCamelUnderScoreLower = Util.joinCamelCaseByUnderscore(key).toLowerCase();
    let keyCamelHifenLower = Util.joinCamelCaseByHifen(key).toLowerCase();
    let result = serverObj[keyCamelUnderScoreLower + '_id'] || serverObj[keyCamelHifenLower + '_id'];
    if (!result) {
      Object.keys(serverObj).forEach((serverObjKey) => {
        if (serverObjKey.indexOf(keyCamelUnderScoreLower) !== -1 || serverObjKey.indexOf(keyCamelHifenLower) !== -1) {
          result = serverObj[serverObjKey];
        }
      });
    }
    modelObj[key].id = result;
  }

  public static mapFromServer(serverObj: any, modelObj: any) {

    modelObj.id = serverObj.id;

    if (serverObj.attributes) {
      Object.keys(modelObj).forEach((key) => {
        if (key !== 'type') {
          if (serverObj.attributes[Util.joinCamelCaseByHifen(key)]) {
            modelObj[key] = serverObj.attributes[Util.joinCamelCaseByHifen(key)];
          }
          else if (serverObj.attributes[Util.joinCamelCaseByUnderscore(key)]) {
            modelObj[key] = serverObj.attributes[Util.joinCamelCaseByUnderscore(key)];
          }
          else if (serverObj.attributes[key.toLowerCase()]) {
            modelObj[key] = serverObj.attributes[key.toLowerCase()];
          }
          else if (modelObj[key] instanceof Model) {
            this.convertServerChildToModel(serverObj.attributes, modelObj, key);
          }
        }
      });
    }

    if (serverObj.relationships) {
      Object.keys(modelObj.relationships).forEach((key) => {
        if (key !== 'type' && key !== 'id') {
          let serverKey = Util.joinCamelCaseByUnderscore(key).toLowerCase();
          if (serverObj.relationships[serverKey]) {
            if (modelObj.relationships[key] instanceof Array) {
              let mappedArray: Array<any> = [];
              serverObj.relationships[serverKey].data.forEach((serverChild:any) => {
                mappedArray.push(serverChild);
              });
              modelObj.relationships[key] = mappedArray;
            }
            else {
              let mapped = Util.mapFromServer(serverObj.relationships[serverKey].data, modelObj.relationships[key]);
              modelObj.relationships[key] = mapped;
            }
          }
        }
      });
    }

    if (serverObj.attributes && serverObj.attributes.order_id) {
      modelObj.order = serverObj.attributes.order_id;
    }

    return modelObj;
  }

  public static mapToServer(modelObj: any, serverObj: any) {

    Object.keys(modelObj).forEach((key) => {
      if (modelObj[key] instanceof Model) {
        serverObj[Util.joinCamelCaseByUnderscore(key + 'Id')] = modelObj[key];
      } else {
        serverObj[Util.joinCamelCaseByUnderscore(key)] = modelObj[key];
      }
    });

    return serverObj;
  }

  public static randomOneThousand(): number {
    return Math.floor(Math.random() * (1000 - 1 + 1) + 1);
  }

  static getCookie(name: string) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }
}
