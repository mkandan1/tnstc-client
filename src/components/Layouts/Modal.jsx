import React from 'react'
import PageHeader from './PageHeader'
import { twMerge } from 'tailwind-merge'

export const Modal = ({ children, isModalOpen, onButtonClick }) => {
    const buttons = [
        {
            id: 'close-model',
            label: "Close",
            icon: "ep:close-bold"
        }
    ]
    return (
        <div className={twMerge(`${!isModalOpen ? 'opacity-0 -z-10 -translate-y-52' : 'opacity-100 z-50'} transition-all duration-500 shadow-xl bg-white w-full h-full absolute -top-2 bottom-0 left-0 right-0`, 'px-3')}>
            <PageHeader
                title={'Route Creation'}
                buttons={buttons}
                onButtonClick={onButtonClick}
            />
            {children}
        </div>
    )
}
