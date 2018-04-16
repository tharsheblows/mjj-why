<?php

// Register the block and server side render

function mjj_why_i_object_init() {
	register_block_type( 'mjj-why/i-object', array(
    	//'render_callback' => 'mjj_why_i_object_render'
	) );
}
add_action( 'init', 'mjj_why_i_object_init' );

function mjj_why_i_object_render( $attributes ){

	// get the component we're using
	$block_template = file_get_contents( plugin_dir_path( __FILE__ ) . "MJJIObject.jsx" );
	// regex voodoo to get the php
	$block_template_in_php = mjj_why_jsx_to_php( $attributes, $block_template );
	return '<div class="wp-block-mjj-why-i-object">' . wp_kses_post( $block_template_in_php ) . '</div>';
}

// Soooooooo to use the rest api for objects / object like things, we need to use register_rest_field because register_meta can't handle them
// (that isn't its fault, there's no blame here, postmeta is twitchy and confusing)
function mjj_why_i_object_rest_field() {

	$schema = array(
		'required' => false,
		'description' => 'The objections',
		'type' => 'object', // https://core.trac.wordpress.org/changeset/41727 -- it's going to become possible 
        'properties' => array(
          'objection' => array( 'type' => 'string' ),
          'severity' => array( 'type'  => 'string' ),
          'user' => array( 'type' => 'string' )
        )
	);

	$args = array(
		'object' 	=> 'post', // the object type
		'attribute' => 'mjj_objections', // the meta key
		'args' 		=> array( 	// yeah yeah $args['args']
			'get_callback' => 'mjj_objections_get', // populate the field (will handle escaping)
			'update_callback' => 'mjj_objections_update' // update the field (will handle sanitization)
			//'schema' => $schema
		)
	);
	register_rest_field( $args['object'], $args['attribute'], $args['args'] );
}
add_action( 'rest_api_init', 'mjj_why_i_object_rest_field' );

// About the meta key and values
// Let's make a metakey of 'mjj_objections' which has a value that looks like this 
// { 
// 		'objection': 'This is the objection',
// 		'severity': 'This is the severity',
// 		'user': 'username with link'
// }
// 
// We're only going to be allowed to use the blocks once. There are a few ways to approach it if there are a lot of the same block
// BUT I'm not sure if save() in registerBlockType can be counted on to update the postmeta (update_post_meta) synchronously. 
// If it did, update synchronously that is, I could put all the values from all the blocks in one row as an array
// OR OTHERWISE I would need to keep track of the old value of the block and use update_post_meta that way https://developer.wordpress.org/reference/functions/update_post_meta/
// Which, tbh, might work out just fine. But I'm going to do one at a time first. Also it occurs to me that using $prev_value in update_post_meta 
// must not be massively scalable because it has to do WHERE `meta_value` = $prev_value 

function mjj_objections_get( $post_array ) {

	$metakey = 'mjj_objections';
	$escaped_metavalue = '';

	$objections = get_post_meta( $post_array['id'], $metakey, true ); // get that big ol' serialised string. get_post_meta unpacks it for us.
	if( empty( $objections ) ){
		return $escaped_metavalue;
	}

	$escaped_metavalue = mjj_objections_escape( $objections );
	return $escaped_metavalue;
}

function mjj_objections_update( $value, $post_object ) {

	$metakey = 'mjj_objections';


	// this is a leetle bit ugly but bear with me. 
	// get the current value. We could have done this in the block but I think it's best right here.
	$current_objections = get_post_meta( $post_object->ID, $metakey, true ); 

	// don't json decode things that are already arrays (this bit allows me to use postman more easily, I'm leaving it in)
	$value = ( is_array( $value ) ) ? $value : json_decode( $value, true );
	$new_objections = mjj_objections_escape( $value ); // this gives us the escaped array

	// do we have a revision? If so, get the ID
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

// this handles escaping the object
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