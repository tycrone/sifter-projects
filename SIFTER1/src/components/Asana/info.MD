//OTHER API
// var asana = require('asana-api');
// var client = asana.createClient({
//   token: '1/1198707639905465:0f795d0ec027d64f2d008dc7ffd4b41b'
// });
// console.log(client)
// client.projects.list(function (err, projects) {
//   console.log(projects);
// });

const asana = require('asana');
const client = asana.Client.create().useAccessToken('1/1198707639905465:0f795d0ec027d64f2d008dc7ffd4b41b');

//WORKSPACE: GET Q4 WORKSPACE
// client.workspaces.getWorkspace('102321216509442', {opt_pretty: true})
//     .then((result) => {
//         console.log(result);
//     });


//TEAMS: GET TEAMS FOR Q4
// client.teams.getTeamsForOrganization('102321216509442', {opt_pretty: true})
//     .then((result) => {
//         console.log(result);
//     });
// let getTeams = (offsetParam) => {
// 	let offset = offsetParam;
// 	client.teams.getTeamsForOrganization('102321216509442', {offset, limit: "100", opt_pretty: true})
// 		.then((result) => {
// 			console.log("TEAMS LIST: ", result);
// 			if (result._response.next_page !== null){
// 				getTeams(result._response.next_page.offset)
// 			}
// 		});
// }
// getTeams()

//USERS: GET USERS
// let getUsers = (offsetParam) => {
// 	let offset = offsetParam;
// 	client.users.getUsers({workspace: '102321216509442', offset, limit: '100', opt_pretty: true})
//     .then((result) => {
//         console.log(result);
// 		if (result._response.next_page !== null){
// 			getUsers(result._response.next_page.offset)
// 		}			
// 	});
// }
// getUsers()

//PROJECTS: GET PROJECTS FOR ACTIVATIONS-INORGANIC TEAM
// client.projects.getProjects({team: '1198952890801647', opt_pretty: true})
//     .then((result) => {
//         console.log(result);
//     });
// client.projects.getProjectsForTeam('1198952890801647', {opt_pretty: true})
//     .then((result) => {
//         console.log("PROJECTS FROM TEAM: ", result);
//     });
// 
// let getProjects = (offsetParam) => {
// 	let offset = offsetParam;
// 	client.projects.getProjectsForTeam('1198952890801647', {offset, opt_pretty: true})
// 		.then((result) => {
// 			console.log("PROJECT LIST: ", result);
// 			if (result._response.next_page !== null){
// 				getProjects(result._response.next_page.offset)
// 			}
// 		});
// }
// getProjects()

//TAGS: LOOP THROUGH TAGS FROM WORKSPACE
// let getTags = (offsetParam) => {
// 	let offset = offsetParam;
// 	client.tags.getTags({workspace: '102321216509442', offset, limit: '100', opt_pretty: true})
// 		.then((result) => {
// 			console.log("TAG LIST: ", result);
// 			if (result._response.next_page !== null){
// 				getTags(result._response.next_page.offset)
// 			}
// 		});
// }
// getTags()

//TAGS: GET TASKS FROM TAGS
// client.tasks.getTasksForTag('1200577629165572', {opt_pretty: true})
//     .then((result) => {
//         console.log("TASKS FOR DIAMONDHANDS: ", result);
//     });

//GET TASKS FOR ORGANIC DEVELOPMENT TEAM (MULTIHOME/UNDETAILED) PROJECT
// client.tasks.getTasks({project: '1199222491229814', opt_pretty: true})
//     .then((result) => {
//         console.log(result);
//     });
// let getTasks = (offsetParam) => {
// 	let offset = offsetParam;
// 	client.tasks.getTasks({project: '1199222491229814', offset, limit: '100', opt_pretty: true})
// 		.then((result) => {
// 			console.log("TASK LIST: ", result);
// 			if (result._response.next_page !== null){
// 				getTasks(result._response.next_page.offset)
// 			}
// 		});
// }
// getTasks()

// client.tasks.getTasksForProject('1199222491229814', {opt_pretty: true})
//     .then((result) => {
//         console.log(result);
//     });

// PROJECTS: GET PROJECTS FOR ACTIVATIONS-ORGANIC TEAM
// client.projects.getProjects({team: '1169024825287481', opt_pretty: true})
//     .then((result) => {
//         console.log(result);
//     });
// client.projects.getProjectsForTeam('1169024825287481', {opt_pretty: true})
//     .then((result) => {
//         console.log("PROJECTS FROM TEAM: ", result);
//     });

//GET DETAILS FOR INDIVIDUAL WEBSITE PROJECT
// client.projects.getProject('1200421977893951', {opt_pretty: true})
//     .then((result) => {
//         console.log(result);
//     });


//GET TASKS FOR INDIVIDUAL WEBSITE PROJECT
// client.tasks.getTasks({project: '1200421977893951', opt_pretty: true})
//     .then((result) => {
//         console.log(result);
//     });
// client.tasks.getTasksForProject('1200421977893951', {opt_pretty: true})
//     .then((result) => {
//         console.log("TASKS FOR PROJECT", result);
//     });

//GET DETAILS FOR A SINGLE TASK ("2.1 Implementation - FED") IN A SINGLE PROJECT
// client.tasks.getTask('1200422094863219', {opt_pretty: true})
//     .then((result) => {
//         console.log("FEDIMP", result);
//     });

//GET PORTFOLIOS OWNED BY ME
// client.portfolios.getPortfolios({workspace: '102321216509442', owner: '1198707639905465', opt_pretty: true})
//     .then((result) => {
//         console.log(result);
//     });

//GET ALL USER DETAILS
// client.users.getUser('1198707639905465', {opt_pretty: true})
//     .then((result) => {
//         console.log(result);
//     });

//GET ALL DETAILS FOR A SINGLE PORTFOLIO
// client.portfolios.getPortfolio('1200215977730210', {opt_pretty: true})
//     .then((result) => {
//         console.log(result);
//     });

//GET A CUSTOM FIELD
// client.customfields.getCustomField('1200562009488647', {opt_pretty: true})
//     .then((result) => {
//         console.log(result);
//     });


//MAKING 1000 API CALLS FOR FUCK'S SAKE
// let allProjectIds = [];
// //GET ALL PROJECT IDS
// const acquireProjectIds = new Promise((resolve) => {
// 	let getProjects = (offsetParam) => {
// 		let offset = offsetParam;
// 		client.projects.getProjectsForTeam('1169024825287481', {offset, limit:'100', opt_pretty: true})
// 			.then((result) => {
// 				console.log("PROJECT LIST: ", result);
// 				result.data.forEach(element => {
// 					if (element.gid){
// 						allProjectIds.push(element.gid);
// 					}
// 				})
// 				if (result._response.next_page !== null){
// 					getProjects(result._response.next_page.offset)
// 				} else {
// 					resolve();
// 				}
// 			});
// 	}
// 	getProjects()
// });
// let checkEachProject = () =>{
// 	allProjectIds.forEach(proj => {
// 		client.projects.getProject(proj, {opt_pretty: true})
// 			.then((result) => {
// 			});
// 	});
// }
// acquireProjectIds
//   .then(checkEachProject)