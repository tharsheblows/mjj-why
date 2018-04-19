const { select, withSelect, subscribe } = wp.data;
const axios = require( 'axios' )

/** 
 *
 * This handles updating the postmeta. In general it should:
 *  -- save / update the postmeta with the post_id of the parent post every time the post is saved, including auto-saves
 *  -- save the postmeta with the post_id of a revision every time a revison is saved
 *
 * This approach — saving postmeta when a revision is created — will clutter up the postmeta table. 
 * An excellent case could be made that this is *not* the correct approach and the data should be stored in attributes and 
 * only saved to the postmeta table iff the revision is published. (This would require the canonical source of truth to be the
 * attributes and if postmeta is different, postmeta gets updated. It's currently the other way around.)
 *
 * The revision logic needs to be double checked, I am not completely sure of the exact process WordPress uses when reverting to a revision.
 *  
 * https://github.com/WordPress/gutenberg/tree/master/data#withselect-mapselecttoprops-function--function
 * this handles the logic of when to save to the data and what to save.
 *
 */
function UpdateObjections( { objectionProps } ) {
	
	let isSaving = select( 'core/editor' ).isSavingPost()

	if( ! isSaving ){
		// If a post is not saving, don't do anything
		return null
	}

	let isPublishing = select( 'core/editor' ).isPublishingPost()
	let status = select( 'core/editor' ).getCurrentPost().status

	// headers for the request :)
	// You need these to get drafts which require this
	let headers = {
		'X-WP-Nonce': wpApiSettings.nonce
	}

	let revisionId = 0

	// currently only drafts have revisions, so if we're on a revision, save to the revision id (plus one I think) AND the post id
	if( ! isPublishing && status.includes( 'draft' ) ){
		
		// get the last revision ID and add one to get the next one
		revisionId = select( 'core/editor' ).getCurrentPostLastRevisionId() // it needs to be plus one but do that in the update callback
	}

	// I think I can't rely on _wpGutenbergPost for newly created drafts
	let postId = select( 'core/editor' ).getCurrentPostId() // ID of the current post
	let postType = select( 'core/editor' ).getCurrentPostType()
	let postPostUrl = wpApiSettings.root + 'wp/v2/' + postType + 's/' + postId // where the request will go

	axios( {
		method: 'post',
		url: postPostUrl,
		headers: headers,
		data: {
			mjj_objections: {
				objection: objectionProps.attributes.objection, // the rest api will handle sanitization with the update callback 
				severity: objectionProps.attributes.severity,
				revision_id: revisionId // if there is a revision_id, the update callback in register_rest_field will save additional postmeta with that post_id
			}
		}
	})
	.then( function( response ) {
		console.log( response.data )
	})
	.catch( function ( error ) {
		console.log( 'error' )
	})

	return null
}

const MJJIObjectSave = withSelect( ( select, objectionProps ) => {

	// this only seems to return when the post is saved so that's good
	// but also, on autosave, it only saves when something here has changed which is *bad* because it's not saving the revisions then
	return { objectionProps: objectionProps  };

} )( UpdateObjections )

export default MJJIObjectSave