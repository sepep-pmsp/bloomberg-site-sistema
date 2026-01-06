import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import LogoPrefeitura from '@/assets/images/LogoPrefeitura.svg';

export default function Login({ onRegister, onForgot }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await login(email, password);
            alert('Logado com sucesso!');
            window.location.href = '/metodologia';
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            alert('Erro ao logar');
        }
    }
    return (
        <div className="text-white flex flex-col items-center justify-end flex-nowrap h-[99%] w-full px-12">
             <img src={LogoPrefeitura} alt="Logo da Prefeitura Munucipal de São Paulo"/>
            <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center flex-nowrap w-full py-4 gap-4'>
                <span className='w-full bg-[#EBFAED] h-14 rounded-2xl flex flex-row items-center justify-start px-4 gap-2'>
                    <i style={{ fontSize: "1.5rem" }} className="fa-solid fa-user text-[#48742c]" />
                    <input type="email" onChange={e => setEmail(e.target.value)} className='w-[90%] flex-1 h-14 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 text-[var(--green-800)] placeholder:text-[#48742c]/60'/>
                </span>
                <span className='w-full bg-[#EBFAED] h-14 rounded-2xl flex flex-row items-center justify-start px-4 gap-2'>
                    <i style={{ fontSize: "1.5rem" }} className="fa-solid fa-lock text-[#48742c]"></i>
                    <input type="password" autoComplete="on" onChange={e => setPassword(e.target.value)} className='w-[90%] flex-1 h-14 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 text-[var(--green-800)] placeholder:text-[#48742c]/60'/>
                </span>
                <a onClick={onForgot} rel="noopener noreferrer" className='cursor-pointer text-end w-full text-[var(--accent-mint)] hover:underline'>Esqueceu sua senha?</a>
            </form>
            <button type="submit" className='w-full bg-[var(--green-100)] h-14 rounded-2xl flex items-center justify-center text-[var(--green-800)] capitalize font-bold'>login</button>
            <a onClick={onRegister} className='text-[var(--accent-mint)] font-light hover:underline pt-2'>Não tem cadastro? <span style={{ fontWeight: "bold" }}>Cadastre-se</span></a>
        </div>
    );
}