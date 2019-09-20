/**
 * BLOCK: mjj-why-code-highlighting
 *
 * The render bit is taken from https://github.com/pantheon-systems/code-highlighting-gutenberg-block by Daniel Bachhuber
 */

//  Import CSS.
import "./style.scss";
import "./editor.scss";

const Prism = require("prismjs");
require("prismjs/components/prism-apacheconf.js");
require("prismjs/components/prism-bash.js");
require("prismjs/components/prism-clike.js");
require("prismjs/components/prism-css.js");
require("prismjs/components/prism-git.js");
require("prismjs/components/prism-ini.js");
require("prismjs/components/prism-javascript.js");
require("prismjs/components/prism-json.js");
require("prismjs/components/prism-jsx.js");
require("prismjs/components/prism-makefile.js");
require("prismjs/components/prism-markup.js");
require("prismjs/components/prism-nginx.js");
require("prismjs/components/prism-php.js");
require("prismjs/components/prism-python.js");
require("prismjs/components/prism-sass.js");
require("prismjs/components/prism-scss.js");
require("prismjs/components/prism-sql.js");

require("prismjs/components/prism-markup-templating");

const autosize = require("autosize");

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { InspectorControls } = wp.editor;
const { TextareaControl, SelectControl } = wp.components;

const { Component } = wp.element;

// this approach is from https://www.ibenic.com/create-gutenberg-block-displaying-post/
class MJJCodeHighlightingEdit extends Component {
	static getInitialState(code, language, highlighting) {
		language = language || "css";
		code = code || "";
		highlighting = highlighting || "";

		return {
			code: code,
			language: language,
			highlighting: highlighting
		};
	}

	constructor() {
		super(...arguments);
		console.log(this.props);
		this.state = this.constructor.getInitialState(
			this.props.attributes.code,
			this.props.attributes.language,
			this.props.attributes.highlighting
		); // set the initial state of code

		this.onChangeValue = this.onChangeValue.bind(this);
		this.createHighlighting = this.createHighlighting.bind(this);
		this.autosizeTextarea = this.autosizeTextarea.bind(this);

		this.id = "code-" + this.props.id;
		this.blockId = "block-" + this.props.id;

		// as defined in http://prismjs.com/#languages-list
		this.languages = {
			css: "css",
			javascript: "javascript",
			markup: "html",
			php: "php",
			json: "JSON",
			jsx: "jsx"
		};

		this.languageKeys = Object.keys(this.languages);
		// loadLanguages(this.languageKeys);

		this.createHighlighting();
	}

	// handles setting the state for any change
	onChangeValue(attr, newValue) {
		let newObj = {};
		newObj[attr] = newValue || "";

		// so these are callbacks because it wasn't updating quite right on past
		this.setState(newObj, () => {
			this.props.setAttributes(newObj);
			if (attr == "code") autosize.update(this.textArea);
		});
	}

	createHighlighting() {
		let element = document.getElementById(this.id);
		let language = this.state.language;
		let html = Prism.highlight(
			this.state.code,
			Prism.languages[language],
			language
		);
		this.props.setAttributes({
			highlighting: html
		});
		return { __html: html };
	}

	autosizeTextarea() {
		this.textArea = document.querySelector(
			"[data-block='" + this.props.clientId + " textarea']"
		);
		autosize(this.textArea);
	}

	componentDidUpdate() {
		//this.autosizeTextarea();
	}

	render() {
		let code = this.state.code;

		let language = this.state.language || "css";
		let languageClassName = "language-" + language;
		let headerClassName = "language-header " + language;
		let languageHeading = language.toUpperCase();

		return (
			<div>
				<div className={headerClassName}>{languageHeading}</div>
				<pre className={languageClassName}>
					<code
						id={this.id}
						className={languageClassName}
						dangerouslySetInnerHTML={this.createHighlighting()}
					></code>
				</pre>
				{this.props.isSelected && (
					<div>
						<InspectorControls key="mjj-why-code-highlighting-inspector">
							<SelectControl
								label={__("Language")}
								value={this.state.language}
								options={this.languageKeys.map(key => ({
									value: key,
									label: this.languages[key]
								}))}
								onChange={this.onChangeValue.bind(this, "language")}
							/>
						</InspectorControls>
						<TextareaControl
							label={__("Code snippet goes here:")}
							onChange={this.onChangeValue.bind(this, "code")}
							value={this.state.code}
							onFocus={this.autosizeTextarea}
						/>
					</div>
				)}
			</div>
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
registerBlockType("mjj-why/code-highlighting", {
	title: __("mjj-why - code highlighting"), // Block title.
	icon: "dashicons-admin-post", // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: "common", // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.

	attributes: {
		code: {
			type: "string"
		},
		language: {
			type: "string"
		},
		highlighting: {
			type: "string"
		}
	},

	edit: MJJCodeHighlightingEdit,

	// what shall we save to the database?
	save() {
		return null;
	}
});
