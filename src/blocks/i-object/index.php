<?php

/**
 * This file takes care of all the block specific php. 
 * Please note that it's procedural code which I am using to examine specific points; don't use this as a template on *how to write* your own code.
 * There is also too much duplicated code between this file and the components but I will refactor later.
 *
 * This file currently:
 *  - mjj_why_i_object_init: Registers the block type with a render callback
 *  - mjj_why_i_object_render: The render callback which handles adding the markup to the public facing page 
 *  - mjj_why_i_object_rest_field: Registers the postmeta data with the rest api so it is shown in posts
 *  - mjj_why_i_objections_get: The callback for get requests to the post's route; handles how the postmeta is presented in the rest api
 *  - mjj_objections_update: The callback for post requests to the post's route which contain the postmeta key; handles updating the post *and any listed revisions* postmeta
 *  - mjj_objections_escape: Whitelists the keys and esacpes the values
 *
 */


/**
 * Registers the mjj-why/i-object block.
 *
 * The name of the block registered must be the same as the one registered in the js function registerBlockType. 
 * This block has a render_callback which is responsible for rendering the block on the public facing site.
 */
function mjj_why_i_object_init() {
	register_block_type( 'mjj-why/i-object', array(
    	'render_callback' => 'mjj_why_i_object_render'
	) );
}

/**
 * Adds mjj_why_i_object_init to the 'init' action
 */
add_action( 'init', 'mjj_why_i_object_init' );

/**
 * This handles the output on the public facing post page.
 * 
 * NOTES: 
 *  - This runs *after* wp_kses and you absolutely must escape the output here and not introduce vulnerabilities. 
 *  - This replaces anything rendered with the save () method in registerBlockType
 * 
 * @param  array $attributes An array of the attributes registered in the js function registerBlockType
 * @return string            The *escaped* markup which will be used to display the block
 */
function mjj_why_i_object_render( $attributes ){
	
	// pick the post id up from the page
	// If this is deep in a non-main loop somewhere I expect this will fail
	$id = get_the_ID();
	$objectionData = get_post_meta( $id, 'mjj_objections', true ); // we're only allowing one
	
	if( empty( $objectionData ) ){
		return;
	}

	$severity = ( !empty ( $objectionData[ 'severity' ] ) ) ? $objectionData[ 'severity' ] : 1;

	// this should be somewhere else and done differently but hey ho
	switch( $severity ){
		case '1':
			$color = "limegreen view";
			break;
		case '2':
			$color = "greenyellow view";
			break;
		case '3':
			$color = "yellow view";
			break;
		case '4':
			$color = "orange view";
			break;
		case '5':
			$color = "red view";
			break;
		default:
			$color = "yellow view";
	}

	// escape it
	$objection = ( !empty( $objectionData[ 'objection' ] ) ) ? wp_kses_post( $objectionData[ 'objection' ] ) : '';
	// what an ugly return! I will refactor later or never. :)
	return "<div class=\"wp-block-mjj-why-i-object\"><div class=\"$color\">the objection: $objection</div></div>"; 
}

/**
 * Registers the postmeta with the rest api so it can be shown there.
 * This uses register_rest_field() rather than register_meta() because register_meta() currently does not allow objects.
 */
function mjj_why_i_object_rest_field() {

	// The schema is, I think, not yet used for validation.
	$schema = array(
		'required' => false,
		'description' => 'The objections',
		'type' => 'object', // https://core.trac.wordpress.org/changeset/41727 -- it's going to become possible 
        'properties' => array(
          'objection' => array( 'type' => 'string' ),
          'severity' => array( 'type'  => 'string' )
        )
	);

	$args = array(
		'object' 	=> array( 'post', 'page' ), // the object type *not* the subtype. For custom post types it's 'post'
		'attribute' => 'mjj_objections', // the meta key
		'args' 		=> array( 	
			'get_callback' => 'mjj_objections_get', // populate the field (will handle escaping)
			'update_callback' => 'mjj_objections_update', // update the field (will handle sanitization)
			//'schema' => $schema // for some reason, using the schema causes this to fail. My current guess is it's trying to not allow objects.
		)
	);

	// This is the function which adds the postmeta to the page and post
	register_rest_field( $args['object'], $args['attribute'], $args['args'] );
}

/**
 * Adds mjj_why_i_object_rest_field to the 'rest_api_init' action (we don't need it everywhere, just on the rest api)
 */
add_action( 'rest_api_init', 'mjj_why_i_object_rest_field' );

