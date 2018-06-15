import React, {Component} from 'react';
import io from 'socket.io-client';
import ChatRoom from './ChatRoom';

export default class App extends Component {
  constructor() {
    super();
  }

  render() {
    return(
      <div>
        <ChatRoom />
      </div>
    )
  }
}