import moment from 'moment'
import { PROJECTTYPES } from '../constants/project-types';
import { CUSTOMFIELDS } from '../constants/custom-fields';

const asana = require('asana');
const client = asana.Client.create().useAccessToken(process.env.REACT_APP_ASANA_TOKEN);

function setMultihomeCustomfields(itm, cusVal) {
    for (let [mhKey, mhVal] of Object.entries(CUSTOMFIELDS)) {
        if (mhKey === cusVal['gid']) {
            itm[mhVal] = cusVal['display_value']
        }
    }
}

function setDuration(itm) {
    let itmType = itm.project_type + ': ' + itm.product_type;

    for (let [durKey, durVal] of Object.entries(PROJECTTYPES)) {
        if (durKey === itmType) {
            itm.project_duration = durVal.length;
            return
        } else {
            itm.project_duration = PROJECTTYPES.Default.length;
        }
    }
}

function checkDate(itm, type, date) {
    if (date) {
        return moment(date, ["MMM D, YYYY", "MMM D", "MMMM D"])
    } else {
        var errorList = document.getElementById('errorList');
        var listItm = document.getElementById(itm.name + type);
        var errMessage = '<li id ="' + itm.name + type + '">' + itm.name + ' is missing ' + type + ' date</li>'

        if (errorList) errorList.classList.remove('hidden');
        if (!listItm && errorList) errorList.innerHTML += errMessage;
    }
}

function isBlockOut(item) {
    let blockOut = false;

    item.projects.forEach(element => {
        if (element.gid === '1201660657658659') {
            blockOut = true;
        }
    });
    return blockOut;
}

function addDays(date, days) {
    if (date) return moment(date).add(days, 'days');
}

function addBusinessDays(date, days) {
    date = moment(date);
    while (days > 0) {
        date = date.add(1, 'days');
        if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
            days -= 1;
        }
    }
    return date;
}

// STEP 1: GET ALL TASKS (PROJECTS) FROM TEAM TAG (1 API CALL PER TAG)

function getTasks(squadTagId, offsetParam) {
    return new Promise(async function (resolve) {

        let offset = offsetParam;
        let allTaskIds = [];

        client.tasks.getTasksForTag(squadTagId, { offset, limit: '100', opt_pretty: true }).then((result) => {
            result.data.forEach(element => {
                if (element.gid) {
                    allTaskIds.push(element.gid);
                }
            })
            if (result._response.next_page !== null) {
                getTasks(squadTagId, result._response.next_page.offset)
            } else {
                resolve(allTaskIds);
            }
        });
    })
}

// STEP 2: GET MULTI-HOMED DATA (1 API CALL PER PROJECT)

function getMultihomeData(subtaskIDs) {
    let multihomeTasks = [],
        taskLen = subtaskIDs.length
    return new Promise(async function (resolve) {
        subtaskIDs.forEach(subtask => {
            client.tasks.getTask(subtask, { opt_pretty: true }).then((result) => {
                multihomeTasks.push(result);
                if (multihomeTasks.length === taskLen) {
                    resolve(multihomeTasks)
                }
            });
        });
    });
}

//STEP 3: ORGANIZE DATA & SET DURATIONS

function organizeMultihomeData(data) {

    for (let itm of data) {

        itm.itemType = isBlockOut(itm) ? 'blockOut' : 'websiteProject'

        for (let cusVal of Object.values(itm.custom_fields)) {
            setMultihomeCustomfields(itm, cusVal);
        }
        setDuration(itm)
    }
    return data;
}

// STEP 4: PREP DATA FOR GANTT

