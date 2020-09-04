import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "shards-react";

export default class BasicModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: true };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { open } = this.state;
    return (
      <div>
        <Modal open={open} toggle={this.toggle}>
          <ModalHeader>Header</ModalHeader>
          <ModalBody>👋 Hello there!</ModalBody>
        </Modal>
      </div>
    );
  }
}