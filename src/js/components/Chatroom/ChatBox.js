import React, { Component } from 'react';
import SendMessage from './SendMessage';

export default class ChatBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: {},
    }

    this.listenForNewMessages = this.listenForNewMessages.bind(this);
    this.clickChatBar = this.clickChatBar.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    this.listenForNewMessages()
  }

  clickChatBar(user) {
    const {selectedUser} = this.props;
    const {activeChats} = this.props;
    let copyActiveChats = [...activeChats];

    for(var i = 0; i < copyActiveChats.length; i++) {
      if (copyActiveChats[i].selectedUser == user.selectedUser) {
        copyActiveChats[i].isActive = !user.isActive;
        break
      }
    }

    console.log('clickChatBar', copyActiveChats);

    this.setState({activeChats: copyActiveChats})
  }

  listenForNewMessages() {
    const {socket} = this.props;
    let that = this;

    socket.on('new message', function(data) {
      const {messages} = that.state;
      let copyOfMessages = Object.assign({}, messages);
      console.log('new message display copymessages', copyOfMessages)
      if (!copyOfMessages[data.from]) {
        copyOfMessages[data.from] = [{selectedUser: data.selectedUser, from: data.from, input: data.input}];
      } else {
        copyOfMessages[data.from].push({selectedUser: data.selectedUser, from: data.from, input: data.input});
      }
      that.setState({messages: copyOfMessages, newMessage: true})
    })
  }

  sendMessage(e, inputValue, selectedUser) {
    e.preventDefault();
    const {messages} = this.state;
    console.log('sendMessage', messages)
    const {socket, currentUser} = this.props;
    let copyOfMessages = Object.assign({}, messages);
    if (!copyOfMessages[selectedUser]) {
      copyOfMessages[selectedUser] = [{from: currentUser, input: inputValue}]
    } else {
      copyOfMessages[selectedUser].push({from: currentUser, input: inputValue});
    }
    this.setState({messages: copyOfMessages})
    socket.emit('send message', {from: currentUser, selectedUser: selectedUser, input: inputValue})
  }

  updateInputValue(e) {
    this.setState({inputValue: e.target.value})
  }

  displayMessages(user) {
    const {messages} = this.state;
    const {selectedUser, currentUser} = this.props;

    console.log('selected user is ', user.selectedUser);

    if (!messages[user.selectedUser]) {
      return
    }

    return messages[user.selectedUser].map((message) => {
      return (
        <div className={"chat-bubble " + ((message.from == currentUser) ? 'self' : 'other')}>
          <h6>{(message.from == currentUser) ? currentUser : user.selectedUser}</h6>
          <p>{message.input}</p>
        </div>
      )
    })
  }

  displayChats() {
    const {activeChats} = this.props;

    console.log('activeChats', activeChats)

    if (!activeChats || activeChats.length <= 0) {
      return
    }

    return activeChats.map((user) => {
      return (
        <div className="chat-box">
          <div className="chat-header" onClick={() => {this.clickChatBar(user)}}>Speaking with {user.selectedUser}</div>
          <div className={"chat-body " + (!user.isActive ? 'minimize' : '')}>
            {this.displayMessages(user)}
            <SendMessage sendMessage={this.sendMessage} selectedUser={user.selectedUser}/>
          </div>
        </div>
      )
    })
  }

  render() {
    const {selectedUser} = this.props;

    if (!selectedUser) {
      return null
    }

    return(
      <div className="chat-boxes">
        {this.displayChats()}
      </div>
    )
  }
}