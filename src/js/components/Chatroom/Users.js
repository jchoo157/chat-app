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
    const {users, joinUserChat} = this.props;

    return users.map((user) => {
      return (
        <li className={"user " + (user.isAgent ? 'agent' : '')} onClick={(e) => {joinUserChat(e)}}>{user.name}</li>
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