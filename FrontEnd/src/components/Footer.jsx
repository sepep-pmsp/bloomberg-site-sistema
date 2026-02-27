import React from 'react'
import logo from '@/assets/images/LogoPrefeitura.svg'
import bloomberg from '@/assets/images/jhu-bloomberg-footer-lockup.svg'

export default function Footer() {
    return (
        <>
            <footer className='w-full pt-8 bg-[var(--color-primary)] h-screen max-md:w-107 2xl:h-142'>
                <div className='flex flex-col gap-25 w-full py-20' style={{ maxWidth: "1800px", height: "auto", margin: "0 auto" }}>
                    <div className='text-[var(--accent-mint)] flex flex-col 2xl:flex-row justify-between items-center gap-8'>
                        <img src={logo} alt="" />
                        <div className='flex 2xl:items-end flex-col'>
                            <h4 className='!text-xl pb-8'>contatos:</h4>
                            <div className='flex flex-col flex-nowrap 2xl:items-end gap-8'>
                                <span className='!text-base flex flex-row items-center 2xl:justify-end gap-5'>
                                    <p>Viaduto do Chá, 15 - Centro Histórico <br /> de São Paulo - SP, 01007-040</p>
                                    <i className="fa-solid fa-location-dot !text-xl text-white relative bottom-1"></i>
                                </span>
                                <span className='!text-base flex flex-row items-center 2xl:justify-end gap-5'>
                                    <p>(11) 3113-8000</p>
                                    <i className="fa-solid fa-phone !text-xl text-white"></i>
                                </span>
                            </div>
                        </div>

                    </div>
                    <div className='text-[var(--accent-mint)] flex flex-col 2xl:flex-row justify-between items-center gap-8 lg:gap-0'>
                        <span className=' flex flex-col gap-7 items-start'>
                            <h4 className='text-[var(--accent-mint)] !text-xl'>Em Parceria com:</h4>
                            <img src={bloomberg} alt="" className='2xl:relative 2xl:right-0 max-md:w-90' />
                        </span>
                        <div className='flex items-end flex-col'>
                        <h4 className='!text-xl pb-8'>Nos siga em nossas redes</h4>
                        <span className='flex flex-row gap-10'>
                            <a href=""><i className="fa-brands fa-facebook-f text-white 2xl:!text-5xl"></i></a>
                            <a href=""><i className="fa-brands fa-youtube    text-white 2xl:!text-5xl"></i></a>
                            <a href=""><i className="fa-brands fa-x-twitter  text-white 2xl:!text-5xl"></i></a>
                            <a href=""><i className="fa-brands fa-instagram  text-white 2xl:!text-5xl"></i></a>
                        </span>
                    </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