function prepGantt(dat) {
    var holderDev = [], holderItem = [], groups = [], itemsDev = []

    // 4.1 CHECK AND SET START DATE & SORT PROJECTS PER THIS DATE
    for (let itmK of Object.keys(dat)) {

        switch (dat[itmK].itemType) {
            case 'websiteProject':
                dat[itmK].timelineMarker1 = checkDate(dat[itmK], 'development', dat[itmK].dev_date);
                break;
            case 'blockOut':
                dat[itmK].timelineMarker1 = checkDate(dat[itmK], 'start', dat[itmK].block_start_date);
                dat[itmK].timelineMarker2 = checkDate(dat[itmK], 'end', dat[itmK].block_end_date);
                break;
            default:
                break;
        }

    }
    dat.sort((a, b) => moment(a.timelineMarker1).diff(b.timelineMarker1))

    // 4.2 PREP DEV GROUPS FOR DISPLAYING ON GANTT -> WE NEED TO MAKE 3 GROUPS FOR 3 ROWS
    for (let grK of Object.keys(dat)) {
        if (holderDev.indexOf(dat[grK].developer) === -1) holderDev.push(dat[grK].developer);
    }

    holderDev.sort();

    holderDev.forEach(function (el, ind, arr) {
        holderItem.push({ devo: el, projs: [], rowShifter: 1 })
        groups.push(
            { id: ind + '1', title: el, stackItems: false },
            { id: ind + '2', title: '', stackItems: false },
            { id: ind + '3', title: '', stackItems: false }
        )
    });

    // 4.3 ADD ITEMS 
    for (let [itmKey, itmVal] of Object.entries(dat)) {
        let devIndex = holderDev.indexOf(itmVal.developer);
        let isWebsite = itmVal.itemType === 'websiteProject' ? true : false;
        let projectDetails = itmVal;
        let projectID = itmKey;
        let projectDurations = itmVal.project_duration;
        let projectMarker1 = itmVal.timelineMarker1;
        let projectMarker2 = isWebsite ? addBusinessDays(projectMarker1, projectDurations.dev) : itmVal.timelineMarker2;
        let projectMarker3;
        let projectMarker4;
    
        holderItem.forEach(function (el, ind, arr) {
            if (projectMarker1 && projectMarker2 && el.devo === projectDetails.developer) {

                let ganttGlobal = {
                    group: devIndex + el.rowShifter.toString(),
                    canMove: false,
                    canResize: false,
                    canChangeGroup: false,
                    dragSnap: 1440 * 60 * 1000,
                    className: 'devrow-' + holderDev.indexOf(projectDetails.developer),
                    bhLink: projectDetails.bugherd_link ? projectDetails.bugherd_link : "https://bugherd.com/",
                    allData: projectDetails,
                    color: '#ffffff',
                    border: 'solid #000000',
                }

                // 1. ADD ITEM/FIRST SECTION OF ITEM
                el.projs.push({
                    id: projectID,
                    title: projectDetails.name,
                    start_time: projectMarker1,
                    end_time: projectMarker2,
                    bgColor: isWebsite ? '#2A363B' : '#000000',
                    ...ganttGlobal
                })

                if (projectDetails.itemType === 'websiteProject') {

                    // 2. ADD BETA ROUNDS
                    projectDurations.beta.forEach((roundLength, index) => {
                        let roundStart = index === 0 ? projectMarker2 : projectMarker3;
                        projectMarker3 = addBusinessDays(roundStart, roundLength)

                        el.projs.push({
                            id: projectID + '-B' + index,
                            title: index % 2 === 0 ? "Beta-C" : "Beta-D",
                            start_time: roundStart,
                            end_time: projectMarker3,
                            bgColor: index % 2 === 0 ? "#F76577" : "#E84A5F",
                            ...ganttGlobal
                        })
                    })

                    // 3. ADD CODE FREEZE
                    projectMarker4 = addBusinessDays(projectMarker3, projectDurations.freeze);
                    el.projs.push({
                        id: projectID + '-F',
                        title: "Freeze",
                        start_time: projectMarker3,
                        end_time: projectMarker4,
                        bgColor: '#355C7D',
                        ...ganttGlobal
                    })

                    // details for flyout
                    itmVal.calculatedDates = {
                        dev: moment(projectMarker1).format('MMMM DD, YYYY'),
                        beta: moment(projectMarker2).format('MMMM DD, YYYY'),
                        end: moment(projectMarker4).format('MMMM DD, YYYY')
                    }
                }

                // flag to rotate between adding 1, 2, or 3 to group ids to stagger projects
                el.rowShifter === 3 ? el.rowShifter = 1 : el.rowShifter++;
            }
        })


    }

    holderItem.forEach(function (elem, index, array) {
        elem.projs.forEach(function (el, ind, arr) {
            itemsDev.push(el)
        })
    })

    return { groups, itemsDev }
}

export let getAsanaData = (squadTagId) => {
    return new Promise(async function (resolve) {
        let multihomeIds = await getTasks(squadTagId);
        let multihomeData = await getMultihomeData(multihomeIds);
        let organizedData = await organizeMultihomeData(multihomeData);
        let ganttData = await prepGantt(organizedData)
        resolve(ganttData);
    });
}