console.log(process.env)


if (__DEV__) {
  console.warn('Hrozně dlouhá warningová zpráva, která se zobrazí v dev modu, ale ne v produkci')
}

if (__DEVTOOLS__) {
  ahoj()
}

function tohleJeNazevFunkce (argument) {
  return {
    length: argument.length,
    argument: argument,
  }
}


tohleJeNazevFunkce('ahoj tohle je text')
