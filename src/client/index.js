import { handleUserInput } from './js/formHandler'
import { getEssentialElements, createCustomElement } from './js/elementHelper'
import datepicker from 'js-datepicker'

import './styles/resets.scss'
import './styles/base.scss'
import './styles/form.scss'
import './styles/section.scss'
import './styles/datepicker.min.scss'
import './styles/custom-styles.scss'

//setup varaiabes
let selectedDate;
let savedTrips = [];
let inputFields = {
    city : undefined,
    state : undefined,
    country : undefined,
}
Object.keys(inputFields).forEach(k => inputFields[k] = document.getElementById(k))

//const variables
const {inputSection,findLocation,inputErrorMessages,processingMessage,toggleButton,plannedTrips} = getEssentialElements()
const toggleButtonLabels = {hide: 'Hide Planner', show: '+ Add Trip'}

//setup styles
processingMessage.style.display = 'none'

//setup calendar
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
const tomorrowObj = {
    dd : String(tomorrow.getDate()),
    mm : String(tomorrow.getMonth()),
    yyyy : tomorrow.getFullYear()
}
//instantiate picker object
const picker = datepicker(document.querySelector('#calendar'), {
    minDate: new Date(tomorrowObj.yyyy, tomorrowObj.mm, tomorrowObj.dd),
    onSelect: (instance, date) => {
        if (date) {
            var tomorrowObj = new Date(date);
            var B = tomorrowObj.toISOString();
            selectedDate = B.split('T')[0];
        } else {selectedDate = ''}
    },
    customDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
})
picker.calendarContainer.style.setProperty('font-size', '1.5rem')    
picker.alwaysShow = true;
picker.show()

//internal functions
const setupHandleUserInput = () => {
    return handleUserInput(inputFields,selectedDate,inputErrorMessages)
}

//event listeners

//add event listner and handle toggle logic
toggleButton.addEventListener('click', function(e) {
    const showing = inputSection.style.display !== 'none';
    inputSection.style.display = showing ? 'none' : 'block';
    e.srcElement.innerHTML = showing ? toggleButtonLabels.show : toggleButtonLabels.hide
})

//add event listener for API call, modifies the DOM based on recieved info
findLocation.addEventListener('click', async e => {
    e.preventDefault();

    //hide error messages
    for (let i = 0; i < inputErrorMessages.length; i++) inputErrorMessages[i].style.display = 'none'

    //get user input
    const userInput = setupHandleUserInput();

    //if invalid user input, return
    if (!userInput) return;

    const {city,state,country,selectedDate} = userInput

    //show procesing message
    processingMessage.style.display = 'block'

    //GET request for server
    let res = await fetch(`searchPlace/${city}/${state}/${country}/${selectedDate}`)
    res = await res.json()

    //hide procesing message
    processingMessage.style.display = 'none'

    //hanlde error
    if (res.error) {
        for (let i = 0; i < inputErrorMessages.length; i++) {
            if (inputErrorMessages[i].id.includes('server')) {
                inputErrorMessages[i].style.display = 'block'
                inputErrorMessages[i].style.innerHTML = res.error
            }
        }
    } else {    //update DOM on server success

        //hide neccessary elements
        inputSection.style.display = 'none'
        savedTrips.forEach(trip => trip.style.display = 'none')
        toggleButton.style.display = 'none'

        const tripId = savedTrips.length;
        const container = createCustomElement('section',`trip-${tripId}`,'trip-section');

        //create host of elements to reflect planned trip
        let elements = [];
        elements.push(createCustomElement('h3',`trip-header-${tripId}`,'planned-trip',`Planned Trip ${tripId+1}`));
        elements.push(createCustomElement('h5',undefined,'trip-header','Destination'));
        elements.push(createCustomElement('h3',undefined,'trip-data',`${city}${state!=='undefined'?`, ${state}`:''} - ${country}`));
        elements.push(createCustomElement('h5',undefined,'trip-header','Travel Date'));
        elements.push(createCustomElement('h3',undefined,'trip-data',selectedDate))
        elements.push(createCustomElement('h5',undefined,'trip-header','Low'));
        elements.push(createCustomElement('h3',undefined,'trip-data',`${res.lowTemp.celcius}° C / ${res.lowTemp.fahrenheit}° F`));
        elements.push(createCustomElement('h5',undefined,'trip-header','High'));
        elements.push(createCustomElement('h3',undefined,'trip-data',`${res.highTemp.celcius}° C / ${res.highTemp.fahrenheit}° F`));
        elements.push(createCustomElement('h5',undefined,'trip-header','Days Until Trip'));
        elements.push(createCustomElement('h3',undefined,'trip-data',res.daysBeforeTrip));
        elements.push(createCustomElement('div',undefined,'image-container',undefined,undefined));
        let image = createCustomElement('img','destination-image',undefined,undefined,res.webformatURL);
        elements[elements.length-1].appendChild(image)
        elements.push(createCustomElement('div',undefined,'button-container',undefined,undefined));
        let button = createCustomElement('button','save-button',undefined,'Save',undefined,{type : 'click', action : () => {       
            inputSection.style.display = 'block'
            toggleButton.style.display = 'block'
            savedTrips.forEach(trip => trip.style.display = 'block')
            document.getElementById('save-button').remove()
            console.log('tripId in save',tripId)
            document.getElementById(`cancel-button-${tripId}`).innerHTML = 'Remove Trip'
        }});
        elements[elements.length-1].appendChild(button)
        //canel button / remove trip button
        button = createCustomElement('button',`cancel-button-${tripId}`,undefined,'Cancel',undefined,{type : 'click', action : (e) => {
            inputSection.style.display = 'block'
            savedTrips.forEach(trip => trip.style.display = 'block')
            const id = parseInt(e.target.id.replace('cancel-button-',''))
            container.remove();
            savedTrips = savedTrips.slice(0,id).concat(savedTrips.slice(id+1))

            //update neccessary trip ids
            savedTrips.forEach((st,i) => {
                st.id = `trip-${i}`
                for (let j = 0; j < st.children.length; j++) {
                    if (st.children[j].id.includes('trip-header')) st.children[j].innerHTML = `Planned Trip ${i+1}`                    
                    if (st.children[j].className.includes('button-container')) {
                        for (let k = 0; k < st.children[j].children.length; k++) {
                            if (st.children[j].children[k].id.includes('cancel-button')) {
                                st.children[j].children[k].id = `cancel-button-${i}`
                            }
                        }
                    }
                }
            })
            console.log(savedTrips)
            if (savedTrips.length === 0) {
                toggleButton.style.display = 'block'
                toggleButton.innerHTML = 'Hide Planner'
            }
        }});
        elements[elements.length-1].appendChild(button)

        //add all elements to container
        elements.forEach(e => container.appendChild(e))

        //add container to planned trips container
        plannedTrips.appendChild(container)

        //add container to saved trips tracking array
        savedTrips.push(container)
    }    
})
