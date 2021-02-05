document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('header');

    function renderHeader() {
        header.innerHTML = `<div>Calendar</div>
        <select id='team'></select>
        <div>
            <button id='new-event' type='submit' >New event +</button>
        </div>`;
    }

    renderHeader();

    const headerData = [' ', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00',
                    '15:00', '16:00', '17:00', '18:00'];         
    const weekPlan = document.getElementById('table');
    const teamSelector = document.getElementById('team');
    const addEventBtn = document.getElementById('new-event');


    let obj = {
        id: 1,
        date: 'Mon',
        time: '13:00',
        user: 1,
        desc: 'lalalal'
    }

    let obj2 = {
        id: 2,
        date: 'Tue',
        time: '16:00',
        user: 2,
        desc: 'asdasd'
    }

    let obj3 = {
        id: 3,
        date: 'Fri',
        time: '14:00',
        user: 3,
        desc: 'sfsdf'
    }

    let obj4 = {
        id: 3,
        date: 'Fri',
        time: '14:00',
        user: 2,
        desc: 'sfsdf'
    }

    let events = [obj, obj2, obj3, obj4];

    let users = [
        {
            id: 0,
            name: 'All',
            data:[]
        },

        {   
            id: 1,
            name: 'Sorc',
            data: []
        },
        {   id: 2,
            name: 'Necr',
            data: []
        },
        {   id: 3,
            name: 'SB',
            data: []
        }
    ]

    let currUser = users[0];

    function setDefaultDate () {
        for (let v = 0; users.length > v; v++) {
            users[v].data = [];
            for (let i = 0; 9 > i; i++) {
                users[v].data.push([])
                for (let y = 0; 5 > y; y++) {
                    users[v].data[i].push('');
                }
            }
        }
    }

    setDefaultDate();

    users.forEach(member => {
        let teamMember = document.createElement('option');
        teamMember.innerText = member.name;
        teamSelector.appendChild(teamMember);
        teamSelector.addEventListener('change', (e) => {
            currUser = users.find(el => el.name === e.target.value);
            renderEvents();
            renderTable(currUser);
        })
    });


    function renderTable(user) {
        weekPlan.innerHTML = null;
        let table = document.createElement('table');
        let headerRow = document.createElement('tr');

        headerData.forEach(headerText => {
            let header = document.createElement('th');
            header.classList.add('table-header');
            header.innerText = headerText;
            headerRow.appendChild(header);
        });
        table.appendChild(headerRow);
        weekPlan.appendChild(table);

        timeSlots.forEach(slot => {
            let row = document.createElement('tr');
            for (let i = 0; i < headerData.length; i++) {
                let timeslot = document.createElement('td');
                if (i == 0) {
                    timeslot.classList.add('table-header');
                    timeslot.innerText = slot;
                    row.appendChild(timeslot);
                } else {
                    if (user) {
                        timeslot.innerText = user.data[timeSlots.indexOf(slot)][i - 1]['desc'] ? user.data[timeSlots.indexOf(slot)][i - 1]['desc']: ''
                        if (timeslot.innerText != '') {
                            let deleteIcon = document.createElement('span');
                            deleteIcon.innerText = '+';
                            deleteIcon.classList.add('delete-icon');
                            timeslot.appendChild(deleteIcon);
                            timeslot.classList.add('busy-slot');
                            
                            deleteIcon.addEventListener('click', (e) => {
                                for (i = events.length -1; i >= 0; i--){
                                    if (events[i].id === currUser.data[e.target.parentNode.parentNode.rowIndex -1][e.target.parentNode.cellIndex -1].id) {
                                        events.splice(events.indexOf(events.find(event => event.id === currUser.data[e.target.parentNode.parentNode.rowIndex -1][e.target.parentNode.cellIndex -1].id)), 1);
                                    }
                                }
                                setDefaultDate();
                                renderEvents();
                                renderTable(currUser);
                            });
                        }
                    }
                    row.appendChild(timeslot);
                }
            }
            
            table.appendChild(row);
            weekPlan.appendChild(table);
        });
    }
    renderTable(null);

    function renderEvents() {
        for (let i = 0; i < events.length; i++){
            let dateIndex = headerData.indexOf(events[i].date)
            let timeIndex = timeSlots.indexOf(events[i].time);
            if (currUser.id == 0) {
                users[0].data[timeIndex][dateIndex - 1] = events[i];
                renderTable(users[0]);
            } else {
                users.find(user => user.id == events[i].user).data[timeIndex][dateIndex - 1] = events[i];
                renderTable(users[events[i].user]);
            }   
        }
    }
    renderEvents();

    let expanded = false;
    let selectParticipants = document.getElementById('select-box');
    function showCheckboxes() {
        let checkboxes = document.getElementById("checkboxes");
        if (!expanded) {
            checkboxes.style.display = "block";
            expanded = true;
        } else {
            checkboxes.style.display = "none";
            expanded = false;
        }
    }
    selectParticipants.addEventListener('click', showCheckboxes);


    function createModalWindow() {
        
    }

    addEventBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let myURL = 'http://127.0.0.1:5500/'
        window.history.pushState(null, null, 'create-event');
    });
});