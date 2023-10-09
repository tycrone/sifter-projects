import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization, withEmailVerification } from '../Session';

import Sidebar1 from '../Sidebar1';
import Sidebar2 from '../Sidebar2';
import { getAsanaData } from '../Asana';
import Gantt from '../Gantt';


class HomePage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			squadData: [
				{ name: 'Diamond Hands', tagId: '1200577629165572' },
				{ name: 'Surprise Motorscooter', tagId: '1200588246901564' },
				{ name: 'Apollo', tagId: '1200588184095688' },
				{ name: 'Worcestershire Sauce', tagId: '1200588116709321' }
			],
			milestones: [
				{ name: 'Implementation', code: 'imp' },
				{ name: 'Smoke Testing', code: 'st' },
				{ name: 'Beta', code: 'beta' },
				{ name: 'Pre-Production', code: 'pp' },
			],
			currentlySelected: [{
				squad: {},
				milestone: {}
			}],
			activeLinks: [{
				squad: null,
				milestone: null
			}],
			asanaData: null,
		}

		this.setDataByIndex = this.setDataByIndex.bind(this)
	}

	componentDidMount() {
		this.setDataByIndex(0, 0);
		this.handleClick('squadsBtn', 0);
		this.handleClick('milestoneBtn', 0);
		this.getData();
	}

	componentDidUpdate() {
	}

	getData = async () => {
		let curSquad = this.state.currentlySelected[0].squad.tagId;
		let curMilestone = this.state.currentlySelected[0].milestone.code

		getAsanaData(curSquad, curMilestone)
			.then(response => {
				this.setState({
					asanaData: response
				});
			})
	}

	setDataByIndex = (squadIndex, milestoneIndex) => {
		let flatSelectedSquad = this.state.currentlySelected[0];

		if (squadIndex !== null) {
			flatSelectedSquad.squad = this.state.squadData[squadIndex];
		}

		if (milestoneIndex !== null) {
			flatSelectedSquad.milestone = this.state.milestones[milestoneIndex];
		}

		this.setState({
			flatSelectedSquad
		})

		this.getData()
	}

	handleClick = (btnType, index) =>{
		let flatActiveLinks = this.state.activeLinks[0];
		if (btnType === 'squadsBtn'){
			flatActiveLinks.squad = index;
		} else if (btnType === 'milestoneBtn'){
			flatActiveLinks.milestone = index;
		}
		this.setState({ 
			flatActiveLinks,
			asanaData: null,
		});
	}
	
	render() {
		return (
			<Router>
				<div className="sidebar inset-style col-lg-2 col-md-12 col-sm-12">
					<Sidebar1
						squadData={this.state.squadData}
						activeSquadIndex={this.state.activeLinks[0].squad}
						handleClickL1={this.handleClick}
						setSquadL1={this.setDataByIndex}
					/>
					<Sidebar2						
						milestoneData={this.state.milestones}
						activeMilestoneIndex={this.state.activeLinks[0].milestone}
						handleClickL1={this.handleClick}
						setMilestoneL1={this.setDataByIndex}
					/>
				</div>
				<div className="main-content col-lg-10 col-md-12 col-sm-12">
					<Switch>
						<Route path="/" component={() => <Gantt asanaData={this.state.asanaData} />} />
					</Switch>
				</div>
			</Router>

		);
	};
}

//is authenticated?
const condition = authUser => !!authUser;

//below is export with a single hoc, replaced with multiple hoc using recompose
// export default withAuthorization(condition)(HomePage);

export default compose(
	withEmailVerification,
	withFirebase,
	withAuthorization(condition),
)(HomePage);