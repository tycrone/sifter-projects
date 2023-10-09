import React, { Component } from 'react';
import { compose } from 'recompose';
import Gantt from '../Gantt';

import { withFirebase } from '../Firebase';
import { withAuthorization, withEmailVerification } from '../Session';

import { SQUADS } from './../../constants/squads';
import { getJiraData } from '../../adapters/jira';

class HomePage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			squadData: SQUADS,
			asanaData: [],
		}

		this.getData = this.getData.bind(this)
	}

	componentDidMount() {
		this.getData();
	}

	getData = async () => {
		let proj = this;
		let squadData = this.state.squadData;
		let asanaData = this.state.asanaData;
		let totalSquads = squadData.length;
		let curCount = 0;

		squadData.forEach(function (squad, ind, arr) {
			getJiraData(squad.tagId)
				.then(response => {
					response.squadName = squad.name;
					response.squadLeads = squad.leads;
					response.tagId = squad.tagId;
					response.squadClass = squad.squadClass;
					asanaData.push(response)
					curCount += 1;
					if (curCount === totalSquads) {
						proj.setState({
							asanaData: asanaData,
						});
						console.log(asanaData)
					}
				})
		})
	}

	render() {
		return (
			<div className="main-content">
				<div className="main-content_left wrapper">
					<ul id="errorList" className="error-list hidden"></ul>
					<div className="gantt-chart">
						{this.state.asanaData.length ?
							this.state.asanaData.map(squad => (
								<Gantt key={squad.tagId} asanaData={squad} />
							)) 
							: <div className="loading-container"></div>
						}
					</div>
				</div>
				<div className="main-content_right proj-description">
					<div id="closeDetails" className="proj-description_close"></div>
					<div className="proj-description_details">
					</div>
				</div>
			</div>

		);
	};
}

//is authenticated?
const condition = authUser => !!authUser;

//FYI: below is export with a single hoc but I replaced with multiple hoc using recompose
// export default withAuthorization(condition)(HomePage);

export default compose(
	withEmailVerification,
	withFirebase,
	withAuthorization(condition),
)(HomePage);