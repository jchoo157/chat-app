import React, { Component } from 'react';

export default class CreateUser extends Component {
  constructor() {
    super();

    this.state = {
      isAgent: false
    }

    this.checkboxClicked = this.checkboxClicked.bind(this);
  }

  checkboxClicked(e) {
    const {isAgent} = this.state;
    this.setState({isAgent: !isAgent})
  }

  render() {
    const {currentUser, createUser, updateCurrentUser} = this.props;
    
    return (
      <div id="create_user">
        <h1>Create Your Username!</h1>
        <p>Create a username and join a chat!</p>
        <form action="" onSubmit={(e) => {createUser(e, this.state.isAgent)}}>
          <label for="username">Username</label>
          <br/>
          <input id="username" autocomplete="off" value={currentUser} onChange={(e) => {updateCurrentUser(e)}}/>
          <br/>
          <div className="check-box-agent">
            <label for="check_box">Create as Agent</label>
            <input id="check_box" type="checkbox" onClick={(e) => {this.checkboxClicked(e)}} />
          </div>
          <br/>
          <button type="submit">Send</button>
        </form>
      </div>  
    )
  }
}