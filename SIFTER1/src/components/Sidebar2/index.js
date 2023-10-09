import React, { Component } from 'react';

class Sidebar2 extends Component {

	render(props) {
		return (
			<div className="sidebar-inner">
				<h3 className="sidebar-title">Milestone</h3>
				{this.props.milestoneData.map((milestone, i) => (
					<button
						className={this.props.activeMilestoneIndex === i ? "active" : ""}
						key={i}
						onClick={() => {
							this.props.setMilestoneL1(null, i)
							this.props.handleClickL1('milestoneBtn', i);
					}}>
						<span>{milestone.name}</span>
					</button>
				))}
			</div>
		)
	};
};

export default Sidebar2;