import React, { useState } from 'react'
import BgLogo from '@/assets/images/bgLogin.svg'
import Vetor from '@/assets/images/VectorBgLogin.svg'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'

export default function AuthPage() {
    const [mode, setMode] = useState('login');
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div>
            <section className="relative w-full overflow-hidden">
                <div className="relative w-full h-screen">
                    <img
                        className="min-h-full w-full object-cover absolute 2xl:-top-60"
                        src={BgLogo}
                        alt="Frota de ônibus elétrico"
                    />
                </div>
                <div className="absolute top-0 left-0 w-full">
                    <img className="w-full" src={Vetor} alt="" />
                </div>
            </section>
            <div className="auth-container card-3d-wrap 2xl:left-40">
                <div className={`card-3d-wrapper ${isFlipped ? 'rotate' : ''}`}>
                    <div className="card-face card-front">
                        <Login onRegister={() => {setMode('register'); setIsFlipped(true);}} onForgot={() => {setMode('forgot');setIsFlipped(true);}}/>
                    </div>
                    <div className="card-face card-back">
                        {mode === 'register' && (
                            <Register
                                onBack={() => {
                                    setIsFlipped(false);
                                    setTimeout(() => setMode('login'), 900);
                                }}
                            />
                        )}
                        {mode === 'forgot' && (
                            <ForgotPassword
                                onBack={() => {
                                    setIsFlipped(false);
                                    setTimeout(() => setMode('login'), 900);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}