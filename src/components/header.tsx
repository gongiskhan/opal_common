import * as React from 'react';
import {MessageBar, Spinner, SpinnerSize} from "office-ui-fabric-react";
import {Toast} from "../model/toast";
import {OpalStoreService} from "../services/store";

export interface HeaderProps {
  message: string;
}

export interface HeaderState {
  toast: Toast;
  displayLogoutDialog: boolean;
  spin: boolean;
}

export class Header extends React.Component<HeaderProps, HeaderState> {

  constructor(props:any, context:any) {
    super(props, context);
  }

  componentDidMount() {
    this.setState({
      displayLogoutDialog: false
    });
    OpalStoreService.Observer.observe('spin', (spin:any) => {
      try {
        this.setState({
          spin: spin
        });
      } catch (error) {
      }
    });
    OpalStoreService.Observer.observe('toast', (toast:any) => {
      try {
        this.setState({
          toast: toast
        });
      } catch (error) {
      }
    });
  }

  componentWillReceiveProps(props:any) {
    if (this.state && props) {
      this.setState({
        toast: props.toast
      });
    }
  }

  goHome() {
    if (this.context.router) {
      this.context.router.history.push('/');
    }
  }

  displayLogoutDialog() {
    this.setState({
      displayLogoutDialog: true
    });
  }

  render() {

    let messageVisible = this.state && this.state.toast && this.state.toast.visible;

    return (
      <div className="opal-header flex-row">
        <h1>{this.props.message}</h1>
        {messageVisible &&
        <MessageBar
            messageBarType={this.state && this.state.toast && this.state.toast.type}
            isMultiline={false}
        >{this.state && this.state.toast && this.state.toast.message}
        </MessageBar>
        }
        {this.state && this.state.spin &&
        <div className="spinnerOverlay">
            <Spinner size={SpinnerSize.large} label='Working...' ariaLive='assertive'/>
        </div>
        }
      </div>
    );
  }
}
