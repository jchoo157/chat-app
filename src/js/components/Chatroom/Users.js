import React, { Component } from 'react';

export default class Users extends Component {
  constructor() {
    super();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.users !== nextProps.users) {

    }
  }

  listAgents() {
    const {users, joinUserChat, newMessagesFromUsers, currentUser, isAgent} = this.props;
    console.log('listUsers', newMessagesFromUsers)
    console.log('users', users)

    if (users.length <= 0) {
      return (<h5>No active Users at the moment!</h5>)
    }

    return users.map((user) => {
      if (user.selectedUser == currentUser) {
        return null
      }

      let hasNewMsg = newMessagesFromUsers[user.name] ? <div className="new-msg-dot">new</div> : null;

      if (user.isAgent) {
        return (
          <li className="user agent" onClick={() => {joinUserChat(user.name)}}>
            {hasNewMsg}
            {user.name}
          </li>
        )
      }
    })
  }

  listUsers() {
    const {users, joinUserChat, newMessagesFromUsers, currentUser, isAgent} = this.props;
    console.log('listUsers', newMessagesFromUsers)
    console.log('users', users)

    if (users.length <= 0) {
      return (<h5>No active Agents at the moment!</h5>)
    }

    return users.map((user) => {
      if (user.selectedUser == currentUser) {
        return null
      }
      let hasNewMsg = newMessagesFromUsers[user.name] ? <div className="new-msg-dot">new</div> : null;

      if (!user.isAgent) {
        return (
          <li className="user" onClick={() => {joinUserChat(user.name)}}>
            {hasNewMsg}
            {user.name}
          </li>
        )
      }
    })
  }

  checkForUsersAndAgents() {
    const {users} = this.props;

    let has = {agents: false, users: false}

    users.map((user) => {
      if (user.isAgent) {
        has.agents = true
      } else if (!user.isAgent) {
        has.users = true
      }
    })

    return has
  }

  render() {
    const {isAgent, users} = this.props;

    return (
      <div id="users">
        <h1>{isAgent ? 'Available Users' : 'Available Agents'}</h1>
        {!isAgent ? <p>{this.checkForUsersAndAgents().agents ? 'Chat with an Agent below!' : 'No Agent is currently active :( (open new tab in brower to create new agents)'}</p> : null}
        {isAgent ? <p>{this.checkForUsersAndAgents().users ? 'These users are waiting to for an Agent to speak to!' : 'No User is currently active :( (open new tab in brower to create new users)'}</p> : null}
        <ul>
          {isAgent ? this.listUsers() : this.listAgents()}
        </ul>
      </div>
    )
  }
}