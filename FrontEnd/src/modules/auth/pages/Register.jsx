import { useState } from 'react';
import side from '../services/auth.service';
import LogoPrefeitura from '@/assets/images/LogoPrefeitura.svg';
import { useNavigate } from 'react-router-dom';

export default function Register({ onBack }) {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    });

    async function handleSubmit(e) {
        e.preventDefault();
        const dadosParaEnviar = {
            ...formData,
            email: formData.email.trim().toLowerCase()
        };
        try {
            const response = await side.post('/api/register', dadosParaEnviar);
            console.log('Usuário criado:', response.data);
            setShowModal(true);
        } catch (err) {
            alert('Erro no cadastro: ' + (err.response?.data?.error || 'Erro desconhecido'));
        }
    }

    return (
        <div className="text-white flex flex-col items-center justify-end flex-nowrap h-[99%] w-full px-12">
            <img src={LogoPrefeitura} alt="Logo da Prefeitura Munucipal de São Paulo" />
            <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center flex-nowrap w-full py-4 gap-4'>
                <span className='w-full bg-[#EBFAED] h-12 rounded-2xl flex flex-row items-center justify-start px-4 gap-2'>
                    <i style={{ fontSize: "1rem" }} className="fa-solid fa-user text-[#48742c]" />
                    <input type="text" placeholder="Nome Completo" onChange={e => setFormData({ ...formData, nome: e.target.value })} required className='w-[90%] flex-1 h-14 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 text-[var(--green-800)] placeholder:text-[#48742c]/60' />
                </span>
                <span className='w-full bg-[#EBFAED] h-12 rounded-2xl flex flex-row items-center justify-start px-4 gap-2'>
                    <i style={{ fontSize: "1rem" }} className="fa-solid fa-at text-[#48742c]" />
                    <input type="email" id='email' placeholder="E-mail Institucional" onChange={e => setFormData({ ...formData, email: e.target.value })} required className='w-[90%] flex-1 h-14 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 text-[var(--green-800)] placeholder:text-[#48742c]/60' />
                </span>
                <span className='w-full bg-[#EBFAED] h-12 rounded-2xl flex flex-row items-center justify-start px-4 gap-2'>
                    <i style={{ fontSize: "1rem" }} className="fa-solid fa-lock text-[#48742c]"></i>
                    <input type="password" placeholder="Senha" autoComplete="off" onChange={e => setFormData({ ...formData, senha: e.target.value })} required className='w-[90%] flex-1 h-14 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 text-[var(--green-800)] placeholder:text-[#48742c]/60' />
                </span>
                <span className='w-full bg-[#EBFAED] h-12 rounded-2xl flex flex-row items-center justify-start px-4 gap-2'>
                    <i style={{ fontSize: "1rem" }} className="fa-solid fa-lock text-[#48742c]"></i>
                    <input type="password" placeholder="Confirmar Senha" autoComplete="off" onChange={e => setFormData({ ...formData, confirmarSenha: e.target.value })} required className='w-[90%] flex-1 h-14 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 text-[var(--green-800)] placeholder:text-[#48742c]/60' />
                </span>
                <button type="submit" className='w-full bg-[var(--green-100)] h-14 rounded-2xl flex items-center justify-center text-[var(--green-800)] capitalize font-bold'>criar conta</button>
            </form>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-green-50 rounded-3xl p-8 max-w-md w-full text-center shadow-xl animate-fadeIn border border-white/20 flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-bold mb-4 text-[var(--green-800)]">Cadastro Bem-Sucedido!</h2>
                        <p className="mb-6 text-[var(--green-800)]">Seu cadastro foi realizado com sucesso.</p>
                        <button onClick={() => navigate('/metodologia', { replace: true })} className="w-full h-12 rounded-2xl bg-[var(--green-800)] text-white font-bold hover:opacity-90 transition">Acessar</button>
                    </div>
                </div>
            )}
            <a onClick={onBack} className='text-[var(--accent-mint)] font-light hover:underline'>Voltar para login</a>
        </div>
    );
}