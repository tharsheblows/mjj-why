
// This contains the "MJJWhyKeithsPolygon" component

/**
 * External dependencies
 */

const { __ } = wp.i18n;

// ha HA here's how you pick these up. I think that you can use anything you see in @wordpress/whatever by using wp.whatever
const {
	Component,
	createElement,
} = wp.element;

class MJJWhyKeithsPolygon extends Component {

	constructor( props ) {
		super( props );
	}

	render () {

		let attributes = this.props.attributes

		return (
			// templatestart
				<div className="why-oh-why">
					<div className="left-polygon"></div>
					<div className="right-polygon"></div>
					<p className="hemmed-in">{ attributes.content }</p>
				</div>
			// templateend
		);
	}
}

export default MJJWhyKeithsPolygon;