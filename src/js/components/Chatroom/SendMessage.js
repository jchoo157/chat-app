import React, { Component } from 'react';

export default class SendMessage extends Component {
  constructor() {
    super();

    this.state = {
      inputValue: '',
    }
  }

  updateInputValue(e) {
    this.setState({inputValue: e.target.value})
  }

  eraseInputValue() {
    this.setState({inputValue: ''})
  }

  render() {
    const {inputValue} = this.state;
    const {sendMessage, selectedUser} = this.props;

    return(
      <form action="" onSubmit={(e) => {sendMessage(e, inputValue, selectedUser); eraseInputValue()}}>
        <input row="2" col="30" autocomplete="off" value={this.state.inputValue} onChange={(e) => {this.updateInputValue(e)}}/>
        <button type="submit">Send</button>
      </form>
    )
  }
}