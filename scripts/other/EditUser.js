/*
  EditUser
*/

import React, {PropTypes} from 'react'
import autobind from 'autobind-decorator'
import Modal from 'react-modal'
import Link from 'valuelink'
import { Input, TextArea, Select, Radio, Checkbox, isRequired, isEmail } from 'valuelink/tags'

@autobind
class EditUser extends React.Component {
  constructor() {
      super();
      this.state = {
        name: '',
        email: '',
        isActive: true
      };
    } 

  componentWillMount(){
    console.log('asdf1')
    console.log(this.props.userLink.value)
    console.log('asdf2')
    this.setState( this.props.userLink.value );
    console.log(this.state)
    console.log('asdf3')
  }

  onSubmit( e ){
      e.preventDefault();

      console.log('3454561')
      console.log(this.props)
      console.log('3454562')
      const { userLink, onClose } = this.props;
      console.log('userLink in onSubmit', userLink)

      userLink.set( this.state );
      onClose();
  }

  onCancel(){
      this.props.onClose();
  }

  render(){
      const ValidatedInput = ( props ) => (
        <div>
            <Input { ...props } />
            <div className="validation-error">
                { props.valueLink.error || '' }
            </div>
        </div>
    );

      const linked = Link.all( this, 'name', 'email', 'isActive' );

      linked.name
            .check( isRequired )
            .check( x => x.indexOf( ' ' ) < 0, 'Spaces are not allowed' );

      linked.email
            .check( isRequired )
            .check( isEmail );

      return (
          <form onSubmit={ this.onSubmit } key={ '3456dgf' }>
              <label>
                  Name: <ValidatedInput type="text" valueLink={ linked.name } key={ '634sg' }/>
              </label>

              <label>
                  Email: <ValidatedInput type="text" valueLink={ linked.email }/>
              </label>

              <label>
                  Is active: <Input type="checkbox" checkedLink={ linked.isActive }/>
              </label>

              <button type="submit" disabled={ linked.name.error || linked.email.error }>
                  Save
              </button>
              <button type="button" onClick={ this.onCancel }>
                  Cancel
              </button>
          </form>
      );
  }
};

EditUser.propTypes = {
  userLink : PropTypes.instanceOf( Link ).isRequired,
}

export default EditUser
