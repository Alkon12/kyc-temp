'use client'

import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

interface InputProps {
  id: string
  label: string
  type?: string
  disabled?: boolean
  formatPrice?: boolean
  required?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
}

const Input: React.FC<InputProps> = ({ id, label, type = 'text', disabled, register, required, errors }) => {
  return (
    <div className="w-full relative">
      {errors && <h3>{errors.root?.message}</h3>}
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder={label}
        type={type}
        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-white outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>
  )
}

export default Input
