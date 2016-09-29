import BabelClass from './babel-import'


async function run () {
    const idnes = await fetch('http://idnes.cz')
    console.log(idnes)
    babel.throwError()
}

function hellorError() {
    throw new Error('error')
}


const babel = new BabelClass('Abraham')

console.log(babel.getName())


export default run
