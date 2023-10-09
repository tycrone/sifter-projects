import React from 'react';
import 'react-calendar-timeline/lib/Timeline.css'

function itemRenderer({ item, timelineContext, itemContext, getItemProps, getResizeProps }) {
	return (
		<div
			{...getItemProps({
				style: {
					background: item.bgColor,
					color: item.color,
					border: item.border,
					borderTopWidth: itemContext.selected ? 2 : 0,
					borderBottomWidth: itemContext.selected ? 2 : 0,
					borderRightWidth: itemContext.selected ? 2 : 0,
					borderLeftWidth: itemContext.selected ? 2 : 0,
				},
				onMouseDown: () => {
					let docBod = document.body;
					let flyoutDetails;

					docBod.classList.add("details-show");

					switch(item.allData.itemType){

						case 'websiteProject':
							let tagList = item.allData.tags.map(function(element){
								return '<span class="details_tag">' + element.name + '</span>'
							})
							flyoutDetails = (
								'<h2>' + item.allData.company_name + '</h2>' +
								'<span class="details_proj-name">' + item.allData.name + '</span>' +
								'<br/><br/>' +
								'<span>IM: </span>' + item.allData.assignee.name +
								'<br/>' +
								'<span>Project Type: </span>' + item.allData.project_type +
								'<br/>' +
								'<span>Product Type: </span>' + item.allData.product_type +
								'<br/>' +
								'<span>Project Phase: </span><span class="details_phase ' + item.allData.project_phase.replace(/\s+/g, '-').replace( /[()\\/]/g, "" ).toLowerCase() + '">' + item.allData.project_phase + '</span>' +
								'<br/><br/>' +
								'<span>Dev Date: </span>' + item.allData.calculatedDates.dev +
								'<br/>' +
								'<span>Beta Date: </span>' + item.allData.calculatedDates.beta +
								'<br/>' +
								'<span>Due Date: </span>' + item.allData.calculatedDates.end +
								'<br/>' +
								'<span>Tags: </span>' + tagList +
								'<br/><br/>' +
								'<span>Project Links:</span>' +
								'<br/>' +
								'<ul>'+
									'<li><a target="_blank" href="'+ item.allData.permalink_url + '">ASANA</a></li>' +
									'<li><a target="_blank" href="'+ item.allData.project_sheet + '">PROJECT SHEET</a></li>' +
									'<li><a target="_blank" href="'+ item.bhLink + '">BUGHERD</a></li>' +
								'</ul>'
							)
						break;

						default:
							flyoutDetails = (
								'<h2>' + item.allData.name + '</h2>'+
								'<br/>' +
								'<span>Employee: </span>' + item.allData.developer +
								'<br/>' +
								'<span>Start Date: </span>' + item.allData.timelineMarker1._i +
								'<br/>' +
								'<span>End Date: </span>' + item.allData.timelineMarker2._i 
							)
							break;
					}

					if (item.allData.completed){
						docBod.classList.add("completed");
					}
					let infoBox = document.querySelector('.proj-description_details');
					infoBox.innerHTML = flyoutDetails;

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
					paddingBottom: 3,
					fontWeight: "normal",
					fontSize: "14px",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap"
				}}
			>
				{itemContext.title}
			</div>
		</div>
	);
};

export default itemRenderer;