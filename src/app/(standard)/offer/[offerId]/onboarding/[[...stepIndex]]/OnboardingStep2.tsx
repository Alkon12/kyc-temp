'use client'

import { MapPinIcon } from '@heroicons/react/24/solid'
import Label from '@/components/Label'
import React, { FC } from 'react'
import ButtonSecondary from '@/components/ButtonSecondary'
import Select from '@/components/Select'
import FormItem from './FormItem'
import Checkbox from '@/components/Checkbox'
import { IUser } from '@type/IUser'
import { IOffer } from '@type/IOffer'

export interface OnboardingStep2Props {
  currentUser: IUser
  offer: IOffer
}

const OnboardingStep2: FC<OnboardingStep2Props> = () => {
  const renderRadio = (name: string, id: string, label: string, defaultChecked?: boolean) => {
    return (
      <div className="flex items-center">
        <input
          defaultChecked={defaultChecked}
          id={id + name}
          name={name}
          type="radio"
          className="focus:ring-primary-500 h-6 w-6 text-primary-500 border-neutral-300 !checked:bg-primary-500 bg-transparent"
        />
        <label htmlFor={id + name} className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-semibold">Tu ubicación</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        <ButtonSecondary>
          <MapPinIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
          <span className="ml-3">Usar ubicación actual</span>
        </ButtonSecondary>

        {/* ITEM */}
        <FormItem label="Estado">
          <Select>
            <option value="Jalisco">Jalisco</option>
            <option value="Michoacán">Michoacán</option>
            <option value="Chiapas">Chiapas</option>
            <option value="Yucatan">Yucatan</option>
            <option value="Guerrero">Guerrero</option>
            <option value="...">...</option>
          </Select>
        </FormItem>

        {/* ITEM */}
        <div>
          <label className="text-lg font-semibold" htmlFor="">
            Detalles adicionales
          </label>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            <Checkbox label="Poseo registro profesional" name="Poseo registro profesional" defaultChecked />
            <Checkbox label="Tengo discapacidad" name="Tengo discapacidad" />
            <Checkbox label="Es para trabajo parcial" name="Es para trabajo parcial" />
          </div>
        </div>

        {/* ITEM */}
        <div>
          <label className="text-lg font-semibold" htmlFor="">
            Horario deseado
          </label>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {renderRadio('Schedule', 'morning', 'Mañana')}
            {renderRadio('Schedule', 'afternoon', 'Tarde', true)}
            {renderRadio('Schedule', 'night', 'Noche')}
          </div>
        </div>

        {/* ITEM */}
        <div>
          <label className="text-lg font-semibold" htmlFor="">
            Horario deseado
          </label>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {renderRadio('Schedule2', 'morning', 'Mañana', true)}
            {renderRadio('Schedule2', 'afternoon', 'Tarde')}
            {renderRadio('Schedule2', 'night', 'Noche')}
          </div>
        </div>

        <div>
          <Label>Detalles</Label>
          <span className="block mt-1 text-sm text-neutral-500 dark:text-neutral-400">1110 Autofin, Mexico</span>
        </div>
      </div>
    </>
  )
}

export default OnboardingStep2
