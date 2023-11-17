interface PropsFlexContainer {
  resultado: string
  children: JSX.Element | JSX.Element[]
  name: string
  isOk: boolean
  isInput?: boolean
}
export const FlexContainer = ({ name, resultado, children, isOk, isInput = false }: PropsFlexContainer) => {
  return (
    <div className="flex flex-row gap-4 items-center mt-4 p-2 ">
          <div className='basis-1/3'>
            <label htmlFor={name} className='pr-2'>{isInput ? 'Ingrese su' : 'Selecciona un'} {name}:</label>
            {children}
          </div>
          <div className='basis-1/2 overflow-hidden'>
            <p className="whitespace-no-wrap overflow-ellipsis" title={resultado}>
                {resultado}
            </p>
          </div>
          <div className={`${isOk ? 'bg-blue-100' : 'bg-yellow-100'} p-2 rounded-full mx-auto`}>
                {isOk
                  ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="blue" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                }
            </div>

        </div>
  )
}
