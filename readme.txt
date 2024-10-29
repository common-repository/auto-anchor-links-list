=== Auto Anchor Links List ===
Contributors:      jethin
Tags:              anchors, anchor links, table of contents, jump links, block
Tested up to:      6.6.2
Stable tag:        1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A block that automatically creates a list of anchor links to headings in a post.

== Usage ==

Insert the "Auto Anchors Links List" block where you'd like it to appear. A post can only contain one "Auto Anchor Links List" block. Preview the post to view the list display and test links.

Heading levels h2-h6 are supported. Heading levels (h2 -> h3 -> h4) must be ordered properly; sub-heading levels are indented in the list.

The "Auto Anchors Links List" block is automatically updated when headings in the post are modified. Any manual edits to the list will be overwritten. To maintain the list manually, remove the "auto-anchor-links-list" class from the block to transform it into a WordPress core list block.

= Additional Controls =

Apply the "Manual Anchor" block style to a heading and then set its anchor text attribute to:

* [empty] A plain heading tag (omitted from auto anchors list)
* ["custom-anchor"] A persistent custom anchor; useful for permalinks (included in auto anchors list)

Add a "no-auto-anchor" class to any heading block to omit it from auto anchors list.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/auto-anchor-links-list` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress

== Screenshots ==

1. A sample Auto Anchor List display in custom Twenty-Twenty Three theme.
2. An Auto Anchor List in the list view of the WordPress block editor. The heading block above the list has the "No Anchor" block style applied, so it does not appear in the auto-generated list.

== Changelog ==

= 1.0 =
* Release
