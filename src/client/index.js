import { checkForName } from './js/nameChecker'
import { handleSubmit } from './js/formHandler'
import './styles/datepicker.min.scss'

import datepicker from 'js-datepicker'

console.log(datepicker)
// import './styles/resets.scss'
// import './styles/base.scss'
// import './styles/form.scss'
// import './styles/section.scss'

var today = new Date();
const tomorrow = {
    dd : String(today.getDate()),
    mm : String(today.getMonth()),
    yyyy : today.getFullYear()
}

const picker = datepicker(document.querySelector('#calendar'), {minDate: new Date(tomorrow.yyyy, tomorrow.mm, tomorrow.dd)})

console.log(picker)

picker.alwaysShow = true;
picker.show()

const testButton = document.getElementById('test-button')

testButton.addEventListener('click', async e => {
    e.preventDefault()    
    // let res = await fetch('searchPlace/Las Vegas/Nevada/US')
    // let res = await fetch(`searchPlace/${'Houston'}/${'TX'}/${'US'}`)
    // let res = await fetch(`searchPlace/${'Houston'}/${undefined}/${'US'}`)
    let res = await fetch(`searchPlace/${'Tokyo'}/${undefined}/${'Japan'}`)
    res = await res.json()
    console.log(res)
})
