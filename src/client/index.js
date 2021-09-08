import { checkForName } from './js/nameChecker'
import { handleSubmit } from './js/formHandler'
import './styles/datepicker.min.scss'

import datepicker from 'js-datepicker'

console.log(datepicker)
// import './styles/resets.scss'
// import './styles/base.scss'
// import './styles/form.scss'
// import './styles/section.scss'


const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

const tomorrowObj = {
    dd : String(tomorrow.getDate()),
    mm : String(tomorrow.getMonth()),
    yyyy : tomorrow.getFullYear()
}

let selectedDate;

const picker = datepicker(document.querySelector('#calendar'), {
    minDate: new Date(tomorrowObj.yyyy, tomorrowObj.mm, tomorrowObj.dd),
    onSelect: (instance, date) => {
        var tomorrowObj = new Date(date);
        var B = tomorrowObj.toISOString();
        selectedDate = B.split('T')[0];
      }
})
// console.log(picker)

// const celendarInput = document.getElementById('calendar')
// celendarInput.addEventListener('click', e => {
//     e.preventDefault()
//     console.log(e.target.value)
// })

picker.alwaysShow = true;
picker.show()

const testButton = document.getElementById('test-button')

testButton.addEventListener('click', async e => {
    e.preventDefault()    
    // let res = await fetch('searchPlace/Las Vegas/Nevada/US')
    // let res = await fetch(`searchPlace/${'Houston'}/${'TX'}/${'US'}`)
    // let res = await fetch(`searchPlace/${'Houston'}/${undefined}/${'US'}`)
    let res = await fetch(`searchPlace/${'Tokyo'}/${undefined}/${'Japan'}/${selectedDate}`)
    res = await res.json()
    console.log(res)
})
