/*
  Administration
*/

import React from 'react';
import autobind from 'autobind-decorator';
import Multiselect from 'react-widgets/lib/Multiselect';

@autobind
class Administration extends React.Component {

		constructor() {
			super()

			this.state = {
				colors : ['orange', 'red', 'blue', 'purple'],
				startColors : ["orange", "red"]
			};
		}

		modifyValue() {
			console.log("PEEEEEP")
			var startColors = {...this.state.fishes};
			console.log(this.state.startColors)
			startColors = ['blue','green']
			this.setState({ startColors });
			console.log(this.state.startColors)
		} 

    render() {

      return (
        <div className="col-sm-2">
					<Multiselect
           value={this.state.startColors} data={this.state.colors}
					 onChange={value => this.setState({ value })}
          />

					<button type="button" onClick={ this.modifyValue }>Modify</button>
					<div>{this.state.startColors[1]}</div>
        </div>
      )
    }

};

export default Administration
