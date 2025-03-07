import { ListingGalleryImage } from '@/components/listing-image-gallery/utils/types'
import carUtilities1 from '@/images/carUtilities/1.png'
import carUtilities2 from '@/images/carUtilities/2.png'
import carUtilities3 from '@/images/carUtilities/3.png'
import carUtilities4 from '@/images/carUtilities/4.png'
import carUtilities5 from '@/images/carUtilities/5.png'
import carUtilities6 from '@/images/carUtilities/6.png'
import carUtilities7 from '@/images/carUtilities/7.png'
import carUtilities8 from '@/images/carUtilities/8.png'

export const PHOTOS: string[] = [
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COH_MY24_0001_V002_sq8asgbHCM2G3.png?wid=2000&fmt=jpg&fit=crop',
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COH_MY24_0011_V002_4VABJ7gOYrHNLyu5_5C.png?wid=2000&fmt=jpg&fit=crop',
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COH_MY24_0004_V001_sJ65JQW7Bo2e8bvCBfUXn5_TKnfCWT.png?wid=2000&fmt=jpg&fit=crop',
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COR_MY23_0004_V001_FQREvz6fZ6dCKA6Wya.png?wid=2000&fmt=jpg&fit=crop',
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COR_MY23_0013_V001_kExpy1c5S0ZsXeEm9ct.png?wid=2000&fmt=jpg&fit=crop',
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COH_MY23_0005_V002.png?wid=2000&fmt=jpg&fit=crop',
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COR_MY23_0016_V001_jAoiZYJdJyPSTS.png?wid=2000&fmt=jpg&fit=crop',
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COH_MY23_0008_V001_lsxXsv5FJ6Bw.png?wid=2000&fmt=jpg&fit=crop',
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COR_MY23_0005_V001_nRuOM83Kk9Z.png?wid=2000&fmt=jpg&fit=crop',
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COH_MY23_0003_V003.png?wid=2000&fmt=jpg&fit=crop',
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COH_MY23_0025_V001_Gt5SKQ8URlIcN.png?wid=2000&fmt=jpg&fit=crop',
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COR_MY23_0019_V001_wWNu1EJhUJFthHpvFIjh09L.png?wid=2000&fmt=jpg&fit=crop',
  'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/vehicles/2024/corolla/gallery/COH_MY23_0007_V002_h3Guwfl5Oetwqh6yCjxH3GgQiby7Z5.png?wid=2000&fmt=jpg&fit=crop',
]

export const includes_demo = [
  { name: 'El tiempo de contrato es de 6 meses' },
  { name: 'Se hacen mantenimientos obligatorios una vez al mes' },
  { name: 'El seguro requerido es todo riesgo con franquicia de 5%' },
  { name: 'No puede usarse para viajar al exterior' },
  {
    name: 'Se controlará el tipo de manejo con un dispositivo interno',
  },
  { name: 'No puede prestarde a un 3ro' },
]

export const Amenities_demos = [
  { name: '10 Kmts/litro', icon: carUtilities1 },
  {
    name: 'Sensores de proximidad',
    icon: carUtilities2,
  },
  { name: 'Modo de consumoe ', icon: carUtilities3 },
  { name: 'Encendido con control remoto', icon: carUtilities4 },
  { name: 'Pantalla central de 8 pulgadas', icon: carUtilities5 },
  { name: 'Control crusero', icon: carUtilities6 },
  { name: 'Luces diurnas automáticas', icon: carUtilities7 },
  { name: 'Alerta de punto ciego de espejo', icon: carUtilities8 },
]

export const imageGallery: ListingGalleryImage[] = [...PHOTOS].map((item, index): ListingGalleryImage => {
  return {
    id: index,
    url: item,
  }
})
