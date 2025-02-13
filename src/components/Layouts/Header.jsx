import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openSidebar } from '../../redux/sidebarSlice';
import { Icon } from '@iconify/react';

export const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user)
  return (
    <div className='bg-white fixed z-10 shadow-sm border border-blueGray-200 flex items-center justify-between py-10 md:py-8 px-8 md:ml-72 right-0 left-0 h-10'>
      <button className='bg-white border px-1 rounded-sm py-0.5 md:hidden' onClick={() => dispatch(openSidebar())}>
        <Icon icon={'ic:baseline-menu'} className='text-2xl' />
      </button>
      <div className='uppercase font-semibold'>
        <h1 className='text-sm text-gray-600 md:hidden'>TNSTC</h1>
        <div className='items-center gap-x-3 hidden md:flex'>
          <Icon icon={'uil:search'} className='text-blueGray-500' />
          <input type='text' className='h-6 text-[13px] font-medium text-blue-200 border-none focus:outline-none placeholder:text-blueGray-300 focus:border-none focus:ring-0' placeholder='Search anything' />
        </div>
      </div>
      <div className='flex justify-center items-center gap-3 md:gap-x-7 text-gray-500'>
        <Icon icon={'ph:chats-bold'} className='text-xl cursor-pointer' />
        <Icon icon={'ph:bell-bold'} className='text-xl cursor-pointer' />
        <div className='flex gap-5 items-center cursor-pointer'>
          <div className="relative">
            <img className="w-10 h-10 md:w-8 md:h-8 rounded-full p-0.5 ring-2 ring-blueGray-300" src={user ? user?.profilePicture : 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg'} alt=""></img>

          </div>
          <div className='hidden md:flex items-end gap-2 leading-none'>
            <div>
              <p className='text-[11.5px] m-0 mb-0.5 p-0 text-purple-500 font-semibold tracking-tight capitalize'>
                {user?.role[0].toUpperCase() + user?.role.slice(1)}
              </p>

              <p className='font-bold m-0 p-0 text-sm'>{user?.firstName + " " + user?.lastName}</p>
            </div>
            <div>
              <Icon icon={'iconamoon:arrow-down-2-bold'} className='text-md mb-0.5' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

