import './App.css'
import { FlexContainer } from '../FlexContainer'
import { useState } from 'react'

function App () {
  console.log('sso APPTSX')
  enum Ambiente {
    Localhost = 'Localhost',
    Desarrollo = 'Desarrollo',
    Certificacion = 'Certificación',
    Produccion = 'Producción',
    SinInicializar = 'Seleccionar...'
  }
  const AMBIENTE = {
    [Ambiente.SinInicializar]: 'Selecciona Ambiente',
    [Ambiente.Localhost]: 'localhost:3002//#/auth',
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
  const [uid, setUid] = useState<string>('')
  const [app, setApp] = useState<string>('')
  const [ipClient, setIpClient] = useState<string>('')
  const [redirectOk, setRedirectOk] = useState<string>('')
  const [redirectError, setRedirectError] = useState<string>('')
  const [copiado, setCopiado] = useState(false)

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
      const Url = `${AMBIENTE[ambiente]}/${btoa(token)}/redirect-uri/${btoa(redirectOk)}/redirect-error/${btoa(redirectError)}`
      if (uid.length > 0 || app.length > 0) {
        return `${Url}/uid/${btoa(uid)}/app/${btoa(app)}/ip-client/${btoa(ipClient)}`
      }
      return Url
    }
  }
  const copiarAlPortapapeles = () => {
    const urlGenerada = generarUrl()
    navigator.clipboard.writeText(urlGenerada)
      .then(() => {
        setCopiado(true)
        setTimeout(() => {
          setCopiado(false)
        }, 2000) // Ocultar el mensaje después de 2 segundos
      })
      .catch((err) => {
        console.error('Error al copiar al portapapeles: ', err)
      })
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
  const handleUid = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUid(event.target.value)
  }
  const handleApp = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApp(event.target.value)
  }
  const handleIpClient = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIpClient(event.target.value)
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
        <div className="max-w-[1280px] mx-auto p-8 text-center">

    <div className='container'>
      <h1 className=' text-4xl  '>Generar URL</h1>
      <div className='flex '>
        <div className='bg-blue-100  h-40 min-w-full break-words overflow-auto p-2'>{generarUrl()}</div>
        <div className='relative'>
        <button onClick={copiarAlPortapapeles} className='bg-yellow-100 min-h-full hover:bg-yellow-500'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
          </svg>
        </button>
        {copiado && <span className="absolute -right-4 -top-4 bg-green-500 text-white p-2 rounded-md ">Copiado</span>}
        </div>
      </div>
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
        <hr></hr>
        <hr></hr>
        <FlexContainer isInput={true} name='uid' resultado={encoded64(uid)} isOk={uid.length > 0}>
          <input id="redirectError" className="border p-2 rounded-md focus:outline-none focus:border-blue-300" placeholder='Ingrese su uid' onChange={handleUid}/>
        </FlexContainer>
        <FlexContainer isInput={true} name='app' resultado={encoded64(app)} isOk={uid.length > 0}>
          <input id="redirectError" className="border p-2 rounded-md focus:outline-none focus:border-blue-300" placeholder='Ingrese su App' onChange={handleApp}/>
        </FlexContainer>
        <FlexContainer isInput={true} name='ipClient' resultado={encoded64(ipClient)} isOk={ipClient.length > 0}>
          <input id="redirectError" className="border p-2 rounded-md focus:outline-none focus:border-blue-300" placeholder='Ingrese su App' onChange={handleIpClient}/>
        </FlexContainer>

      </div>

    </div>
    </div>
  )
}

export default App
