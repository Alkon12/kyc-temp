import React, { FC } from 'react'
import imgHomeProcessBrief from '@/images/home-process-brief.jpg'
import Image from 'next/image'

export interface HomeHeroProps {}

const HomeHero: FC<HomeHeroProps> = ({}) => {
  return (
    <div className={`nc-HomeHero flex flex-col relative`} data-nc-id="HomeHero">
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex-grow">
          <Image
            className="w-full"
            src={imgHomeProcessBrief}
            alt="hero"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
        </div>
      </div>
    </div>
  )
}

export default HomeHero
