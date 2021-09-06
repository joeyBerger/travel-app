import { checkForName } from './js/nameChecker'
import { handleSubmit } from './js/formHandler'

const testButton = document.getElementById('test-button')


console.log('wtf')

testButton.addEventListener('click', async e => {
    e.preventDefault()
    
    // let res = await fetch('searchPlace/Las Vegas/Nevada/US')
    // let res = await fetch(`searchPlace/${'Houston'}/${'TX'}/${'US'}`)
    // let res = await fetch(`searchPlace/${'Houston'}/${undefined}/${'US'}`)
    let res = await fetch(`searchPlace/${'Tokyo'}/${undefined}/${'Japan'}`)
    res = await res.json()

    console.log(res)
})
