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
		array( 'wp-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function mjj_why_block_assets().

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'mjj_why_block_assets' );

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
