const { select, withSelect, subscribe } = wp.data;
const axios = require( 'axios' )

// https://github.com/WordPress/gutenberg/tree/master/data#withselect-mapselecttoprops-function--function
// this handles the logic of when to save to the data and what to save.
//
// What I want this to do is save postmeta for the draft and subsequent revisions and then, when it's published, only update
// the published post when it's updated. This is proof of concept.
// 
// It goes like this:
// 1 -- if the post is not saving, isSavingPost == false, then do nothing (phew, easy)
// 2 -- if it's not publishing and the post status includes draft, find the next revision ID
// 3 -- save to the post id and send along the next revision ID if there is one. The update cb on register_rest_field will handle this
// 		**note** register_rest_field doesn't cover revisions! So it's kind of gone anyway.
//  
function UpdateObjections( { objectionProps } ) {
	
	let isSaving = select( 'core/editor' ).isSavingPost()

	if( ! isSaving ){
		// run away, run away, nothing to do here
		return null
	}

	let isPublishing = select( 'core/editor' ).isPublishingPost()
	let status = select( 'core/editor' ).getCurrentPost().status

	// headers for the request :)
	let headers = {
		'X-WP-Nonce': wpApiSettings.nonce
	}

	let revisionId = 0

	// currently only drafts have revisions, so if we're on a revision, save to the revision id (plus one I think) AND the post id
	if( ! isPublishing && status.includes( 'draft' ) ){
		
		// get the last revision ID and add one to get the next one
		revisionId = select( 'core/editor' ).getCurrentPostLastRevisionId() // it needs to be plus one but do that in the update callback
	}

	let postId = select( 'core/editor' ).getCurrentPostId() // ID of the current post
	let postPostUrl = wpApiSettings.root + 'wp/v2/posts/' + postId // where the request will go

	axios( {
		method: 'post',
		url: postPostUrl,
		headers: headers,
		data: {
			mjj_objections: {
				objection: objectionProps.attributes.objection, // the rest api will handle sanitization with the update callback 
				severity: objectionProps.attributes.severity,
				revision_id: revisionId
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