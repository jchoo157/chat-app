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
      newMessagesFromUsers: {},
      isAgent: false
    }

    this.updateCurrentUser = this.updateCurrentUser.bind(this);
    this.createUser = this.createUser.bind(this);
    this.joinUserChat = this.joinUserChat.bind(this);
    this.activeChats = this.activeChats.bind(this);
    this.setNewMessagesFromUsers = this.setNewMessagesFromUsers.bind(this);
    this.clearEverything = this.clearEverything.bind(this);
  }

  componentDidMount() {
    const that = this;

    socket.on("created user", function(data) {
      let copyUsers = [...data.usersArray];
      that.setState({users: copyUsers})
    })

    socket.on("removed user", function(data) {

      socket.disconnect()
    })
  }

  componentWillUnmount() {
    this.setState({users: that.updateUsers()})
    socket.emit("disconnect", {currentUser: this.state.currentUser})
  }

  clearEverything() {
    this.setState({
      currentUser: '',
      selectedUser: '',
      users: [],
      created: false,
      activeChats: [],
      newMessagesFromUsers: {}
    })
  }

  updateUsers() {
    let copyUsers = [...this.state.users]

    copyUsers.map((user, index) => {
      if (this.state.currentUser == user.name) {
        users.splice(index, 1)
      }
    })

    return copyUsers
  }

  setNewMessagesFromUsers(newMessages) {
    this.setState({newMessagesFromUsers: newMessages})
    console.log('setNewMessages', newMessages);
  }

  activeChats(selectedUser) {
    const {activeChats, newMessagesFromUsers, currentUser} = this.state;
    let copyActiveChats = [...activeChats];

    let userObj = {from: currentUser, selectedUser: selectedUser, isActive: true};

    if (copyActiveChats.length >= 3 || copyActiveChats.some(e => e.selectedUser == selectedUser)) {
      copyActiveChats.pop()
      copyActiveChats.unshift(userObj)
    } else {
      copyActiveChats.push(userObj)
    }

    let copyNewMessagesFromUsers = Object.assign({}, newMessagesFromUsers);
    console.log('active chats', copyNewMessagesFromUsers)
    Object.keys(copyNewMessagesFromUsers).map((key) => {
      if (key == selectedUser && copyNewMessagesFromUsers[key]) {
        copyNewMessagesFromUsers[key] = false;
      }
    })

    this.setState({selectedUser: selectedUser, activeChats: copyActiveChats, newMessagesFromUsers: copyNewMessagesFromUsers})
  }

  joinUserChat(selectedUser) {
    this.activeChats(selectedUser)
    console.log(selectedUser)
  }

  createUser(e, isAgent, createNewUser=true) {
    e.preventDefault();
    createNewUser ? socket.emit('create user', {currentUser: this.state.currentUser, isAgent: isAgent}) : null;
    this.setState({created: true, isAgent: isAgent})
    console.log('create user', isAgent)
  }

  updateCurrentUser(e) {
    this.setState({currentUser: e.target.value})
  }

  render() {
    const { users, currentUser, selectedUser, created, isAgent, 
            activeChats, newMessagesFromUsers} = this.state;

    return(
      <div id="chatroom">
        {/*<div className="cheat-buttons">
          <div className="clear-everything" onClick={() => {this.clearEverything()}}>RESET APPLICATION</div>
          { currentUser && !isAgent ? <div className="become-agent" onClick={(e) => {this.createUser(e, true, false)}}>BECOME AGENT</div> : null }
          { currentUser && isAgent ? <div className="become-user" onClick={(e) => {this.createUser(e, false, false)}}>BECOME USER</div> : null }
        </div>*/}
        <div className="your-username">Your username: <span>{currentUser}</span></div>
        {!created ? <CreateUser currentUser={currentUser} createUser={this.createUser} updateCurrentUser={this.updateCurrentUser}/> : null}
        {created ? <Users currentUser={currentUser} users={users} joinUserChat={this.joinUserChat} isAgent={isAgent} newMessagesFromUsers={newMessagesFromUsers} /> : null}
        {created ? <ChatBox socket={socket} currentUser={currentUser} selectedUser={selectedUser} isAgent={isAgent} users={users} activeChats={activeChats} setNewMessagesFromUsers={this.setNewMessagesFromUsers} newMessagesFromUsers={newMessagesFromUsers} openNewMessageFromUsers={this.openNewMessageFromUsers} joinUserChat={this.joinUserChat}/> : null}
      </div>
    )
  }
}