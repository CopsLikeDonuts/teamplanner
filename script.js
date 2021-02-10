    const content = document.getElementById('content');
    const header = document.createElement('div');
    header.id = 'header';
    content.appendChild(header);

    const weekPlan = document.createElement('div');
    weekPlan.id = 'table';
    content.appendChild(weekPlan);         
    
    

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
    const teamSelector = document.getElementById('team');


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

    function renderModalWindow() {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class='modal-dialog'>
                <div id='modal-content'>
                    <img src='./images/Close-icon.png' class='delete-icon' data-close></img>
                    <div class='modal-dialog-message'>
                        <span id='modal-text'></span>
                    </div>
                    <div class='modal-dialog-buttons'>
                        <button id='modal-btn-yes'>Yes</button>
                        <button id='modal-btn-no' data-close>No</button>
                    </div>
                </div>
            </div>
        `;
        content.appendChild(modal);
    }
    renderModalWindow();

    const modalWindow = document.querySelector('.modal');

    const closebtn = document.querySelectorAll('[data-close]');
    closebtn.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModal();
        }
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
                            let deleteIcon = document.createElement('img');
                            deleteIcon.src = './images/Close-icon.png';
                            deleteIcon.classList.add('delete-icon');
                            timeslot.appendChild(deleteIcon);
                            timeslot.classList.add('busy-slot');
                            
                            deleteIcon.addEventListener('click', (e) => {
                                
                                openModal(e.target.parentNode.innerText);
                                const evDeleteConfirmBtn = document.getElementById('modal-btn-yes');
                                
                                evDeleteConfirmBtn.addEventListener('click', () => {
                                    for (i = events.length -1; i >= 0; i--){
                                        if (events[i].id === currUser.data[e.target.parentNode.parentNode.rowIndex -1][e.target.parentNode.cellIndex -1].id) {
                                            events.splice(events.indexOf(events.find(event => event.id === currUser.data[e.target.parentNode.parentNode.rowIndex -1][e.target.parentNode.cellIndex -1].id)), 1);
                                        }
                                    }
                                    closeModal();
                                    setDefaultDate();
                                    renderEvents();
                                    renderTable(currUser);
                                });
                                
                                
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


    function displayParticipants() {
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
    }
    

    function closeModal(){
        modalWindow.classList.add('hide');
        modalWindow.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal(eventName) {
        const modalText = document.getElementById('modal-text');
        modalText.innerText = `Are you sure to delete ${eventName} event?`
        modalWindow.classList.add('show');
        modalWindow.classList.remove('hide');
        document.body.style.overflow = 'hidden';
    }

    const addEventBtn = document.getElementById('new-event');
    

    addEventBtn.addEventListener('click', () => {
        
        let myURL = 'http://127.0.0.1:5500/'
        
        location.href = location.origin + '#create-event';
        content.innerHTML = '';
        content.innerHTML = `
            <div id='error-bar'>
        <img src='./images/error.png' alt='error'>
        <span id='error-message'>Failed to create an event. Time slot is already booked.</span>
        <span id='error-close'>+</span>
    </div>
    <h1 id='create-event-header'>Create event</h1>
    <div class='add-event-page event-property'>
        
        <div class='event-property'>
            <span class='create-event-tabs'>Name of the event:</span>
            <input type='text' placeholder='Event name' id='event-name' class='create-event-input'/>
        </div>
        <div class='event-property participants'>
            
            <span class='create-event-tabs'>
                Participants:
            </span>
            <form id='event-create-form'>
                <div class="select-participants">
                    <div id="select-box" class="create-event-input">
                        <select>
                            <option id='selector-header'>Select an option</option>
                        </select>
                        <div class="over-select"></div>
                    </div>
                    <div id="checkboxes">
                    <label for="one">
                        <input type="checkbox" id="one" />Necr</label><hr>
                    <label for="two">
                        <input type="checkbox" id="two" />Sorc</label><hr>
                    <label for="three">
                        <input type="checkbox" id="three" />SB</label>
                    </div>
                </div>
                </form>
            
            
        </div>
        <div class='event-property'>
            <span class='create-event-tabs'>
                Day:
            </span>
            <select class='event-create-dropdown  create-event-input' id='event-day'>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
            </select>
        </div>
        <div class='event-property '>
            <span class='create-event-tabs'>Time:</span>
            <select class='event-create-dropdown create-event-input' id='event-time'>
                <option>10:00</option>
                <option>11:00</option>
                <option>12:00</option>
                <option>13:00</option>
                <option>14:00</option>
                <option>15:00</option>
                <option>16:00</option>
                <option>17:00</option>
                <option>18:00</option>
            </select>
        </div>
        <div class='event-property event-create-btns'>
            <button class='event-create-btn' id='event-cancel-btn'>Cancel</button>
            <input type='submit' value='Create' class='event-create-btn' id='event-create-btn'></input>
        </div>
    </div>
        `
    displayParticipants();
    cancelEvCreation();
    const createBtn = document.getElementById('event-create-btn');
    createBtn.addEventListener('click', createEvent);
    
    });

    function cancelEvCreation(){
        const cancelBtn = document.getElementById('event-cancel-btn');
        
    }

    function createEvent() {
        const evName = document.getElementById('event-name');
        const evDay = document.getElementById('event-day');
        const evTime = document.getElementById('event-time');
        console.log(evName.value, evDay.value, evTime.value);
    }


