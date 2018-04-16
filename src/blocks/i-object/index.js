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
	TextControl,
	RadioControl
} = wp.components

const { select } = wp.data;

import MJJIObjectEdit from './MJJIObjectEdit.jsx'
import MJJIObjectSave from './MJJIObjectSave.jsx'


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
registerBlockType( 'mjj-why/i-object', {

	title: __( 'mjj-why - i object' ), // Block title.
	icon: 'dashicons-admin-post', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.

	// this loads here from the attributes because I wanted to get a handle on updating the postmeta, I already know how to get it in :)
	attributes: {
		objection: {
			type: 'string'
		},
		severity: {
			type: 'string',
			default: '3'
		}
	},

	useOnce: true,

	edit: MJJIObjectEdit,

	// what shall we save to the database?
	// the MJJIObjectSave returns null but handles the saving of the metadata
	save ( props ) {
		return <MJJIObjectSave objectionProps={ props } />
	} 
} )
