    const asana = require('asana');
    const client = asana.Client.create().useAccessToken(process.env.ASANATOKEN);
    let tmpData = [];
    let tplData = [];
    let ganttData = [
        [
            { type: 'string', label: 'Task ID' },
            { type: 'string', label: 'Task Name' },
            { type: 'string', label: 'Resource' },
            { type: 'date', label: 'Start Date' },
            { type: 'date', label: 'End Date' },
            { type: 'number', label: 'Duration' },
            { type: 'number', label: 'Percent Complete' },
            { type: 'string', label: 'Dependencies' },
        ]
    ];

    let findIndex = (array, attr, value) => {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr].includes(value)) {
                return i;
            }
        }
        return -1;
    }

    let setSubtaskName = (oldLabel) => {
        const newLabels = {
            '2.1': '2.1 Implementation - FED',
            '2.2': '2.2 Implementation - Content',
            '3.1': '3.1 System Testing - FED',
            '3.2': '3.2 System Testing - Content',
            '3.3': '3.3 System Testing - QA',
            '4.1': '4.1 Client Beta - FED',
            '4.2': '4.2 Client Beta - Content',
            '4.3': '4.3 Client Beta - QA',
            '5.1': '5.1 Pre-Production - FED',
            '5.2': '5.2 Pre-Production - Content',
            '5.3': '5.3 Pre-Production - QA',
        }
        for (let key of Object.keys(newLabels)) {
            if (oldLabel.includes(key)){
                return newLabels[key];
            }
        }
    }

    

        //1. GET ALL TASKS FROM TEAM TAG (1 API CALL TOTAL)
            let allTaskIds = [];
            function getTasks(squadTagId, offsetParam){
                return new Promise(async function (resolve) {
                    let offset = offsetParam;
                    client.tasks.getTasksForTag(squadTagId, {offset, limit: '100', opt_pretty: true}).then((result) => {
                        result.data.forEach(element => {
                            if (element.gid){
                                allTaskIds.push(element.gid);
                            }
                        })
                        if (result._response.next_page !== null){
                            getTasks(result._response.next_page.offset)
                        } else {
                            resolve(allTaskIds);
                        }
                    });
                })
            }

        //2. GET PROJECT DETAILS FROM TASKS (2 API CALLS PER PROJECT)
        function acquireProjects(allTasks){
            let allProjects = [],
                taskLen = allTasks.length
            return new Promise(async function (resolve) {
                allTasks.forEach(proj => {
                    client.tasks.getTask(proj, {opt_pretty: true}).then((result) => {
                        if (result.projects){
                            var targProj = result.projects[(result.projects.length)-1];
                            if (targProj.hasOwnProperty('gid')){
                                client.tasks.getTasksForProject(targProj.gid, {limit: '100',opt_pretty: true}).then((results) => {
                                    results.projectName = targProj.hasOwnProperty('name') ? targProj.name : null;
                                    allProjects.push(results);		
                                }).then(()=>{
                                    if (allProjects.length === taskLen){
                                        resolve(allProjects)
                                    }
                                });
                            };
                        };
                    });
                });
            });
        }

        //3. CHERRYPICK MILESTONE TASK IDS FROM PROJECTS
        function organizeProjects(zeData){
            return new Promise(async function (resolve) {
                zeData.forEach(item =>{
                    let deets = item.data;
                    let projectItm = {
                        project : item.projectName,
                        details: {
                            imp : [
                                deets[findIndex(deets, "name", "2.1")] ? deets[findIndex(deets, "name", "2.1")] : {gid: '911'},
                                deets[findIndex(deets, "name", "2.2")] ? deets[findIndex(deets, "name", "2.2")] : {gid: '911'}, 
                            ], st : [
                                deets[findIndex(deets, "name", "3.1")] ? deets[findIndex(deets, "name", "3.1")] : {gid: '911'},
                                deets[findIndex(deets, "name", "3.2")] ? deets[findIndex(deets, "name", "3.2")] : {gid: '911'},
                                deets[findIndex(deets, "name", "3.3")] ? deets[findIndex(deets, "name", "3.3")] : {gid: '911'},
                            ], beta : [
                                deets[findIndex(deets, "name", "4.1")] ? deets[findIndex(deets, "name", "4.1")] : {gid: '911'},
                                deets[findIndex(deets, "name", "4.2")] ? deets[findIndex(deets, "name", "4.2")] : {gid: '911'},
                                deets[findIndex(deets, "name", "4.3")] ? deets[findIndex(deets, "name", "4.3")] : {gid: '911'},
                            ], pp : [
                                deets[findIndex(deets, "name", "5.1")] ? deets[findIndex(deets, "name", "5.1")] : {gid: '911'},
                                deets[findIndex(deets, "name", "5.2")] ? deets[findIndex(deets, "name", "5.2")] : {gid: '911'},
                                deets[findIndex(deets, "name", "5.3")] ? deets[findIndex(deets, "name", "5.3")] : {gid: '911'},
                            ]
                        }
                    }
                    tmpData.push(projectItm)
                })
               resolve()
            })
            
        }

        //4. GET FULL DETAILS OF EACH MILESTONE TASK (2-3 API CALLS PER PROJECT *WHENEVER CHANGING TASK CATEGORY*)
        function acquireProjectSubtasks(type){
            return new Promise(async function (resolve) {
                tmpData.forEach(projSubt =>{
                    let subtObj = {
                        project : projSubt.project,
                        fields : []
                    }		

                    projSubt.details[type].forEach(subtask => {
                        if (subtask && subtask.gid){
                            client.tasks.getTask(subtask.gid, {opt_pretty: true}).then((result) => {
                                subtObj.fields.push(result)
                            }).then(()=>{
                                if (projSubt.details[type].length === subtObj.fields.length){
                                    tplData.push(subtObj)
                                }
                            }).catch(()=>{
                                subtObj.fields.push({status: "Subtask not in project"})
                                if (projSubt.details[type].length === subtObj.fields.length){
                                    tplData.push(subtObj)
                                }
                            }).then(()=>{
                                if (tplData.length === tmpData.length){
                                    console.log(tplData)

                                    ganttOrganization(tplData)
                                    // returnDat();
                                }
                            })
                        }

                    });
                })
            });
        }

        //5. PREP ALL INFO FOR GANTT CHART

        function ganttOrganization(data){

            return new Promise(async function (resolve) {
            
                /*STRETCH TIMELINE*/
                let startDate = new Date();
                let endDate = new Date();
                startDate.setDate(startDate.getDate() - 14);
                endDate.setDate(endDate.getDate() + 14);
                let timeline = ['Current Tasks', 'Current Tasks', 'Current Tasks', startDate, endDate, null, 100, null];
                ganttData.push(timeline);

                /*MARK TODAY*/
                const moment= require('moment') 
                let tdStart = moment().startOf('day'); 
                let tdEnd = moment().endOf('day'); 
                let today = ['Today', 'Today ->', 'Today', tdStart._d, tdEnd._d, null, 100, null];
                ganttData.push(today);

                console.log(data)
                data.forEach(datum => {

                    let projName = datum.project ? datum.project : "Unnamed Project"; 
                    datum.fields.forEach((field, ind) => {
                        let ganttItm = [];
                        if (field.due_on){
                            ganttItm[0] = field.gid; 
                            ganttItm[1] = projName  + (field.assignee ? " -> " + field.assignee.name : " (Unassigned)" ); 
                            ganttItm[2] = setSubtaskName(field.name); 
                            ganttItm[3] = new Date (field.modified_at);
                            ganttItm[4] = new Date (field.due_on);
                            ganttItm[5] = null;
                            ganttItm[6] = field.completed ? 100 : 50;
                            ganttItm[7] = null;
                            ganttData.push(ganttItm);
                        }
                    });
                    
                })
            });
        }


export let getAsanaData = (squadTagId, milestoneCode) =>{
    return new Promise(async function (resolve) {
        var projects = await getTasks(squadTagId);
        console.log("1")
        var projects2 = await acquireProjects(projects);
        console.log("2")
        var projects3 = await organizeProjects(projects2);
        console.log("3")
        var projects4 = await acquireProjectSubtasks(milestoneCode);
        console.log("4")
        var projects5 = await ganttOrganization(projects4);
        console.log("5")
        resolve(projects5);
    });
}
