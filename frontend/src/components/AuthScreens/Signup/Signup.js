import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "shards-react";

export default class SignupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { signupopen: true };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      signupopen: !this.state.signupopen
    });
  }

  render() {
    const { signupopen } = this.state;
    return (
      <div>
        <Modal open={signupopen} toggle={this.toggle}>
          <ModalHeader>Header</ModalHeader>
          <ModalBody>👋 Hello there!</ModalBody>
        </Modal>
      </div>
    );
  }
}