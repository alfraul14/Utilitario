import React, { useState } from 'react'

import './index.css'
export default function Sso () {
  const [dni, setDni] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (dni.trim() === '' && dni.length < 8) {
      alert('Por favor, ingrese su DNI')
      return
    }
    const dniB64 = btoa(dni)
    console.log(dniB64)

    const url = `https://pacificociab2cdes03.b2clogin.com/pacificociab2cdes03.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_IMPERSONATION&client_id=f0f037ec-3c54-44e1-837d-b204fdff9a1c&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fjwt.ms&scope=openid&response_type=id_token&prompt=login&tokenDocument=${dniB64}`
    console.log(url)
    window.open(url, '_blank')
  }

  return (
    <div className="w-screen h-screen bg-[#002776] flex items-center justify-center flex-col">
      <h1 className='text-3xl text-white uppercase pb-6'>Esto claramente es una zona segura de WCP</h1>
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm text-center mx-4">
        <h1 className="text-2xl font-semibold mb-6 text-[#002776]">Bienvenido a WCP</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={dni}
            onChange={(e) => { setDni(e.target.value) }}
            placeholder="Ingrese su DNI"
            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff6f00]"
          />
          <button
            type="submit"
            className="w-full bg-[#ff6f00] hover:bg-[#e65c00] text-white font-semibold py-2 px-4 rounded-md transition"
          >
            SSO con Pacífico
          </button>
        </form>
      </div>
    </div>
  )
}
