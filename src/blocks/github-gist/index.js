/**
 * BLOCK: mjj-why-github-gist
 *
 * The render bit is taken from https://github.com/pantheon-systems/github-gist-gutenberg-block by Daniel Bachhuber
 */

//  Import CSS.
import "./style.scss";
import "./editor.scss";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const { TextControl } = wp.components;

const { Component } = wp.element;

import MJJGithubGist from "./MJJGithubGist.jsx";

// this approach is from https://www.ibenic.com/create-gutenberg-block-displaying-post/
class MJJGithubGistEdit extends Component {
	static getInitialState(uncheckedUrl, gistUrl) {
		gistUrl = gistUrl || "";
		uncheckedUrl = uncheckedUrl || "";

		return {
			uncheckedUrl: uncheckedUrl,
			gistUrl: gistUrl
		};
	}

	constructor() {
		super(...arguments);
		this.state = this.constructor.getInitialState(
			this.props.attributes.uncheckedUrl,
			this.props.attributes.gistUrl
		); // set the initial state of uncheckedUrl

		this.getGistUrl = this.getGistUrl.bind(this); // allow me to use "this" in the function

		this.onChangeUrl = this.onChangeUrl.bind(this);
		this.getGistUrl(this.props.attributes.uncheckedUrl);
	}

	getGistUrl() {
		let newGistUrl = this.state.uncheckedUrl.includes("gist.github.com")
			? this.state.uncheckedUrl
			: ""; // there could be more robust checks here
		// again, setState callbacks because it wasn't updating quite right on paste
		this.setState({ gistUrl: newGistUrl }, () => {
			this.props.setAttributes({
				gistUrl: newGistUrl
			});
		});
	}

	onChangeUrl(newUrl) {
		// so these are callbacks because it wasn't updating quite right on past
		this.setState({ uncheckedUrl: newUrl }, () => {
			this.props.setAttributes({
				uncheckedUrl: newUrl
			});
			this.getGistUrl();
		});
	}

	render() {
		return !!this.props.isSelected || this.state.gistUrl.length == 0 ? (
			<div>
				<TextControl
					label={__("Github gist url")}
					value={this.props.attributes.uncheckedUrl}
					onChange={this.onChangeUrl}
				/>
				<MJJGithubGist url={this.state.gistUrl} id={this.props.id} />
			</div>
		) : (
			<MJJGithubGist url={this.state.gistUrl} id={this.props.id} />
		);
	}
}

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType("mjj-why/github-gist", {
	title: __("mjj-why - github gist"), // Block title.
	icon: "dashicons-admin-post", // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: "common", // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.

	attributes: {
		gistUrl: {
			type: "string"
		},
		uncheckedUrl: {
			type: "string"
		}
	},

	edit: MJJGithubGistEdit,

	// what shall we save to the database?
	save() {
		return null;
	}
});
