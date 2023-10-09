import React from 'react';
import Timeline, {TimelineMarkers, TodayMarker} from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'

import ItemRenderer from './itemRenderer'
import loadingGif from '../../img/loading.gif';

function Gantt(props) {
	window.addEventListener('scroll', function() {

		document.querySelectorAll('.react-calendar-timeline ').forEach(function(itm) {
			var distanceTop = itm.getBoundingClientRect().top;
			var distanceBottom = itm.getBoundingClientRect().top + itm.offsetHeight;

			if (distanceTop < 0 || distanceBottom < 0){
				itm.querySelector('.rct-header-root').classList.add('sticky-top');
			} else{
				itm.querySelector('.rct-header-root').classList.remove('stickyTop');
			}
		});
	});

	if (props.asanaData) {
		return(
			<div className={"gantt-chart_subtasks " + props.asanaData.squadClass}>
				<h2>{props.asanaData.squadName}</h2>
				<span className="gantt-chart_leads">{props.asanaData.squadLeads}</span>
				<Timeline
					key={props.asanaData.tagId + "1"}
					groups={props.asanaData.groups}
					items={props.asanaData.itemsDev}
					defaultTimeStart={moment().add(-21, 'day')}
					defaultTimeEnd={moment().add(21, 'day')}
					// rightSidebarWidth={150}
					itemRenderer={ItemRenderer}
				>
					<TimelineMarkers>
						<TodayMarker/>		
					</TimelineMarkers>
				</Timeline>
			</div>
		)
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