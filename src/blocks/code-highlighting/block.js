/**
 * BLOCK: mjj-why-code-highlighting
 *
 * The render bit is taken from https://github.com/pantheon-systems/code-highlighting-gutenberg-block by Daniel Bachhuber
 */

//  Import CSS.
import './style.scss'
import './editor.scss'

var Prism = require('prismjs');
var loadLanguages = require('prismjs/components/index.js');

const { __ } = wp.i18n // Import __() from wp.i18n
const { registerBlockType } = wp.blocks // Import registerBlockType() from wp.blocks

const {
	TextareaControl
} = wp.components

const { Component } = wp.element;

// this approach is from https://www.ibenic.com/create-gutenberg-block-displaying-post/
class MJJCodeHighlightingEdit extends Component {

	static getInitialState( code, language, highlighting ) {

		language = ( language ) || 'css'
		code = ( code ) || ''
		highlighting = ( highlighting ) || ''

		return {
			code: code,
			language: language,
			highlighting: highlighting 
		}
	}

	constructor () {

		super( ...arguments )
		this.state = this.constructor.getInitialState( 
			this.props.attributes.code, 
			this.props.attributes.language, 
			this.props.attributes.highlighting 
		) // set the initial state of code

		this.onChangeCode = this.onChangeCode.bind(this)
		this.onChangeLanguage = this.onChangeLanguage.bind(this)
		this.createHighlighting = this.createHighlighting.bind(this)

		this.id = "textarea-" + this.props.id

		this.languages = {
			'css' : 'css',
			'javascript' : 'javascript',
			'html' : 'html',
			'php' : 'php',
			'json' : 'JSON',
			'jsx' : 'jsx'
		}

		this.createHighlighting()
	}

	onChangeCode ( newCode ) {

		// so these are callbacks because it wasn't updating quite right on past
		this.setState( 
			{ code: newCode }, 
			() => {
				this.props.setAttributes( {
					code: newCode
				} )
			}
		)

	}

	onChangeLanguage ( newLanguage ) {
		// so these are callbacks because it wasn't updating quite right on past
		this.setState( 
			{ language: newLanguage }, 
			() => {
				this.props.setAttributes( {
					language: newLanguage
				} )
			}
		)

	}

	createHighlighting() {
		let element = document.getElementById( this.id )
		let language = this.state.language

		let html = Prism.highlight( this.state.code, Prism.languages.css, 'css')
		this.props.setAttributes( {
			highlighting: html
		} )
		return( { __html: html } )
	}

	render () {
		let code = this.state.code
		let languageClassName = 'language-' + this.state.language 
		return (
		<div>
			<pre>
				<code id={ this.id } className={ languageClassName } dangerouslySetInnerHTML={ this.createHighlighting() }></code>
			</pre>
			{
				( !! this.props.focus ) &&
					<div>
						<div className="error" style={{ 'margin-left': '0' }}>
							<p>hardcoded to css at the moment, add in &lt;select&gt; here for languages</p>	
						</div>
						<TextareaControl
							 label={ __( 'Code snippet goes here:' ) }
							 onChange={ this.onChangeCode }
							 value={ this.state.code }
						/>
					</div>
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
registerBlockType( 'mjj-why/code-highlighting', {

	title: __( 'mjj-why - code highlighting' ), // Block title.
	icon: 'dashicons-admin-post', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.

	attributes: {
		code: {
			type: 'string'
		},
		language: {
			type: 'string'
		},
		highlighting: {
			type: 'string'
		}
	},

	edit: MJJCodeHighlightingEdit,

	// what shall we save to the database?
	save () {
		return null
	}
} )
