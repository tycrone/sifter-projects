import moment from 'moment'
import randomColor from "randomcolor";
const asana = require('asana');
const client = asana.Client.create().useAccessToken(process.env.REACT_APP_ASANA_TOKEN);

let multihomeCustomFields = {
    '1200287744304380': 'dev_date',
    '1199504033998583': 'beta_date',
    '1198925330034971': 'project_type',
    '1198925330034988': 'product_type',
    '1198305023378530': 'company_name',
    '1197881808711213': 'project_phase',
    '1198999823949956': 'project_sheet',
    '1199356040438318': 'bugerd_link',
    '1198729944308298': 'developer',
}

let projectLengths = {
    'Studio One Website': 14,
    'Studio + Website': 21,
    'Studio Custom Website': 35,
    'Online Report (OAR)': 7,
    'SPAC': 3,
    'Corporate': 35,
    'ESG': 3,
    'Investor Day': 3,
}

function setMultihomeCustomfields(itm, cusVal) {
    for (let [mhKey, mhVal] of Object.entries(multihomeCustomFields)) {
        if (mhKey === cusVal['gid']) {
            itm[mhVal] = cusVal['display_value']
        }
    }
}

function setDuration(type, itm) {
    let itmKey;
    switch (type) {
        case 'product':
            itmKey = 'product_type';
            break;
        default:
            itmKey = 'project_type';
            break;
    }
    for (let [durKey, durVal] of Object.entries(projectLengths)) {

        if (durKey === itm[itmKey]) {
            itm.project_duration = durVal;
            break;
        } else {
            itm.project_duration = 7;
        }
    }
}

function cleanupDate(itm, type, date) {
    if (date) {
        switch (type) {
            case 'Dev':
            case 'Beta':
                return moment(date + ', ' + getYear(date));
            default:
                return moment(date)
        }
    } else {
        var errorList = document.getElementById('errorList');
        var listItm = document.getElementById(itm.name + type);
        var errMessage = '<li id ="' + itm.name + type + '">' + itm.name + ' is missing ' + type + ' Date</li>'

        if (errorList) errorList.classList.remove('hidden');
        if (!listItm) errorList.innerHTML += errMessage;
    }
}


function getYear(devDate) {
    var dateArr = devDate.split(' ');
    var monthDevDate = moment().month(dateArr[0]).format('M');
    var monthCurrent = moment().format('M');
    var yearCurrent = moment().format('YYYY');
    if (monthDevDate < monthCurrent) {
        return yearCurrent + 1;
    } else {
        return yearCurrent;
    }
}

function getEndDate(duration, startDate) {
    if (startDate) return moment(startDate).add(duration, 'days')
}

//1. GET ALL TASKS FROM TEAM TAG (1 API CALL TOTAL)
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
                getTasks(result._response.next_page.offset)
            } else {
                resolve(allTaskIds);
            }
        });
    })
}

//2. PASS PROJECT IDS AND GET MULTI-HOMED SUBTASK ID (2 API CALLS PER PROJECT)
function acquireProjectsGetMultiHome(projectIDs) {
    let allMultihomes = [],
        taskLen = projectIDs.length
    return new Promise(async function (resolve) {
        projectIDs.forEach(proj => {
            client.tasks.getTask(proj, { opt_pretty: true }).then((result) => {
                if (result.projects) {
                    let targProj = result.projects[(result.projects.length) - 1];
                    if (targProj.hasOwnProperty('gid')) {
                        client.tasks.getTasksForProject(targProj.gid, { limit: '100', opt_pretty: true }).then((results) => {
                            let projName = targProj.hasOwnProperty('name') ? targProj.name : null;
                            for (let itm in Object.values(results.data)) {
                                //just check 6 characters... leave some wiggle room for botched proj names
                                if (results.data[itm].name.substr(0, 6) === projName.substr(0, 6)) {
                                    allMultihomes.push(results.data[itm].gid);
                                }
                            }
                        }).then(() => {
                            if (allMultihomes.length === taskLen) {
                                resolve(allMultihomes)
                            }
                        });
                    };
                };
            });
        });
    });
}

//3. GET MULTI-HOMED DATA
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

//4. ORGANIZE DATA
function organizeMultihomeData(data) {
    for (let itm of data) {
        for (let cusVal of Object.values(itm.custom_fields)) {
            setMultihomeCustomfields(itm, cusVal);
        }
        if (itm.product_type) {
            setDuration('product', itm)
        } else if (itm.project_type) {
            setDuration('project', itm)
        }
    }
    return data;
}

//5. PREP DATA FOR GANTT
function prepGantt(dat) {
    var holderDev = [], groups = [], itemsDev = [], itemsBeta = []

    //PREP GROUPS
    for (let [grKey, grVal] of Object.entries(dat)) {
        if (holderDev.indexOf(grVal.developer) === -1) holderDev.push(grVal.developer);
    }
    holderDev.sort();
    holderDev.forEach(function (el, ind, arr) {
        groups.push({
            id: ind,
            title: el,
            stackItems: true,
            // rightTitle: "",
        })
    });

    //PREP ITEMS
    for (let [itmKey, itmVal] of Object.entries(dat)) {
        let devDate = cleanupDate(itmVal, 'Dev', itmVal.dev_date);
        let endDate = getEndDate(itmVal.project_duration, devDate);
        let betaDate = cleanupDate(itmVal, 'Beta', itmVal.beta_date);
        let goLive = cleanupDate(itmVal, 'Go Live', itmVal.due_on);
        let groupId = holderDev.indexOf(itmVal.developer);
        let randomSeed = Math.floor(Math.random() * 1000);

        //DEV
        itemsDev.push({
            id: itmKey,
            group: groupId,
            title: itmVal.name,
            canMove: false,
            canResize: false,
            canChangeGroup: false,
            dragSnap: 1440 * 60 * 1000,
            start_time: devDate,
            end_time: endDate,
            className: 'devrow-' + holderDev.indexOf(itmVal.developer),
            color: 'rgb(0, 0, 0)',
            bgColor: randomColor({ luminosity: 'light', seed: randomSeed + itmKey }),
            border: 'solid #000000',
            allData: itmVal
        })

        //BETA
        itemsBeta.push({
            id: itmKey,
            group: groupId,
            title: itmVal.name,
            canMove: false,
            canResize: false,
            canChangeGroup: false,
            dragSnap: 1440 * 60 * 1000,
            start_time: betaDate,
            end_time: goLive,
            className: 'devrow-' + holderDev.indexOf(itmVal.developer),
            color: 'rgb(0, 0, 0)',
            bgColor: randomColor({ luminosity: 'light', seed: randomSeed + itmKey }),
            border: 'solid #000000',
            allData: itmVal
        })
    }

    return { groups, itemsDev, itemsBeta }
}

export let getAsanaData = (squadTagId, milestoneCode) => {
    return new Promise(async function (resolve) {
        let projectIDs = await getTasks(squadTagId);
        let multihomeIds = await acquireProjectsGetMultiHome(projectIDs);
        let multihomeData = await getMultihomeData(multihomeIds);
        let organizedData = await organizeMultihomeData(multihomeData);
        let ganttData = await prepGantt(organizedData)
        resolve(ganttData);
    });
}