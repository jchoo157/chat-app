import React, {Component} from 'react';
import io from 'socket.io-client';
import ChatBox from '../components/ChatRoom/ChatBox';
import CreateUser from '../components/Chatroom/CreateUser';
import Users from '../components/Chatroom/Users';

const socket = io();

export default class ChatRoom extends Component {
  constructor() {
    super();

    this.state = {
      currentUser: '',
      selectedUser: '',
      users: [],
      created: false,
      activeChats: [],
      newMessagesFromUsers: {}
    }

    this.updateCurrentUser = this.updateCurrentUser.bind(this);
    this.createUser = this.createUser.bind(this);
    this.joinUserChat = this.joinUserChat.bind(this);
    this.activeChats = this.activeChats.bind(this);
    this.setNewMessagesFromUsers = this.setNewMessagesFromUsers.bind(this);
  }

  componentDidMount() {
    const that = this;

    socket.on("created user", function(data) {
      let copyUsers = [...data.usersArray];
      that.setState({users: copyUsers})
    })
  }

  setNewMessagesFromUsers(newMessages) {
    this.setState({newMessagesFromUsers: newMessages})
    console.log('setNewMessages', newMessages);
  }

  activeChats(selectedUser) {
    const {activeChats} = this.state;
    let copyActiveChats = [...activeChats];

    if (copyActiveChats.length >= 3) {
      copyActiveChats.pop()
      copyActiveChats.unshift({selectedUser: selectedUser, isActive: true})
    } else {
      copyActiveChats.push({selectedUser: selectedUser, isActive: true})
    }

    this.setState({selectedUser: selectedUser, activeChats: copyActiveChats})
  }

  joinUserChat(e) {
    this.activeChats(e.target.innerText)
    console.log(e.target.innerText)
  }

  createUser(e, isAgent) {
    e.preventDefault();
    socket.emit('create user', {currentUser: this.state.currentUser, isAgent: isAgent});
    this.setState({created: true, isAgent: isAgent})
  }

  updateCurrentUser(e) {
    this.setState({currentUser: e.target.value})
  }

  render() {
    const {users, currentUser, selectedUser, created, isAgent, activeChats, newMessagesFromUsers} = this.state;

    return(
      <div id="chatroom">
        {!created ? <CreateUser currentUser={currentUser} createUser={this.createUser} updateCurrentUser={this.updateCurrentUser}/> : null}
        {created ? <Users users={users} joinUserChat={this.joinUserChat} isAgent={isAgent} newMessagesFromUsers={newMessagesFromUsers} /> : null}
        {created ? <ChatBox socket={socket} currentUser={currentUser} selectedUser={selectedUser} isAgent={isAgent} users={users} activeChats={activeChats} setNewMessagesFromUsers={this.setNewMessagesFromUsers}/> : null}
      </div>
    )
  }
}