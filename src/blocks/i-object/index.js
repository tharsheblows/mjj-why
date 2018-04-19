/**
 * BLOCK: mjj-why-i-object
 *
 * A block that uses register_rest_field to get and update postmeta. 
 * This is proof of concept and I've done it as an exercise for me.
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


registerBlockType( 'mjj-why/i-object', {

	title: __( 'mjj-why - i object' ),
	icon: 'dashicons-admin-post', 
	category: 'common', 

// I've decided to leave these in, kind of for clarity? Like: "Look, here's what we're using."
// I could easily be convinced that they should be removed.
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
