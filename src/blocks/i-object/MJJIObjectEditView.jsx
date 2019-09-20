// This contains the "MJJIObject" component

/**
 * External dependencies
 */

const { __ } = wp.i18n;

// ha HA here's how you pick these up. I think that you can use anything you see in @wordpress/whatever by using wp.whatever
const { Component, createElement } = wp.element;

/**
 * Renders the component when there is no focus on the block.
 */
class MJJIObjectEdit extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		let objections = this.props.attributes;
		let color = "";

		if (objections.severity == 1) {
			color = "limegreen view";
		} else if (objections.severity == 2) {
			color = "greenyellow view";
		} else if (objections.severity == 3) {
			color = "yellow view";
		} else if (objections.severity == 4) {
			color = "orange view";
		} else {
			color = "red view";
		}

		return <div className={color}>the objection: {objections.objection}</div>;
	}
}
export default MJJIObjectEdit;
