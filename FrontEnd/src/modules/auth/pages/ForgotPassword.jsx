import { useState } from 'react';
import side from '../services/auth.service';
import LogoPrefeitura from '@/assets/images/LogoPrefeitura.svg';

export default function ForgotPassword({ onBack }) {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ senhaTemporaria: '', novaSenha: '' });
    const [showModal, setShowModal] = useState(false);
    const [generatedToken, setGeneratedToken] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    async function handleRequest(e) {
        e.preventDefault();
        try {
            const response = await side.post('/api/forgot-password', { email });
            setGeneratedToken(response.data.tokenGerado);
            setIsSuccess(false);
            setShowModal(true);
        } catch (err) {
            alert(err.response?.data?.error || 'Erro ao processar');
        }
    }
    async function handleReset(e) {
        e.preventDefault();
        try {
            await side.put('/api/reset-password', {
                email,
                senhaTemporaria: formData.senhaTemporaria,
                novaSenha: formData.novaSenha
            });
            setIsSuccess(true);
            setShowModal(true);
        } catch (err) {
            alert(err.response?.data?.error || 'Erro ao resetar');
        }
    }

    return (
        <div className="text-white flex flex-col items-center justify-end flex-nowrap h-[99%] w-full px-12">
            <img src={LogoPrefeitura} alt="Logo da Prefeitura Munucipal de São Paulo" />
            <div style={{ padding: '20px' }}>
                {step === 1 ? (
                    <form onSubmit={handleRequest} className='flex flex-col items-start justify-center flex-nowrap w-full py-4 gap-4'>
                        <p className='px-4'>Recuperar Senha</p>
                        <span className='w-full bg-[#EBFAED] h-14 rounded-2xl flex flex-row items-center justify-start px-4 gap-2'>
                            <i style={{ fontSize: "1rem" }} className="fa-solid fa-at text-[#48742c]" />
                            <input type="email" placeholder="E-mail Institucional" onChange={e => setEmail(e.target.value)} required className='w-[90%] flex-1 h-14 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 text-[var(--green-800)] placeholder:text-[#48742c]/60' />
                        </span>
                        <button type="submit" className='w-full bg-[var(--green-100)] h-12 rounded-2xl flex items-center justify-center text-[var(--green-800)] capitalize font-bold'>Enviar</button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className='flex flex-col items-center justify-center flex-nowrap w-full py-4 gap-4'>
                        <h2>Criar Nova Senha</h2>
                        <span className='w-full bg-[#EBFAED] h-14 rounded-2xl flex flex-row items-center justify-start px-4 gap-1'>
                            <input type="text" placeholder="Senha Temporária"
                                onChange={e => setFormData({ ...formData, senhaTemporaria: e.target.value })} autoComplete="off" required className='w-[90%] flex-1 h-14 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 text-[var(--green-800)] placeholder:text-[#48742c]/60' />
                        </span>
                        <span className='w-full bg-[#EBFAED] h-14 rounded-2xl flex flex-row items-center justify-start px-4 gap-1'>
                            <input type="password" placeholder="Nova Senha"
                                onChange={e => setFormData({ ...formData, novaSenha: e.target.value })} autoComplete="off" required className='w-[90%] flex-1 h-14 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 text-[var(--green-800)] placeholder:text-[#48742c]/60' />
                        </span>
                        <button type="submit">Redefinir Senha</button>
                    </form>
                )}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl animate-fadeIn border border-white/20 flex flex-col items-center justify-center">
                            {!isSuccess ? (
                                <>
                                    <h3 className="text-xl font-bold text-[var(--green-800)] mb-2">Recuperação de senha</h3>
                                    <p className="text-gray-700 mb-4 text-sm">Anote sua <strong>senha temporária</strong> abaixo:</p>
                                    <div className="bg-[#EBFAED] border-2 border-dashed border-[var(--green-800)] rounded-xl p-4 mb-6">
                                        <span className="text-3xl font-mono font-bold tracking-widest text-[var(--green-800)]">{generatedToken}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-6">Ela expira em 1 hora. Use-a no próximo passo.</p>
                                    <button onClick={() => { setShowModal(false); setStep(2); }} className="w-full h-12 rounded-2xl bg-[var(--green-100)] text-[var(--green-800)] font-bold hover:brightness-95 transition">CONTINUAR</button>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="fa-solid fa-check text-2xl text-green-600"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--green-800)] mb-2">Senha atualizada!</h3>
                                    <p className="text-gray-600 mb-8">Utilize sua nova senha para logar no sistema.</p>
                                    <button onClick={() => window.location.href = '/login'} className="w-full h-12 rounded-2xl bg-[var(--green-800)] text-white font-bold hover:opacity-90 transition">IR PARA LOGIN</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <a onClick={onBack} className='text-[var(--accent-mint)] font-light hover:underline'>Voltar para login</a>
        </div>
    );
}