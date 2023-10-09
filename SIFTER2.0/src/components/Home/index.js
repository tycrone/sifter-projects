import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization, withEmailVerification } from '../Session';

import Sidebar1 from '../Sidebar1';
import { getAsanaData } from '../Asana';
import Gantt from '../Gantt';


class HomePage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			squadData: [
				{ name: 'Diamond Hands', tagId: '1200577629165572', squadClass: 'squad-dh'},
				{ name: 'Surprise Motorscooter', tagId: '1200588246901564', squadClass: 'squad-sm'},
				{ name: 'Apollo', tagId: '1200588184095688', squadClass: 'squad-ap'},
				{ name: 'Worcestershire Sauce', tagId: '1200588116709321', squadClass: 'squad-ws'}
			],
			currentlySelected: [{
				squad: {}
			}],
			activeSquadClass: [{
				squad: null
			}],
			activeLinks: [{
				squad: null
			}],
			asanaData: null,
		}

		this.setDataByIndex = this.setDataByIndex.bind(this)
	}

	componentDidMount() {
		this.setDataByIndex(0, 0);
		this.handleSquadClick('squadsBtn', 0, this.state.squadData[0].squadClass);
		this.getData();
	}

	componentDidUpdate() {
	}

	getData = async () => {
		let curSquad = this.state.currentlySelected[0].squad.tagId;

		getAsanaData(curSquad)
			.then(response => {
				this.setState({
					asanaData: response
				});
			})
	}

	setDataByIndex = (squadIndex) => {
		let flatSelectedSquad = this.state.currentlySelected[0];

		if (squadIndex !== null) {
			flatSelectedSquad.squad = this.state.squadData[squadIndex];
		}

		this.setState({
			flatSelectedSquad
		})

		this.getData()
	}

	handleSquadClick = (btnType, index, squadClass) =>{
		let flatActiveLinks = this.state.activeLinks[0];
		let flatActiveSquad = this.state.activeSquadClass[0];

		if (btnType === 'squadsBtn'){
			flatActiveLinks.squad = index;
			flatActiveSquad.squad = squadClass;
		} 
		this.setState({ 
			flatActiveLinks,
			flatActiveSquad,
			asanaData: null,
		});
	}
	
	render() {
		return (
			<Router>
				<div className="sidebar">
					<Sidebar1
						squadData={this.state.squadData}
						activeSquadIndex={this.state.activeLinks[0].squad}
						squadClass={this.state.activeSquadClass}
						handleClickL1={this.handleSquadClick}
						setSquadL1={this.setDataByIndex}
					/>
				</div>
				<div className="main-content">
					<div className="main-content_left wrapper">
						<ul id="errorList" className="error-list hidden"></ul>
						<div className="gantt-chart">
							<Switch>
								<Route path="/" component={() => <Gantt asanaData={this.state.asanaData} />} />
							</Switch>
						</div>
					</div>
					<div className="main-content_right proj-description">
						<div id="closeDetails" className="proj-description_close"></div>
						<div className="proj-description_details">
						</div>
					</div>
				</div>
			</Router>

		);
	};
}

//is authenticated?
const condition = authUser => !!authUser;

//below is export with a single hoc but I replaced with multiple hoc using recompose

// export default withAuthorization(condition)(HomePage);

export default compose(
	withEmailVerification,
	withFirebase,
	withAuthorization(condition),
)(HomePage);