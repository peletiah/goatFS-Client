/*
  Userslist
*/

import React, {PropTypes} from 'react'
import autobind from 'autobind-decorator'
import Modal from 'react-modal'
import Link from 'valuelink'
import { Input, TextArea, Select, Radio, Checkbox } from 'valuelink/tags'
import EditUser from './EditUser'

@autobind
class Userslist extends React.Component {
  constructor() {
      super();
      this.state = {
        users: [],
        dialog: null,
        editing: null
      };
    }


  render () {

   const Header = () =>(
    <div className="users-row">
        <div>Name</div>
        <div>Email</div>
        <div>Is Active</div>
        <div/>
    </div>
    );
    
    const usersLink = Link.state( this, 'users'),
      { dialog, editing } = this.state;

    return (
    <div>
     <button onClick={ () => this.openDialog( 'addUser' ) }>
         Add User
     </button>

     <Header/>

     { usersLink.map( ( userLink, i ) => (
         <UserRow key={ i }
                  userLink={ userLink }
                  onEdit={ () => this.openDialog( 'editUser', i ) }
         />
     ) )}

      <EditUser userLink={ usersLink.at( editing ) } key={ 'asdf' }>
        {console.log('EditUser')}
      </EditUser>
    </div>
    );
  }


};

export default Userslist

