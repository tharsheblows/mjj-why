<?php

// Register the block and server side render
// again, I totally copied this from https://github.com/pantheon-systems/code-highlighting-gutenberg-block/

function mjj_why_code_highlighting_init() {

	register_block_type( 'mjj-why/code-highlighting', array(
    	'render_callback' => 'mjj_why_code_highlighting'
	) );
}
add_action( 'init', 'mjj_why_code_highlighting_init' );

function mjj_why_code_highlighting( $attributes ){

	if ( empty( $attributes['highlighting'] ) ) {
			return;
	} 

	return '<pre class="language-javascript"><code>' . wp_kses_post( $attributes['highlighting'] ) . '</code></pre>';
}

function mjj_why_code_highlighting_assets () {
	// one could, if one so wanted, give people a choice here
	wp_enqueue_style( 'prism', 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.14.0/themes/prism-tomorrow.min.css' );
}
add_action( 'enqueue_block_editor_assets', 'mjj_why_code_highlighting_assets' );
add_action( 'enqueue_block_assets', 'mjj_why_code_highlighting_assets' );