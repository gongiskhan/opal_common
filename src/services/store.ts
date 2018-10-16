class StoreDataListener {
  targetProperty: string;
  handler: Function;

  constructor(targetProperty: string, handler: Function) {
    this.targetProperty = targetProperty;
    this.handler = handler;
  }
}

class StoreDataObserver {

  listeners: Array<StoreDataListener>;

  constructor() {
    this.listeners = [];
  }

  observe(property: any, handler: any) {
    this.listeners.push({
      targetProperty: property,
      handler: handler
    });
  }

  notify(property: any, value:any) {
    this.listeners.forEach((listener) => {
      if (listener.targetProperty === property) {
        listener.handler(value);
      }
    });
  }
}

class StoreService {

  Observer: StoreDataObserver = new StoreDataObserver();
  private LOCAL_DATA_NAME = 'opal_global_data';
  private localData = JSON.parse(localStorage.getItem(this.LOCAL_DATA_NAME) || "{}");

  getProperty(property:any) {
    return this.localData[property];
  }

  setProperty(property:any, value:any) {
    this.localData[property] = value;
    localStorage.setItem(this.LOCAL_DATA_NAME, JSON.stringify(this.localData));
    this.Observer.notify(property, value);
  }

  removeProperty(property:any) {
    this.localData[property] = null;
    delete this.localData[property];
  }

  getAuthToken() {
    return this.getProperty('authToken');
  }

  setAuthToken(value:any) {
    this.setProperty('authToken', value);
  }

  getCurrentTemplateId() {
    return this.getProperty('currentTemplateId');
  }

  setCurrentTemplateId(value:any) {
    this.setProperty('currentTemplateId', value);
  }

  saveFlashProperty(property:any, value:any) {
    this.setProperty('flash_' + property, value);
  }

  getFlashProperty(property:any) {
    let propertyValue = this.getProperty('flash_' + property);
    if (propertyValue) {
      propertyValue = JSON.stringify(propertyValue);
      this.removeProperty('flash_' + property);
      return JSON.parse(propertyValue);
    } else {
      return null;
    }
  }

  removeFlashProperty(property:any) {
    this.removeProperty('flash_' + property);
  }

  cleanFlashProperties() {
    Object.keys(this.localData).forEach((key) => {
      if (key.indexOf('flash_') !== -1) {
        this.removeProperty(key);
      }
    });
  }
}

declare global {
  interface Window {
    OpalStoreService: any;
  }
}

window.OpalStoreService = new StoreService();

export const OpalStoreService = window.OpalStoreService;
