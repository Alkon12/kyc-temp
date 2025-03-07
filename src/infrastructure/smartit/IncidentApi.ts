import { NotImplementedError } from '@domain/error'
import { IncidentEntity } from '@domain/incident/IncidentEntity'
import { IncidentFactory, IncidentSmartItResponse } from '@domain/incident/IncidentFactory'
import IncidentSmartItService, { IncidentInput } from '@domain/incident/IncidentSmartItService'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { injectable } from 'inversify'

@injectable()
export class IncidentApi implements IncidentSmartItService {
  private readonly API_INCIDENT_URL: string = `${process.env.NEXT_PUBLIC_URL_SMARTIT}incidencia/`

  async getIncidentsByContract(contractId: NumberValue): Promise<IncidentEntity[] | null> {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`,
        },
      }
      const url = `${this.API_INCIDENT_URL}${contractId.toDTO()}`
      const response = await fetch(url, options)
      const incidents = await response.json()

      //const people: Person[] = data.map(item => new Person(item.name, item.age));
      const incidentEntities: IncidentEntity[] = incidents.map((i: IncidentSmartItResponse) =>
        IncidentFactory.fromDTO(i),
      )
      return incidentEntities
      //throw new Error("Method not implemented.");
    } catch (error) {
      console.log('[IncidentApi] (getIncidentsByContract) {error}', error)
      return null
    }
  }

  async createIncident(
    idSmartIT: StringValue,
    contractId: NumberValue,
    incident: IncidentInput,
  ): Promise<IncidentEntity | null> {
    try {
      console.log('{idSmartIT}', idSmartIT)
      console.log('{incident}', incident)
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idSmartIT.toDTO()}`,
        },
        body: JSON.stringify({
          IdConceptoUber: incident.uberItemId.toDTO(),
          Importe: incident.amount.toDTO(),
          FechaIncidencia: incident.date ? incident.date.toDTO() : '',
          FolioIncidencia: '',
          Observaciones: incident.comments ? incident.comments.toDTO() : '',
          NumeroSemana: 0,
          Archivos: incident.files
            ? incident.files.map((f) => {
                return {
                  Contenido: f.content.toDTO(),
                  NombreArchivo: f.filename.toDTO(),
                }
              })
            : [],
        }),
      }
      const url = `${this.API_INCIDENT_URL}registro/${contractId.toDTO()}`
      const response = await fetch(url, options)
      const newIncident = await response.json()

      console.log('{newIncident}', newIncident)

      //const people: Person[] = data.map(item => new Person(item.name, item.age));
      const incidentEntity: IncidentEntity = IncidentFactory.fromDTO(newIncident)
      return incidentEntity
    } catch (error) {
      console.log('[IncidentApi] (createIncident) {error}', error)
      return null
    }
  }
}
