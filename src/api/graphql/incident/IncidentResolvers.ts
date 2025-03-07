import { inject, injectable } from 'inversify'
import IncidentSmartItService from '@domain/incident/IncidentSmartItService'
import { DI } from '@infrastructure'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { QueryGetIncidentsByContractArgs, MutationCreateIncidentArgs } from '../app.schema.gen'
//import { IncidentEntity } from "@domain/incident/IncidentEntity";
import { IncidentInput, IncidentFilesInput } from '@domain/incident/IncidentSmartItService'

@injectable()
export class IncidentResolvers {
  constructor(
    @inject(DI.IncidentApi)
    private readonly incidentApi: IncidentSmartItService,
  ) {}

  build() {
    return {
      Query: {
        getIncidentsByContract: this.getIncidentsByContract,
      },
      Mutation: {
        createIncident: this.createIncident,
      },
    }
  }

  private getIncidentsByContract = async (
    _parent: unknown,
    { contractId }: QueryGetIncidentsByContractArgs,
  ): Promise<any> => {
    const result = await this.incidentApi.getIncidentsByContract(new NumberValue(contractId))
    if (result) {
      return result.map((r) => r.toDTO())
    }

    return null
  }

  private createIncident = async (
    _parent: unknown,
    { idsmartIt, contractId, incident }: MutationCreateIncidentArgs,
  ): Promise<any> => {
    const incidentInput: IncidentInput = {
      uberItemId: new NumberValue(incident.uberItemId),
      amount: new NumberValue(incident.amount),
      date: incident.date ? new StringValue(incident.date) : undefined,
      comments: incident.comments ? new StringValue(incident.comments) : undefined,
      files: incident.files
        ? incident.files.map<IncidentFilesInput>((f) => {
            return {
              filename: new StringValue(f.filename),
              content: new StringValue(f.content),
            }
          })
        : undefined,
    }

    const result = await this.incidentApi.createIncident(
      new StringValue(idsmartIt),
      new NumberValue(contractId),
      incidentInput,
    )
    if (result) {
      return result.toDTO()
    }
    return null
  }
}
