import React, { Component } from 'react';

class Sidebar1 extends Component {

	render(props) {
		return (
			<div className={this.props.squadClass[0].squad}>
		        <div className="wrapper">
					{this.props.squadData.map((squad, i) => (
						<button
							className={this.props.activeSquadIndex === i ? "active" : ""}
							key={i}
							onClick={() => {
								this.props.setSquadL1(i, null)
								this.props.handleClickL1('squadsBtn', i, squad.squadClass);
						}}>
							<span>{squad.name}</span>
						</button>
					))}
				</div>
			</div>
		)
	};
};

export default Sidebar1;