/** About the meta key and values
/*  Let's make a metakey of 'mjj_objections' which has a value that looks like this 
/*  { 
/*  		'objection': 'This is the objection',
/*  		'severity': 'This is the severity',
/*  }
/*  
/*  We're only going to be allowed to use the blocks once. 
/*  There are a few ways to approach it if there are a lot of the same block but I haven't extended this to do that.
/* 
 */

/**
 * This handles the get request for the postmeta data. It is what will set up the data in the post's JSON object.
 * NOTE: this could take anything. It doesn't have to be postmeta. You could put custom table data in here and it will set it up as the value for the key used in register_rest_field.
 * 		
 * @param  array $post_array The post array for the current post
 * @return array             The escaped value to put in the post's JSON object
 */
function mjj_objections_get( $post_array ) {

	$metakey = 'mjj_objections'; // the metakey name
	$escaped_metavalue = '';

 	// get that big ol' serialised string. get_post_meta unpacks it for us.
 	// the last parameter (true) means that we're only getting one value, even if there are more in the table
	$objections = get_post_meta( $post_array['id'], $metakey, true );

	if( empty( $objections ) ){
		return $escaped_metavalue;
	}

	// make sure to escape it
	$escaped_metavalue = mjj_objections_escape( $objections );
	return $escaped_metavalue;
}

/**
 * This handles the post request when the request is made to posts/[ID] and contains the key registered in register_rest_field. 
 * NOTE: This doesn't have to update to postmeta, it could go anywhere.
 * 	
 * @param  array|string  $value       The value of the metakey registered with register_rest_field
 * @param  object 		 $post_object The current post object
 * @return number|null          	  This doesn't really do anything
 */
function mjj_objections_update( $value, $post_object ) {

	$metakey = 'mjj_objections'; // this is the metakey registered above in regsiter_rest_field


	// this is a leetle bit ugly but bear with me. 
	// get the current value. We could have done this in the block but I think it's best right here.
	$current_objections = get_post_meta( $post_object->ID, $metakey, true ); 

	// don't json decode things that are already arrays (this bit allows me to use postman more easily, I'm leaving it in)
	$value = ( is_array( $value ) ) ? $value : json_decode( $value, true );

	$new_objections = mjj_objections_escape( $value ); // this gives us the escaped array

	// do we have a revision? If so, get the ID
	// Because I'd like to keep the revisions data in sync with the revisions, I'm going to add it to the postmeta table with the revision id here

	$revision_id = ( !empty( $value['revision_id'] ) ) ? ( (int) $value['revision_id'] + 1 ) : 0; // the revision we need is one past this one

	// If there is currently NO row with the metakey then add one
	if( empty( $current_objections ) ){
		// this only allows ONE row per metakey. If there already is one, it fails
		$updated_objections = add_post_meta( $post_object->ID, $metakey, $new_objections, true );
	} else {
		// If there is currently a row for the metakey, update it
		$updated_objections = update_post_meta( $post_object->ID, $metakey, $new_objections, $current_objections );
	}

	// OK so for revisions we'll do it all in the same 
	// BUT PLEASE BE AWARE THAT THIS WILL NOT SHOW UP IN THE REST API
	// There might be a filter somewhere, tbh I'm fairly sure there is, but I'm not going to deal with it.
	// This is how you get it in the database though :)
	if( $revision_id !== 0 ){
		if( empty( $current_objections ) ){
			// this only allows ONE row per metakey. If there already is one, it fails
			$updated_objections_revisions = add_post_meta( $revision_id, $metakey, $new_objections, true );
		} else {
			$updated_objections_revisions = update_post_meta( $revision_id, $metakey, $new_objections, $current_objections );
		}
	}

	return $updated_objections; // returns meta ID if the key didn't exist, true on successful update, false on failure. There's no reason to return anything though tbh.
}

/**
 * I'm using this for escaping and sanitising. It runs through the array, whitelisting key/values and escaping the values.
 * 
 * @param  array $objections  The array returned from get_post_meta OR the array to use in update_post_meta
 * @return array              The array which contains only whitelisted keys with escaped values.
 */
function mjj_objections_escape( $objections ){

	if( empty( $objections ) ){ return []; }

	$escaped_metavalue = [];

	// there may be cleverer ways of doing this but this works
	foreach( $objections as $key => $value ){
		switch( $key ){
			case 'objection':
				$value = wp_kses_post( $value );
				$escaped_metavalue[ $key ] = $value;
				break;
			case 'severity':
				$value = (int) $value;
				$escaped_metavalue[ $key ] = $value;
				break;
			default:
				break;
		}
	}
	return $escaped_metavalue;
}