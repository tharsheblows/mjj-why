/**
 * BLOCK: mjj-why-circle-text
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss'
import './editor.scss'

const { __ } = wp.i18n // Import __() from wp.i18n
const { registerBlockType } = wp.blocks // Import registerBlockType() from wp.blocks

const {
	TextControl
} = wp.components

import MJJCircleText from './component.jsx'

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
registerBlockType( 'mjj-why/circle-text', {

	title: __( 'mjj-why - text in a red circle' ), // Block title.
	icon: 'dashicons-admin-post', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.

	attributes: {
		circleText1: {
			type: 'string'
		},
		circleText2: {
			type: 'string'
		},
		circleText3: {
			type: 'string'
		},
		circleLink1: {
			type: 'string'
		},
		circleLink2: {
			type: 'string'
		},
		circleLink3: {
			type: 'string'
		}
	},

	edit: props => {

		const {
			attributes: {
				circleText1,
				circleText2,
				circleText3,
				circleLink1,
				circleLink2,
				circleLink3
			},
			focus,
			className,
			setAttributes
		} = props

		function onChangeText ( attr, newText ) {
			let newAttribute = {}
			newAttribute[attr] = newText
			setAttributes( newAttribute )
		}

		return (
			<div className={ className } >
			{
				!! focus 
					? 
						<div>
							<div class="wrapper">
								<div class="circle">
  									<span>
  										<TextControl
  											value={ circleText1 }
  											onChange={ onChangeText.bind( this, 'circleText1' ) }
  										/>
  									</span>
								</div>
  								<TextControl
  									label={ __( 'Link' ) }
  									value={ circleLink1 }
  									onChange={ onChangeText.bind( this, 'circleLink1' ) }
  								/>
							</div>
							<div class="wrapper">
								<div class="circle">
  									<span>
  										<TextControl
  											value={ circleText2 }
  											onChange={ onChangeText.bind( this, 'circleText2' ) }
  										/>
  									</span>								
								</div>
   								<TextControl
  									label={ __( 'Link' ) }
  									value={ circleLink2 }
  									onChange={ onChangeText.bind( this, 'circleLink2' ) }
  								/> 
							</div>
							<div class="wrapper">
								<div class="circle">
  									<span>
  										<TextControl
  											value={ circleText3 }
  											onChange={ onChangeText.bind( this, 'circleText3' ) }
  										/>
  									</span>
								</div>
  								<TextControl
  									label={ __( 'Link' ) }
  									value={ circleLink3 }
  									onChange={ onChangeText.bind( this, 'circleLink3' ) }
  								/>
							</div>
						</div>
					:
						<MJJCircleText attributes={ props.attributes } />
			}
			</div>
		)	
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save () {
		return null
	}
} )
