import React, { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IOffer } from '@/types/IOffer'
import { IUser } from '@type/IUser'
import './offer.css'
import { ButtonShared } from '@app/(standard)/components/ButtonShared'

export interface OfferProps {
  offer: IOffer
  currentUser: IUser
}

const Offer: FC<OfferProps> = ({ offer, currentUser }) => {
  const { id, product } = offer

  return (
    <div className="col-lg-3">
      <div className="card h-100 transition-all duration-200 hover:scale-95">
        {' '}
        {/* Agregada la transición */}
        <Link href={`/offer/${id}`} passHref className="text-decoration-none">
          <div className="offer">
            <div className="ratio ratio-16x9">
              <Image
                src={`${product.picture}`}
                alt={`${product.brand} ${product.model}`}
                className="card-img-top object-fit-contain p-4"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
            <div className="card-body p-3">
              <p className="lh-sm">
                <strong>
                  {product.brand} {product.model} {product.year}
                </strong>
              </p>
              <hr />
              <p className="lh-sm mb-0">
                <strong>Semanalidad con IVA, desde</strong>
              </p>
              <div className="d-flex align-items-center">
                <h3 className="verde-rent mb-0">
                  <strong>${offer.weeklyPrice || '0'} MXN</strong>
                </h3>
              </div>
              <hr />
              <div className="text-center">
                <ButtonShared title={'Solicitar Vehículo'} />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Offer
