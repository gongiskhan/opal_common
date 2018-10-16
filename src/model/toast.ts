import {MessageBarType} from "office-ui-fabric-react";
import {Util} from "../util";

export class Toast {
  visible?: boolean;
  message: string;
  type?: MessageBarType;
  //milliseconds
  duration?: number;

  constructor(message: string, type?: MessageBarType, durationInMilliseconds?: number) {

    this.message = message || "";
    this.type = type || MessageBarType.info;
    this.duration = durationInMilliseconds || 3000;

    //Show immediately
    this.visible = true;
    setTimeout(() => {
      Util.hideToast();
    }, this.duration);
  }
}
