/**
 * BLOCK: mjj-why-github-gist
 *
 * The render bit is taken from https://github.com/pantheon-systems/github-gist-gutenberg-block by Daniel Bachhuber
 */

//  Import CSS.
import './style.scss'
import './editor.scss'

const { __ } = wp.i18n // Import __() from wp.i18n
const { registerBlockType } = wp.blocks // Import registerBlockType() from wp.blocks

const {
	TextControl
} = wp.components

import MJJGithubGist from './component.jsx'


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
registerBlockType( 'mjj-why/github-gist', {

	title: __( 'mjj-why - github gist' ), // Block title.
	icon: 'dashicons-admin-post', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.

	attributes: {
		gistUrl: {
			type: 'string'
		},
		uncheckedUrl: {
			type: 'string'
		}
	},

	edit: props => {

		const {
			attributes: {
				gistUrl,
				uncheckedUrl
			},
			focus,
			className,
			setAttributes
		} = props

		const onChangeUrl = ( newUrl ) => {

			let newGistUrl = ( newUrl.includes( 'gist.github.com' ) ) ? newUrl : '' // there could be more robust checks here

			setAttributes( { gistUrl: newGistUrl } )
			setAttributes( { uncheckedUrl: newUrl } )
		}

		return (
			( !! focus || ! gistUrl )
				?
					<div> 
  						<TextControl
  							label={ __( 'Github gist url' ) }
  							value={ uncheckedUrl }
  							onChange={ onChangeUrl }
  						/>
  						<MJJGithubGist url={ gistUrl } id={ props.id } />
  					</div>
				:
					<MJJGithubGist url={ gistUrl } id={ props.id } />
		)	
	},

	// what shall we save to the database?
	save () {
		return null
	}
} )
