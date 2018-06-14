import React, { Component } from 'react';
import SendMessage from './SendMessage';

export default class ChatBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: {},
      activeChats: [],
      isTyping: false,
      highlightUser: this.props.selectedUser,
      newMessagesFromUsers: this.props.newMessagesFromUsers
    }

    this.listenForNewMessages = this.listenForNewMessages.bind(this);
    this.clickChatBar = this.clickChatBar.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.isTyping = this.isTyping.bind(this);
    this.highlightUserChat = this.highlightUserChat.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      this.setState({
        activeChats: nextProps.activeChats, 
        isTyping: nextProps.isTyping,
        highlightUser: nextProps.selectedUser,
        newMessagesFromUsers: nextProps.newMessagesFromUsers
      })
    }
  }

  componentDidMount() {
    this.listenForNewMessages()
    this.isTyping()
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
    const {socket, setNewMessagesFromUsers, openNewMessageFromUsers, joinUserChat} = this.props;
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

      let copyNewMessagesFromUsers = Object.assign({}, that.state.newMessagesFromUsers);
      copyNewMessagesFromUsers[data.from] = true;

      setNewMessagesFromUsers(copyNewMessagesFromUsers);
      console.log('before activeChats length', copyNewMessagesFromUsers)

      if (that.state.activeChats.length < 3) {
        console.log('activeChats lenght < 3', that.state.activeChats)
        joinUserChat(data.from);
      }

      that.setState({messages: copyOfMessages})
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

  highlightUserChat(selectedUser) {
    this.setState({highlightUser: selectedUser})
  }

  isTyping() {
    const {socket} = this.props;
    const that = this;
    socket.on('is typing', function(data) {
      console.log('we in it! they typing dawg!')
      that.setState({isTyping: true})
      // setTimeout(
      //   that.setState({isTyping: false}),
      //   5000
      // )
    })
  }

  displayMessages(user) {
    const {messages} = this.state;
    const {selectedUser, currentUser} = this.props;

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
    const {isTyping, highlightUser} = this.state;
    const {activeChats, newMessagesFromUsers, currentUser, socket, selectedUser} = this.props;

    console.log('activeChats', activeChats)

    if (!activeChats || activeChats.length <= 0) {
      return
    }

    return activeChats.map((user) => {
      let minimize = (!user.isActive ? 'minimize' : '')
      return (
        <div className={"chat-box " + ((highlightUser != user.selectedUser) ? 'dim-box' : '')}>
          <div className="chat-header" onClick={() => {this.clickChatBar(user)}}>Speaking with {user.selectedUser}</div>
          <div className={"chat-body " + minimize}>
            {this.displayMessages(user)}
            {isTyping ? <h6>{user.selectedUser} is typing</h6> : null}
          </div>
          <div className={minimize}>
            <SendMessage socket={socket} sendMessage={this.sendMessage} selectedUser={user.selectedUser} currentUser={currentUser} highlightUserChat={this.highlightUserChat}/>
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