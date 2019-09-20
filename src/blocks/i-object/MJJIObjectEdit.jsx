const { __ } = wp.i18n; // Import __() from wp.i18n
const { TextControl, RadioControl } = wp.components;

const { Component } = wp.element;

// I am using axios as the http client because I like it
const axios = require("axios");

import MJJIObjectEditView from "./MJJIObjectEditView.jsx";

/**
 * MJJIObjectEdit handles the working bits of the component; ie when the component has focus.
 * It is responsible for setting the state based on the data saved as postmeta, although it loads from
 * the registered attributes in registerBlockType initially, while it is waiting for the new data to load.
 */
class MJJIObjectEdit extends Component {
	static getInitialState(objection, severity) {
		objection = objection || ""; // default is no objection
		severity = severity || 1; // and it's not severe

		return {
			objection: objection,
			severity: severity
		};
	}

	constructor() {
		super(...arguments);

		// the initial state will be set from whatever is in the attributes
		// this state should last only as long as it takes for the postmeta request in componentDidMount () to run
		// again, I am not in love with this
		this.state = this.constructor.getInitialState(
			this.props.attributes.objection,
			this.props.attributes.severity
		);

		this.onChangeValue = this.onChangeValue.bind(this);
	}

	/**
	 * Handles when an input changes
	 * @param  {string} 		attr     The attribute which has a changed input
	 * @param  {string|integer} newValue The entered value
	 * @return {null}              Nothing returned
	 */
	onChangeValue(attr, newValue) {
		let newObj = {};
		newObj[attr] = newValue;

		// set the state when something changes
		this.setState(newObj, () => {
			// update the attributes because I'm using them
			this.props.setAttributes(newObj);
		});
	}

	/**
	 * Updates the attributes
	 * @param  {object} attributes An object with keys 'objection' and 'severity'
	 * @return {null}              Nothing returned
	 */
	updateAttributes(attributes) {
		this.props.setAttributes({
			objection: attributes.objection,
			severity: attributes.severity
		});
	}

	/**
	 * This handles loading the postmeta data from the post endpoint.
	 * @return {null} Nothing returned
	 */
	componentDidMount() {
		// I want the link to the post in the REST API
		// it's right there! Is there a better place to get this?
		let url = _wpGutenbergPost._links.self[0].href;

		let self = this;

		// headers for the request :)
		let headers = {
			"X-WP-Nonce": wpApiSettings.nonce
		};

		// get the data needed from the database and then setState
		axios({
			method: "get",
			url: url,
			headers: headers
		})
			.then(function(response) {
				let objectionData = response.data.mjj_objections;

				if (objectionData) {
					self.setState(
						{
							objection: objectionData.objection,
							severity: objectionData.severity
						},
						() => {
							// postmeta is canonical source of truth
							self.updateAttributes(self.state);
						}
					);
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	render() {
		let isSelected = this.props.isSelected;
		let attributes = {
			objection: this.state.objection,
			severity: this.state.severity
		};

		return (
			<div className={this.props.className}>
				{!!isSelected ? (
					<div>
						<TextControl
							label={__("Objection")}
							value={this.state.objection}
							onChange={this.onChangeValue.bind(this, "objection")}
						/>

						<RadioControl
							label="Severity"
							help="1 is not so severe, 5 is just horrible"
							selected={this.state.severity.toString()}
							options={[
								{ label: "1", value: "1" },
								{ label: "2", value: "2" },
								{ label: "3", value: "3" },
								{ label: "4", value: "4" },
								{ label: "5", value: "5" }
							]}
							onChange={this.onChangeValue.bind(this, "severity")}
						/>
					</div>
				) : (
					<MJJIObjectEditView
						attributes={attributes}
						className={this.props.className}
					/>
				)}
			</div>
		);
	}
}

export default MJJIObjectEdit;
