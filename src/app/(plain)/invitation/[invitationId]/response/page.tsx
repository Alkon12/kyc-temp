import React, { FC } from 'react'
import getCurrentUser from '@/client/actions/getCurrentUser'
import AcceptInvitation from './AcceptInvitation'

interface Props {
  params: {
    invitationId: string
  }
}

const AcceptInvitationPage: FC<Props> = async ({ params }) => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return false
  }

  return (
    <>
      <h2>Gracias {currentUser.email}! sigue tu proceso con el ejecutivo</h2>
      <AcceptInvitation currentUser={currentUser} invitationId={params.invitationId} />
    </>
  )
}

export default AcceptInvitationPage
