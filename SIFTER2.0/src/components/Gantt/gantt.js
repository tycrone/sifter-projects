import React from 'react';
import Timeline, {TimelineMarkers, TodayMarker} from 'react-calendar-timeline'
// make sure you include the timeline stylesheet or the timeline will not be styled
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'

import loadingGif from '../../img/loading.gif';


function itemRenderer({ item, timelineContext, itemContext, getItemProps, getResizeProps }) {
	return (
		<div
			{...getItemProps({
				style: {
					background: item.bgColor,
					color: item.color,
					border: item.border,
					borderTopWidth: itemContext.selected ? 2 : 1,
					borderBottomWidth: itemContext.selected ? 2 : 1,
					borderRightWidth: itemContext.selected ? 2 : 1,
					borderLeftWidth: itemContext.selected ? 2 : 1,
				},
				onMouseDown: () => {
					let docBod = document.body;
					docBod.classList.add("details-show");

					let tagList = item.allData.tags.map(function(element, index, array){
					    return '<span class="tag-name">' + element.name + '</span>'
					})

					let curProj = (
						'<h2>' + item.allData.company_name + '</h2>' +
						'<span class="proj-name">' + item.allData.name + '</span>' +
						'<br/>' +
						'<br/>' +
						'<span>Project Type: </span>' + item.allData.product_type +
						'<br/>' +
						'<span>Project Duration: </span>' + item.allData.project_duration +
						'<br/>' +
						'<span>Project Phase: </span><span class="project-phase ' + item.allData.project_phase.replace(/\s+/g, '-').replace( /[()\\\/]/g, "" ).toLowerCase() + '">' + item.allData.project_phase + '</span>' +
						'<br/>' +
						'<span>Dev Date: </span>' + item.allData.dev_date +
						'<br/>' +
						'<span>Beta Date: </span>' + item.allData.beta_date +
						'<br/>' +
						'<span>Launch Date: </span>' + item.allData.due_on +
						'<br/>' +
						'<span>Tags: </span>' + tagList +
						'<br/>' +
						'<br/>' +
						'<span>Project Links:</span>' +
						'<br/>' +
						'<a target="_blank" href="'+ item.allData.permalink_url + '">ASANA</a>' +
						'<br/>' +
						'<a target="_blank" href="'+ item.allData.project_sheet + '">PROJECT SHEET</a>' +
						'<br/>' +
						'<a target="_blank" href="'+ item.allData.bugherd_link + '">BUGHERD</a>'

					)

					if (item.allData.completed){
						docBod.classList.add("completed");
					}
					let infoBox = document.querySelector('.proj-description_details');
					infoBox.innerHTML = curProj;

					document.getElementById("closeDetails").addEventListener("click", function(){
						docBod.classList.remove("details-show");
					});
				}
			})}
		>
			<div
				style={{
					overflow: "hidden",
					textAlign: "center",
					paddingLeft: 3,
					fontWeight: "bold",
					fontSize: "16px",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap"
				}}
			>
				{itemContext.title}
			</div>
		</div>
	);
};

function Gantt(props) {
	if (props.asanaData) {
		return (
			<div className="gantt-chart_subtasks">
				<h2>Development</h2>
				<Timeline
					groups={props.asanaData.groups}
					items={props.asanaData.itemsDev}
					defaultTimeStart={moment().add(-21, 'day')}
					defaultTimeEnd={moment().add(21, 'day')}
					// rightSidebarWidth={150}
					itemRenderer={itemRenderer}
				>
					<TimelineMarkers>
						<TodayMarker/>		
					</TimelineMarkers>
				</Timeline>
				<h2>BETA</h2>
				<Timeline
					groups={props.asanaData.groups}
					items={props.asanaData.itemsBeta}
					defaultTimeStart={moment().add(-21, 'day')}
					defaultTimeEnd={moment().add(21, 'day')}
					// rightSidebarWidth={150}
					itemRenderer={itemRenderer}
				>
				<TimelineMarkers>
						<TodayMarker/>		
					</TimelineMarkers>
				</Timeline>
			</div>
		);
	} else {
		return (
			<div className="gantt-chart_subtasks">
				<img src={loadingGif} className="loading-gif" alt="Loading GIF" />
				<p className="text--centered">LOADING...</p>
			</div>
		);
	}
}

export default Gantt;