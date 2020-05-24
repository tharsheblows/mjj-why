<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once plugin_dir_path( __FILE__ ) . 'blocks.php';

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function mjj_why_block_assets() {
	wp_enqueue_style(
		'mjj-why-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ), // Dependency to include the CSS after it.
		filemtime( plugin_dir_path( __FILE__ ) . '../dist/blocks.style.build.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function mjj_why_block_assets().

// Hook: Frontend assets.
add_action( 'init', 'mjj_why_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function mjj_why_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'mjj-why-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' ), // Dependencies, defined above.
		filemtime( plugin_dir_path( __FILE__ ) . '../dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true
	);

	// Styles.
	wp_register_style(
		'mjj-why-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		filemtime( plugin_dir_path( __FILE__ ) . '../dist/blocks.editor.build.css' ) // Version: filemtime — Gets file modification time.
	);

} // End function mjj_why_editor_assets().

// Hook: Editor assets.
add_action( 'init', 'mjj_why_editor_assets' );

/**
 * This keeps the blocks whose names start with "mjj-why" ie the blocks in this plugin from being rendered with render_block().
 * The reason to keep them in their block form is for use on a React based front end.
 *
 * @param bool  $prerender If it's a falsey value, the render_block function will proceed. Anything truthy will shortcircuit it.
 * @param array $block The block being run through render_block().
 * @return false|string
 */
function mjj_why_keep_unrendered_block( $prerender, $block ) {

	// Get the blockname and check if it's from this plugin.
	$blockname = $block['blockName'];
	if ( substr( $blockname, 0, 7 ) !== 'mjj-why' ) {
		return $prerender; // If it's not a plugin block, continue on with render_block().
	}

	// Copying from render_block().
	$content = '';
	$index         = 0;
	foreach ( $block['innerContent'] as $chunk ) {
		// If the innerContent is a string, set that to the content otherwise run through render_block() to render the inner blocks.
		$content .= ( is_string( $chunk ) ) ? $chunk : render_block( $block['innerBlocks'][ $index++ ] );
	}

	$block['innerContent'] = $content;
	// Serialize the block back into the string whence it began.
	return serialize_block( $block );
}

/**
 * I only want to keep these blocks in their original form on the graphql endpoint.
 * This is from (ish): https://www.wpgraphql.com/2019/01/30/preventing-unauthenticated-requests-to-your-wpgraphql-api/.
 * @param string $query Maybe it's a string. The query.
 * @return void
 */
function mjj_why_is_graphql_request( $query ){
	// If it's not a graphql request then bail.
	if ( ! defined( 'GRAPHQL_HTTP_REQUEST' ) || true !== GRAPHQL_HTTP_REQUEST ) {
		return;
	}

	$introspection_query = \GraphQL\Type\Introspection::getIntrospectionQuery();
	$is_introspection_query = trim($query) === trim( $introspection_query );

	// If it's an introspection query, bails.
	if ( $is_introspection_query ) {
		return;
	}

	// Ok, now add the prerender filter.
	add_filter( 'pre_render_block', 'mjj_why_keep_unrendered_block', 10, 2 );
}
add_action( 'do_graphql_request', 'mjj_why_is_graphql_request', 10, 1 );
