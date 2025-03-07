'use client'

import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'
import { PathName } from '@/types/next-route'
import Link from 'next/link'

interface SolutionItem {
  name: string
  description: string
  href: PathName
  icon: any
  active?: boolean
}

interface DropdownMainMenuProps {
  className?: string
}

const solutions: SolutionItem[] = [
  {
    name: 'Conductores',
    description: 'Usa un 0km para conducir',
    href: '/',
    active: true,
    icon: IconOne,
  },
  {
    name: 'Autofin Automotriz',
    description: 'El grupo automotriz',
    href: '/',
    icon: IconTwo,
  },
  {
    name: 'Grupo Autofin',
    description: 'El grupo automotriz',
    href: '/',
    icon: IconThree,
  },
  {
    name: 'Cómo funciona?',
    description: 'Cómo funciona la relación Uber/Autofin',
    href: '/',
    icon: IconFour,
  },
]

const DropdownMainMenu: React.FC<DropdownMainMenuProps> = ({ className = '' }) => {
  return (
    <Popover className={`DropdownMainMenu relative flex ${className}`}>
      {({ open, close }) => (
        <>
          <Popover.Button className="flex items-center text-white">
            <span>Menu</span>
            <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-40 w-screen max-w-xs px-4 top-full transform -translate-x-1/2 left-1/2 sm:px-0">
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid grid-cols-1 gap-7 bg-white dark:bg-neutral-800 p-7 ">
                  {solutions.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => close()}
                      className={`flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${
                        item.active ? 'bg-neutral-100 dark:bg-neutral-700' : ''
                      }`}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-primary-50 rounded-md text-primary-500 sm:h-12 sm:w-12">
                        <item.icon aria-hidden="true" />
                      </div>
                      <div className="ml-4 space-y-0.5">
                        <p className="text-sm font-medium ">{item.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-300">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* FOOTER */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-700">
                  <Link
                    href="/"
                    className="flow-root px-2 py-2 space-y-0.5 transition duration-150 ease-in-out rounded-md focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                  >
                    <span className="flex items-center">
                      <span className="text-sm font-medium ">Documentación</span>
                    </span>
                    <span className="block text-sm text-gray-500 dark:text-neutral-400">
                      Toda la información que necesitas, en detalle
                    </span>
                  </Link>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

export default DropdownMainMenu

function IconFour() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* SVG paths */}
    </svg>
  )
}

function IconTwo() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* SVG paths */}
    </svg>
  )
}

function IconThree() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* SVG paths */}
    </svg>
  )
}

function IconOne() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* SVG paths */}
    </svg>
  )
}
