import React, { Component } from 'react';
import Chart from "react-google-charts";
import loadingGif from '../../img/loading.gif';

class Gantt extends Component {
	render(props) {
		if(this.props.asanaData){
			let chartHeight = ((this.props.asanaData.length) * 30 + 50) + 'px' 
			return (
				<div className="gantt-chart_subtasks main-content col-lg-12 col-md-12 col-sm-12">
					<Chart
						width={'100%'}
						height= {chartHeight}
						chartType='Gantt'
						loader={<div>Loading Q4 Milestones</div>}
						data={this.props.asanaData}
						options={{
							gantt: {
								trackHeight: '30',
								labelStyle: {
									fontName: 'Raleway',
									fontSize: 16,
									color: '#757575'
								},
								sortTasks: false,
								innerGridHorizLine:{
									strokeWidth: 0,
								}
							},
						}}
						hAxis = {{title: 'Date'}}
						rootProps={{ 'data-testid': '2' }}
					/>
				</div>
			);
		}else{
			return (
				<div className="main-content col-lg-12 col-md-12 col-sm-12">
					<img src={loadingGif} className="loading-gif" alt="Loading GIF" />
					<p className="text--centered">LOADING...</p>
				</div>
			);
		}
	};
}

export default Gantt;