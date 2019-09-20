// This contains the "MJJWhyCircleText" component

/**
 * External dependencies
 */

const { __ } = wp.i18n;

const { Component, createElement } = wp.element;

class MJJGithubGist extends Component {
	constructor() {
		super(...arguments);
		// this is going to be used as the holder for the gist stuff in setGistData()
		this.id = "gist-" + this.props.id;
	}

	setGistData(url) {
		// I totally copied this from https://github.com/pantheon-systems/github-gist-gutenberg-block/blob/master/blocks/github-gist/index.js
		let self = this;

		// can't load the script, it's all like "nooo, can't do that with an asynchronously loaded script, soz" so here we are
		setTimeout(function() {
			jQuery.getJSON(url.trim(/\/$/) + ".json?callback=?", function(data) {
				var div = jQuery("#" + self.id);
				div.html("");
				var stylesheet = jQuery("<link />");
				stylesheet.attr("ref", "stylesheet");
				stylesheet.attr("href", data.stylesheet);
				stylesheet.attr("type", "text/css");
				div.append(stylesheet);
				div.append(data.div);
			});
		}, 10);
	}

	// And WHEN IT'S UPDATED load the gist stuff
	componentDidUpdate() {
		if (this.props.url) {
			this.setGistData(this.props.url);
		}
	}
	// When it's mounted, load the gist stuff
	componentDidMount() {
		if (this.props.url) {
			this.setGistData(this.props.url);
		}
	}

	render() {
		// I think it needs to change to trigger componentDidUpdate?
		return <div id={this.id}></div>;
	}
}

export default MJJGithubGist;
