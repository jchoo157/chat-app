import React, { Component } from 'react';

export default class ChatBox extends Component {
  constructor() {
    super();

    this.state = {
      inputValue: '',
      messages: []
    }
  }

  componentDidMount() {
    this.listenForNewMessages()
  }

  listenForNewMessages() {
    const {messages} = this.state;
    const {socket} = this.props;
    let copyOfMessages = [...messages];
    let that = this;

    socket.on('new message', function(msg) {
      copyOfMessages.push(msg);
      that.setState({messages: copyOfMessages})
    })
  }

  sendMessage(e) {
    const {socket} = this.props;
    e.preventDefault();
    socket.emit('send message', this.state.inputValue)
  }

  updateInputValue(e) {
    this.setState({inputValue: e.target.value})
  }

  displayMessages() {
    const {messages} = this.state;

    return messages.map((message) => {
      return (
        <li>{message.msg}</li>
      )
    })
  }

  render() {
    return(
      <div>
        <ul id="messageForm">
          {this.displayMessages()}
        </ul>
        <form action="" onSubmit={(e) => {this.sendMessage(e)}}>
          <input autocomplete="off" value={this.state.inputValue} onChange={(e) => {this.updateInputValue(e)}}/>
          <button type="submit">Send</button>
        </form>
      </div>
    )
  }
}