import React, { Component } from 'react';

export default class Users extends Component {
  constructor() {
    super();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.users !== nextProps.users) {

    }
  }

  listUsers() {
    const {users, joinUserChat, newMessagesFromUsers} = this.props;
    console.log('listUsers', newMessagesFromUsers)
    console.log('users', users)
    return users.map((user) => {
      let hasNewMsg = newMessagesFromUsers[user.name] ? <div className="new-msg-dot"/> : null;
      return (
        <li className={"user " + (user.isAgent ? 'agent' : '')} onClick={(e) => {joinUserChat(e)}}>
          {hasNewMsg}
          {user.name}
        </li>
      )
    })
  }

  render() {
    return (
      <div id="users">
        <h1> Users </h1>
        <ul>
          {this.listUsers()}
        </ul>
      </div>  
    )
  }
}