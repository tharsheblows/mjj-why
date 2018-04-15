/**
 * BLOCK: mjj-why-keiths-polygon
 *
 * The idea for this ever so stylish block is from Keith Devon's talk on future.css
 * (Please note: he can actually design things that work well and look good)
 */

//  Import CSS.
import './style.scss'
import './editor.scss'

const { __ } = wp.i18n // Import __() from wp.i18n
const { registerBlockType } = wp.blocks // Import registerBlockType() from wp.blocks

const {
	TextareaControl
} = wp.components

const { Component } = wp.element

import MJJKeithsPolygon from './MJJKeithsPolygon.jsx'

// this approach is from https://www.ibenic.com/create-gutenberg-block-displaying-post/
class MJJKeithsPolygonEdit extends Component {

	static getInitialState( content ) {

		content = ( content ) || ''
		
		return {
			content: content
		}
	}

	constructor () {

		super( ...arguments )
		this.state = this.constructor.getInitialState( 
			this.props.attributes.content
		) // set the initial state of code

		this.className = this.props.className

		this.onChangeValue = this.onChangeValue.bind( this )
		this.createContent = this.createContent.bind( this )
	}

	// handles setting the state for any change
	onChangeValue ( attr, newValue ) {

		let newObj = {}
		newObj[ attr ] = newValue || ''

		// so these are callbacks because it wasn't updating quite right on past
		this.setState( 
			newObj, 
			() => {
				this.props.setAttributes( newObj )
				if( attr == 'code' )
					autosize.update( this.textArea )
			}
		)

	}

	createContent () {
		let content = this.state.content
		let clean = content // I really want to use DOMpurify here

		return( { __html: clean } )
	}

	render () {
		
		return (
			<div className={ this.className }>
				<MJJKeithsPolygon
					attributes = { this.props.attributes }
				/>
				{
					( !! this.props.focus ) &&
						<TextareaControl
							 label={ __( 'content here (sorry, textareas don\'t respect clipped paths):' ) }
							 onChange={ this.onChangeValue.bind( this, 'content' ) }
							 value={ this.state.content }
						/>
				}
			</div>		
		)
	}	

}

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'mjj-why/keiths-polygon', {

	title: __( 'mjj-why - keiths polygon' ), // Block title.
	icon: 'dashicons-admin-post', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.

	attributes: {
		content: {
			type: 'string'
		}
	},

	edit: MJJKeithsPolygonEdit,

	// what shall we save to the database?
	save () {
		return null
	}
} )
