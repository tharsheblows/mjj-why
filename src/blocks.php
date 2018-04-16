<?php
/**
 * Blocks registrations
 *
 * A list of all the blocks' php files which contain their registrations
 *
 * @since 	1.0.0
 * @package CGB
 */

// this should be a list of directory names in blocks
$block_directories = array(
	'circle-text',
	'github-gist',
	'code-highlighting',
	'keiths-polygon',
	'i-object'
);

foreach( $block_directories as $block_directory ){
	require_once plugin_dir_path( __FILE__ ) . "blocks/{$block_directory}/index.php";
}

/**
 * This takes a template written in jsx and changes it to php so I can use it in the server side render.
 * This requires a bit of naming convention. It looks for attributes.whatever and makes them $attributes->whatever and also makes className= into class=
 * 						
 * @param string $jsx The template written in jsx
 * @return string     The template written in php
 */
function mjj_why_jsx_to_php( $attributes, $jsx ){

	// this looks for the bit between // templatestart and // templateend to use for the php template
	$get_render = preg_match('/\/\/[ ]*templatestart(.*?)\/\/[ ]*templateend/s', $jsx, $matches );


	$php = str_replace( 'className=', 'class=', $matches[1] ); // make className into class

	// NOTE: this is expecting attributes.whatever so let attributes = this.props.attributes in render function
	foreach( $attributes as $attribute => $value ){
		// I dunno it just seems like escaping something would be a good idea
		$value = esc_html( $value );
		$php = preg_replace( "/({[ ]*)attributes\.$attribute([ ]*})/", $value, $php ); // changed { attributes.  to { $attributes-> 
	}

	return $php;
}