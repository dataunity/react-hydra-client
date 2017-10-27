import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class IRIEntry extends Component {
	constructor(props) {
		super(props)
		// this.state = {value: 'http://localhost:8080/csvw/table-summaries'}
		this.state = {value: this.props.value};

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event) {
		this.setState({value: event.target.value})
	}

	handleSubmit(event) {
		event.preventDefault();
		this.props.onSubmit(this.state.value)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.state.value) {
			// Props have changed
			const newValue = nextProps.value
			this.setState({value: newValue})
		}
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					IRI:
					<input type="text" size="40" value={this.state.value} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Submit" />
			</form>
		);
	}
}

IRIEntry.propTypes = {
	value: PropTypes.string.isRequired,
	onSubmit: PropTypes.func.isRequired
}