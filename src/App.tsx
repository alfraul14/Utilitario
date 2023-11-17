import './App.css'
import { FlexContainer } from './components/FlexContainer'
import { useState } from 'react'

function App () {
  enum Ambiente {
    Desarrollo = 'Desarrollo',
    Certificacion = 'Certificación',
    Produccion = 'Producción',
    SinInicializar = 'Seleccionar...'
  }
  const AMBIENTE = {
    [Ambiente.SinInicializar]: 'Selecciona Ambiente',
    [Ambiente.Desarrollo]: 'https://stibiometricades0100.z20.web.core.windows.net/#/auth',
    [Ambiente.Certificacion]: 'https://stibiometriacrt0100.z20.web.core.windows.net/#/auth',
    [Ambiente.Produccion]: 'https://stibiometricaprd0100.z20.web.core.windows.net/#/auth'
  }

  const errorMessages = {
    invalidRedirectFormat: 'La información proporcionada en el dominio de redirección no sigue el formato correcto.',
    redirectNotAssigned: 'La URL de redirección no está asignada al equipo.',
    selectTeam: 'Seleccionar equipo',
    createdUrl: 'Todos los datos son necesarios para crear la url.'
  }
  const [ambiente, setAmbiente] = useState<Ambiente>(Ambiente.SinInicializar)
  const [equipo, setEquipo] = useState<string>(Ambiente.SinInicializar)
  const [token, setToken] = useState<string>('')
  const [redirectOk, setRedirectOk] = useState<string>('')
  const [redirectError, setRedirectError] = useState<string>('')

  const generarUrl = () => {
    if (
      ambiente === Ambiente.SinInicializar ||
      equipo === Ambiente.SinInicializar ||
      token.length < 20 ||
      redirectOk.length === 0 ||
      redirectError.length === 0
    ) {
      return errorMessages.createdUrl
    } else {
      return `${AMBIENTE[ambiente]}/${btoa(token)}/redirect-uri/${btoa(redirectOk)}/redirect-error/${btoa(redirectError)}`
    }
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAmbiente(event.target.value as Ambiente)
  }
  const handleSelectTeam = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEquipo(event.target.value)
  }
  const handleToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value)
  }
  const handleRedirectOk = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRedirectOk(event.target.value)
  }
  const handleRedirectError = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRedirectError(event.target.value)
  }

  const dataMockeada = [
    {
      nombre: 'Steel Pulse',
      id: 'IMEP',
      redirect: 'https://miespacio.pacifico.com.pe'
    },
    {
      nombre: 'Paramore',
      id: 'PRM',
      redirect: 'https://acdnecvieu2d01.azureedge.net/'
    },
    {
      nombre: 'Fall Out Boy',
      id: 'FOB',
      redirect: 'https://redirect/FALLOUTBOY'
    },
    {
      nombre: 'Panic! At The Disco',
      id: 'PATD',
      redirect: 'https://redirect/PANICATTHEDISCO'
    },
    {
      nombre: 'My Chemical Romance',
      id: 'MCR',
      redirect: 'https://redirect/MYCHEMICALROMANCE'
    },
    {
      nombre: 'Twenty One Pilots',
      id: 'TOP',
      redirect: 'https://redirect/TWENTYONEPILOTS'
    },
    {
      nombre: 'Green Day',
      id: 'GD',
      redirect: 'https://redirect/GREENDAY'
    }
  ]

  const filterResultTeam = (equipo: string) => {
    const equipoEncontrado = dataMockeada.find((team) => team.id === equipo)
    console.log(equipoEncontrado)
    return equipoEncontrado
  }
  const encoded64 = (datoacodificar: string) => {
    return btoa(datoacodificar)
  }

  const validateUrlSuccess = (urlSuccess: string) =>
    /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=/]{2,256}\/(ok)\//.test(urlSuccess)

  const validateUrlError = (urlError: string) =>
 	  /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=/]{2,256}\/(error)\//.test(
      urlError
    )
  const ValidateRedirect = (urlRedirectOk: string, error = false) => {
    if (urlRedirectOk.length < 1) {
      return { resultado: '', isOk: false }
    }
    let validateIsOk
    if (error) {
      validateIsOk = validateUrlError(urlRedirectOk)
    } else {
      validateIsOk = validateUrlSuccess(urlRedirectOk)
    }

    const validateRedirect = filterResultTeam(equipo)
    if (validateRedirect?.id !== undefined) {
      if (validateIsOk && new RegExp(validateRedirect?.redirect).test(urlRedirectOk)) {
        return { resultado: btoa(urlRedirectOk), isOk: true }
      } else {
        return { resultado: errorMessages.invalidRedirectFormat, isOk: false }
      }
    }
    return { resultado: errorMessages.redirectNotAssigned, isOk: false }
  }

  const obtenerIdYRedirectTeam = (equipo: string): string => {
    const equipoEncontrado = filterResultTeam(equipo)
    if (equipoEncontrado?.id !== undefined) {
      const { id, redirect } = equipoEncontrado
      return `${id} - ${redirect}`
    } else {
      return errorMessages.selectTeam
    }
  }

  return (

    <div className='container'>
      <h1 className=' text-4xl  '>Generar URL</h1>
      <div className='bg-blue-100 h-40 break-words overflow-auto p-2'>{generarUrl()}</div>
      <div className='p-4 text-left'>

        <FlexContainer name='ambiente' resultado={AMBIENTE[ambiente]} isOk={ambiente !== Ambiente.SinInicializar}>
          <select
            className="border p-2 rounded-md focus:outline-none focus:border-blue-300"
            id="ambiente" value={ambiente} onChange={handleSelect}>
              {Object.keys(AMBIENTE).map((amb) => (
                <option key={amb}value={amb}>{amb}</option>
              ))}
          </select>
        </FlexContainer>
        <FlexContainer name='equipo' resultado={obtenerIdYRedirectTeam(equipo)} isOk={equipo !== Ambiente.SinInicializar}>
          <select
            className="border p-2 rounded-md focus:outline-none focus:border-blue-300"
            id="equipo" value={equipo} onChange={handleSelectTeam}>
              <option value={Ambiente.SinInicializar}>Selecciona...</option>
              {dataMockeada.map(({ nombre, id }) => (
                <option key={id} value={id}>{nombre}</option>
              ))}
          </select>
        </FlexContainer>
        <FlexContainer isInput={true} name='token' resultado={encoded64(token)} isOk={token.length > 20}>
          <input id="token"className="border p-2 rounded-md focus:outline-none focus:border-blue-300" placeholder='ingrese Token' onChange={handleToken}/>
        </FlexContainer>
        <FlexContainer isInput={true} name='redirectOk' resultado={ValidateRedirect(redirectOk).resultado} isOk={ValidateRedirect(redirectOk).isOk}>
          <input id="redirectOk" className="border p-2 rounded-md focus:outline-none focus:border-blue-300" placeholder='redirectOk' onChange={handleRedirectOk}/>
        </FlexContainer>
        <FlexContainer isInput={true} name='redirectError' resultado={ValidateRedirect(redirectError, true).resultado} isOk={ValidateRedirect(redirectError, true).isOk}>
          <input id="redirectError" className="border p-2 rounded-md focus:outline-none focus:border-blue-300" placeholder='redirectOk' onChange={handleRedirectError}/>
        </FlexContainer>

      </div>
    </div>
  )
}

export default App
