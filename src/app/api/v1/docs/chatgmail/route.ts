import { NextRequest, NextResponse } from 'next/server'
import getCurrentUser from '@/client/actions/getCurrentUser'

export const dynamic = 'force-dynamic'

const sentNotifications = new Set<string>();

export async function POST(request: NextRequest) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (sentNotifications.has(currentUser.id)) {
        return NextResponse.json({ message: 'Notification already sent' }, { status: 200 });
    }

    const cleanedPhoneNumber = currentUser.phoneNumber?.replace(/\s+/g, '');
    const contact = {
        id: currentUser.id,
        first_name: currentUser.firstName,
        last_name: currentUser.lastName,
        phone_number: cleanedPhoneNumber,
        email: currentUser.email,
        picture: currentUser.image,
        date_of_birth: '1981-16-11',
        city_name: 'Mexico City',
    };

  const notification = {
    title: 'Completa tu proceso de registro',
    channel: 'email',
    template: {
      name: 'uber_onboardiang',
      parameters: [
        {
          type: 'text',
          text: `${contact.first_name} ${contact.last_name}`,
        },
        {
          type: 'text',
          text: 'https://play.google.com/store/apps/details?id=com.dvalic.appautofin&pcampaignid=web_share',
        },
        {
          type: 'text',
          text: 'https://apps.apple.com/lu/app/rhcontigo-gam/id1620090804',
        },
      ],
    },
    content: 'Hola Autofin Rent!',
  }

    try {
        const response = await fetch(`${process.env.CHATWOOT_V1_URL}/notification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contact, notification }),
        });

        if (response.ok) {
            sentNotifications.add(currentUser.id);
            return NextResponse.json({ message: 'Notification sent successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Failed to send notification' }, { status: response.status });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}
