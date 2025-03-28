import { NextApiRequest, NextApiResponse } from 'next';
import { Config } from '../../../public/Config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, errorMessage: 'Method not allowed' });
  }

  try {
    const { 
      idScan,
      sessionId,
      externalDatabaseRefID,
      minMatchLevel,
      idScanFrontImage,
      idScanBackImage
    } = req.body;

    if (!idScan || !sessionId || !externalDatabaseRefID || !minMatchLevel) {
      return res.status(400).json({ 
        error: true, 
        errorMessage: 'Missing required parameters' 
      });
    }

    const parameters: any = {
      idScan,
      sessionId,
      externalDatabaseRefID,
      minMatchLevel
    };

    // Agregar imágenes opcionales si están presentes
    if (idScanFrontImage) {
      parameters.idScanFrontImage = idScanFrontImage;
    }

    if (idScanBackImage) {
      parameters.idScanBackImage = idScanBackImage;
    }

    const response = await fetch(`${Config.BaseURL}/match-3d-2d-idscan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Key': Config.DeviceKeyIdentifier,
        'X-Token-Authentication': Config.xTokenAuthentication,
        'X-User-Agent': req.headers['x-user-agent'] as string,
      },
      body: JSON.stringify(parameters)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error in match-3d-2d-idscan endpoint:', error);
    return res.status(500).json({ 
      error: true, 
      errorMessage: 'Internal server error' 
    });
  }
}
