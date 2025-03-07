'use client'

import React, { FC, Fragment, useEffect, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { Box, Container, Grid, IconButton, Typography, useTheme } from '@mui/material'
import LikeSaveBtns from '../LikeSaveBtns'
import { useLastViewedPhoto } from './utils/useLastViewedPhoto'
import type { ListingGalleryImage } from './utils/types'
import { Route } from 'next'

const PHOTOS: string[] = [
  'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
  'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/6438752/pexels-photo-6438752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
]

export const DEMO_IMAGE: ListingGalleryImage[] = PHOTOS.map(
  (item, index): ListingGalleryImage => ({
    id: index,
    url: item,
  }),
)

export const getNewParam = ({ paramName = 'photoId', value }: { paramName?: string; value: string | number }) => {
  let params = new URLSearchParams(document.location.search)
  params.set(paramName, String(value))
  return params.toString()
}

interface Props {
  images?: ListingGalleryImage[]
  onClose?: () => void
  isShowModal: boolean
}

const ListingImageGallery: FC<Props> = ({ images = DEMO_IMAGE, onClose, isShowModal }) => {
  const searchParams = useSearchParams()
  const photoId = searchParams?.get('photoId')
  const router = useRouter()
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()
  const theme = useTheme()
  const lastViewedPhotoRef = useRef<HTMLDivElement>(null)
  const thisPathname = usePathname()

  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: 'center' })
      setLastViewedPhoto(null)
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto])

  const handleClose = () => {
    onClose && onClose()
  }

  const renderContent = () => (
    <Container>
      <Grid container spacing={2}>
        {images.map(({ id, url }) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={id}
            onClick={() => {
              const newPathname = getNewParam({ value: id })
              let params = new URLSearchParams(document.location.search)
              router.push(`${thisPathname}/?${params.toString()}` as Route)
            }}
            ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
          >
            <Box position="relative" borderRadius={2} overflow="hidden">
              <Image
                alt={`photo ${id}`}
                className="transform brightness-90 transition-all group-hover:brightness-110"
                style={{ transform: 'translate3d(0, 0, 0)' }}
                src={url}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 350px"
              />
              <Box
                position="absolute"
                sx={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  opacity: 0,
                  '&:hover': { opacity: 1 },
                  transition: 'opacity 0.3s',
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  )

  return (
    <>
      <Transition appear show={isShowModal} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Box className="fixed inset-0 bg-white" />
          </Transition.Child>

          <Box className="fixed inset-0 overflow-y-auto">
            <Box className="sticky z-10 top-0 p-4 xl:px-10 flex items-center justify-between bg-white">
              <IconButton onClick={handleClose} sx={{ color: theme.palette.primary.main }}>
                <ArrowBackIcon />
              </IconButton>
              <LikeSaveBtns />
            </Box>

            <Box className="flex min-h-full items-center justify-center sm:p-4 pt-0 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-5"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-5"
              >
                <Dialog.Panel className="w-full max-w-screen-lg mx-auto transform p-4 pt-0 text-left transition-all ">
                  {renderContent()}
                </Dialog.Panel>
              </Transition.Child>
            </Box>
          </Box>
        </Dialog>
      </Transition>
    </>
  )
}

export default ListingImageGallery
