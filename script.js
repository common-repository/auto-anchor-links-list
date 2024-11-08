wp.blocks.registerBlockVariation(
    'core/list',
    {
        name: 'auto-anchor-links-list',
        title: 'Auto Anchor Links List',
        icon: "list-view",
        category: "widgets",
        keywords: [ "list", "links", "anchors" ],
        description: "Displays a list of anchor links to heading blocks in post.",
        attributes: {
            className: "auto-anchor-links-list"
        },
        textdomain: "auto-anchor-links-list",
        isActive: ( blockAttributes ) => {
            return (
                blockAttributes.className === "auto-anchor-links-list"
            );
        }
    }
);

wp.blocks.registerBlockStyle( 'core/heading', {
    name: 'manual-anchor',
    label: 'Manual Anchor',
} );

wp.domReady(() => {

	// Debounce function to limit the rate of function execution
	const debounce = (func, wait) => {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	};

	// Utility function to compare two arrays for equality
	const arraysEqual = (a, b) => a.length === b.length && a.every((val, i) => val === b[i]);

	let previousBlocks = [];
	let previousHeadingsContent = [];
	let previousHeadingsLevels = [];

	// Subscribe to block changes in the WordPress editor with debounced callback
	wp.data.subscribe(debounce(() => {
		const blocks = wp.data.select('core/block-editor').getBlocks();

		// Filter heading blocks
		const headingBlocks = blocks.filter(block =>
			block.name === 'core/heading' &&
			!/(no-auto-anchor)/.test(block.attributes.className || '') &&
			(!(block.attributes.className || '').includes('manual-anchor') || block.attributes.anchor?.trim())
		);

		// Get the current content and levels of the heading blocks
		const currentHeadingsContent = headingBlocks.map(block => block.attributes.content || '');
		const currentHeadingsLevels = headingBlocks.map(block => block.attributes.level || 2);

		// Detect changes in block count, heading content, or heading levels
		if (blocks.length !== previousBlocks.length ||
			!arraysEqual(currentHeadingsContent, previousHeadingsContent) ||
			!arraysEqual(currentHeadingsLevels, previousHeadingsLevels)) {

			previousBlocks = blocks;
			previousHeadingsContent = currentHeadingsContent;
			previousHeadingsLevels = currentHeadingsLevels;
			updateAnchorList(headingBlocks);
		}
	}, 300));

});

// Update the anchor list in the "auto-anchors/list" container block
const updateAnchorList = (headingBlocks) => {
	const anchorListBlock = wp.data.select('core/block-editor').getBlocks().find(block => block.attributes.className === 'auto-anchor-links-list');

	if (anchorListBlock) {
		if (!headingBlocks.length) {
			const placeholder = wp.blocks.createBlock('core/paragraph', {
				placeholder: '• No heading blocks found in post.'
			});
			wp.data.dispatch('core/block-editor').replaceInnerBlocks(anchorListBlock.clientId, [placeholder]);
		} else {
			const anchorsList = generateListBlocksWithLevels(headingBlocks);
			wp.data.dispatch('core/block-editor').replaceInnerBlocks(anchorListBlock.clientId, anchorsList.innerBlocks);
		}
	}
};

// Generate the list blocks with handling for nested levels
const generateListBlocksWithLevels = (headingBlocks) => {
	const parentList = wp.blocks.createBlock('core/list');
	let currentList = parentList.innerBlocks;
	const nestedLists = [currentList];
	let previousLevel = headingBlocks[0]?.attributes.level || 2;

	headingBlocks.forEach(block => {
		const headingText = block.attributes.content?.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1') || '';
		const currentLevel = block.attributes.level || 2;
		const slug = block.attributes.className?.includes('manual-anchor') ? block.attributes.anchor : generateSlug(headingText);

		wp.data.dispatch('core/block-editor').updateBlockAttributes(block.clientId, { anchor: slug });

		const listItemBlock = wp.blocks.createBlock('core/list-item', {
			content: `<a href="#${slug}">${headingText}</a>`
		});

		currentList = adjustListLevel(currentLevel, previousLevel, currentList, nestedLists, listItemBlock);
		previousLevel = currentLevel;
	});

	return parentList;
};

// Adjust the list level for nested headings
const adjustListLevel = (currentLevel, previousLevel, currentList, nestedLists, listItemBlock) => {
	while (currentLevel > previousLevel) {
		const lastItem = currentList[currentList.length - 1];
		if (lastItem) {
			const newNestedList = wp.blocks.createBlock('core/list');
			lastItem.innerBlocks.push(newNestedList);
			nestedLists.push(newNestedList.innerBlocks);
			currentList = newNestedList.innerBlocks;
		}
		previousLevel++;
	}

	while (currentLevel < previousLevel && nestedLists.length > 1) {
		nestedLists.pop();
		currentList = nestedLists[nestedLists.length - 1];
		previousLevel--;
	}

	currentList.push(listItemBlock);
	return currentList;
};

// Create a single DOMParser instance to reuse across function calls
const parser = new DOMParser();

// Cache object to store previously generated slugs
const slugCache = {};

/**
 * Generates a URL-friendly slug from the provided text.
 * @param {string} text - The input text to convert into a slug.
 * @returns {string} - The generated slug.
 */
const generateSlug = (text) => {
	if (typeof text !== 'string') {
		console.warn('generateSlug: Expected a string input.');
		return 'invalid-slug';
	}

	if (slugCache[text]) {
		return slugCache[text];
	}

	const doc = parser.parseFromString(text, 'text/html');
	const plainText = doc.body.textContent || '';

	let slug = plainText.trim().toLowerCase()
		.replace(/[^\w\s-]+/g, "")
		.replace(/\s+/g, "-")
		.replace(/^-+|-+$/g, "");

	if (/^\d/.test(slug)) {
		slug = `anchor-${slug}`;
	}

	slugCache[text] = slug;
	return slug;
};
