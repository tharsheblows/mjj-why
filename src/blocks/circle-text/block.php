<?php

// Register the block and server side render

function mjj_why_circle_text_init() {
	register_block_type( 'mjj-why/circle-text', array(
    	'render_callback' => 'mjj_why_circle_text_render'
	) );
}
add_action( 'init', 'mjj_why_circle_text_init' );

function mjj_why_circle_text_render( $attributes ){

	// get the component we're using
	$block_template = file_get_contents( plugin_dir_path( __FILE__ ) . "component.jsx" );
	// regex voodoo to get the php
	$block_template_in_php = mjj_why_jsx_to_php( $attributes, $block_template );
	return '<div class="wp-block-mjj-why-circle-text">' . wp_kses_post( $block_template_in_php ) . '</div>';
}