import BabelClass from './babel-import'


async function run () {
    const idnes = await fetch('http://idnes.cz')
    console.log(idnes)
}

function hellorError() {
    throw new Error('error')
}

//hellorError()
run()


const babel = new BabelClass('Abraham')

console.log(babel.getName())

babel.throwError()
