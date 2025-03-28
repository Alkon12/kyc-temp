import { NextApiRequest, NextApiResponse } from 'next';
import { Config } from '../../../public/Config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, errorMessage: 'Method not allowed' });
  }

  try {
    const { 
      faceScan, 
      auditTrailImage, 
      lowQualityAuditTrailImage, 
      sessionId, 
      externalDatabaseRefID 
    } = req.body;

    if (!faceScan || !sessionId || !externalDatabaseRefID) {
      return res.status(400).json({ 
        error: true, 
        errorMessage: 'Missing required parameters' 
      });
    }

    const response = await fetch(`${Config.BaseURL}/enrollment-3d`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Key': Config.DeviceKeyIdentifier,
        'X-Token-Authentication': Config.xTokenAuthentication,
        'X-User-Agent': req.headers['x-user-agent'] as string,
      },
      body: JSON.stringify({
        faceScan,
        auditTrailImage,
        lowQualityAuditTrailImage,
        sessionId,
        externalDatabaseRefID
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error in enrollment-3d endpoint:', error);
    return res.status(500).json({ 
      error: true, 
      errorMessage: 'Internal server error' 
    });
  }
}
