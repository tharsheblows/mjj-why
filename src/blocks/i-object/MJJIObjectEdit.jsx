
const { __ } = wp.i18n // Import __() from wp.i18n
const {
	TextControl,
	RadioControl
} = wp.components

const { Component } = wp.element;

const axios = require( 'axios' )

import MJJIObjectEditView from './MJJIObjectEditView.jsx'

// this approach is from https://www.ibenic.com/create-gutenberg-block-displaying-post/
class MJJIObjectEdit extends Component {

	static getInitialState( objection, severity ) {

		objection = ( objection ) || ''
		severity = ( severity ) || ''

		return {
			objection: objection,
			severity: severity
		}
	}


	constructor () {

		super( ...arguments )
		this.state = this.constructor.getInitialState( '', '' ) 
		// set the initial state of objection -- you could do this from the attributes if you wanted a backup? I don't know
		// right now it's empty so you can see it get the data

		this.onChangeValue = this.onChangeValue.bind(this)
	}


	onChangeValue ( attr, newValue ) {

		let newObj = {}
		newObj[ attr ] = newValue || ''

		//  I'm still updating the attributes because well why not? I mean there might be a good argument but whatever
		this.setState( 
			newObj, 
			() => {
				this.props.setAttributes( newObj )
			}
		)

	}

	componentDidMount () {

		let postId = _wpGutenbergPost.id
		let url = wpApiSettings.root + wpApiSettings.versionString + 'posts/' + postId
		let self = this 

		// headers for the request :)
		let headers = {
			'X-WP-Nonce': wpApiSettings.nonce
		}

		// get the data needed from the database and then setState
		axios( {
			method: 'get',
			url: url,
			headers: headers
		})
		.then( function( response ) {
			let objectionData = response.data.mjj_objections
			self.setState({
				objection: objectionData.objection,
				severity: objectionData.severity
			})
		})
		.catch( function ( error ) {
			console.log( 'error' )
		})
	}

	render () {
		let focus = this.props.focus 
		let attributes = {
			objection: this.state.objection,
			severity: this.state.severity
		}

		return (
			<div className={ this.props.className } >
			{
				!! focus
					? 
						<div>
  							<TextControl
  								label={ __( 'Objection' ) }
  								value={ this.state.objection }
  								onChange={ this.onChangeValue.bind( this, 'objection' ) }
  							/>

  							<RadioControl
    						    label="Severity"
    						    help="1 is not so severe, 5 is just horrible"
    						    selected={ this.state.severity }
    						    options={ [
    						        { label: '1', value: '1' },
    						        { label: '2', value: '2' },
    						        { label: '3', value: '3' },
    						        { label: '4', value: '4' },
    						        { label: '5', value: '5' },
    						    ] }
    						    onChange={ this.onChangeValue.bind( this, 'severity' ) }
    						/>
  						</div>
					:
						<MJJIObjectEditView attributes={ attributes } className={ this.props.className } />
			}
			</div>
		)
	}	

}

export default MJJIObjectEdit