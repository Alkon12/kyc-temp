import { NextApiRequest, NextApiResponse } from 'next';
import { Config } from '../../../public/Config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, errorMessage: 'Method not allowed' });
  }

  try {
    const { faceScan, auditTrailImage, lowQualityAuditTrailImage, sessionId } = req.body;

    if (!faceScan || !sessionId) {
      return res.status(400).json({ 
        error: true, 
        errorMessage: 'Missing required parameters' 
      });
    }

    // Hacer la llamada al API de FaceTec
    const response = await fetch(`${Config.BaseURL}/liveness-3d`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Token-Authentication': Config.xTokenAuthentication,
        'X-Device-Key': Config.DeviceKeyIdentifier,
        'X-User-Agent': req.headers['x-user-agent'] as string,
      },
      body: JSON.stringify({
        faceScan,
        auditTrailImage,
        lowQualityAuditTrailImage,
        sessionId
      })
    });

    const data = await response.json();

    // Devolver la respuesta del servidor de FaceTec
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error in liveness-3d endpoint:', error);
    return res.status(500).json({ 
      error: true, 
      errorMessage: 'Internal server error' 
    });
  }
}
