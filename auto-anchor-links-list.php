<?php
/**
 * Plugin Name:       Auto Anchor Links List
 * Description:       A block that automatically creates a list of anchor links to headings in a post.
 * Requires at least: 6.0
 * Requires PHP:      7.0
 * Version:           1.0
 * Author:            Jethin
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       auto-anchor-links-list
 */

if ( !defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function aall_editor_script() {
    wp_enqueue_script(
        'aall-script',
        plugins_url( 'script.min.js', __FILE__ ),
        array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ),
        filemtime( plugin_dir_path( __FILE__ ) . '/script.min.js' )
    );
}
add_action( 'enqueue_block_editor_assets', 'aall_editor_script' );
