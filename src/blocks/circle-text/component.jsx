
// This contains the "MJJWhyCircleText" component

/**
 * External dependencies
 */

const { __ } = wp.i18n;

// ha HA here's how you pick these up. I think that you can use anything you see in @wordpress/whatever by using wp.whatever
const {
	Component,
	createElement,
} = wp.element;

class MJJCircleText extends Component {

	constructor( props ) {
		super( props );
	}

	render () {

		let attributes = this.props.attributes

		return (
			// templatestart
			<div>
				<div class="circle">
  					<a href={ attributes.circleLink1 }><span>{ attributes.circleText1 }</span></a>
				</div>
				<div class="circle">
  					<a href={ attributes.circleLink2 }><span>{ attributes.circleText2 }</span></a>
				</div>
				<div class="circle">
  					<a href={ attributes.circleLink3 }><span>{ attributes.circleText3 }</span></a>
				</div>
			</div>
			// templateend
		);
	}
}

export default MJJCircleText;