import React, { Component } from 'react';

class Sidebar1 extends Component {

	render(props) {
		return (
			<div className="sidebar-inner">
				<h3 className="sidebar-title">Squads</h3>
				{this.props.squadData.map((squad, i) => (
					<button
						className={this.props.activeSquadIndex === i ? "active" : ""}
						key={i}
						onClick={() => {
							this.props.setSquadL1(i, null)
							this.props.handleClickL1('squadsBtn', i);
					}}>
						<span>{squad.name}</span>
					</button>
				))}
			</div>
		)
	};
};

export default Sidebar1;