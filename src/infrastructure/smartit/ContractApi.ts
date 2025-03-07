import { injectable } from 'inversify';
import fetch from 'node-fetch';
import { ContractEntity } from '@domain/contract/ContractEntity';
import ContractRepository from '@domain/contract/ContractRepository';
import { ContractFactory } from '@domain/contract/ContractFactory';
import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
import { ContractSigningEntity } from '@domain/contractSigning/ContractSigningEntity'
import { ContractSigningFactory } from '@domain/contractSigning/ContractSigningFactory'

@injectable()
export class ContractApi implements ContractRepository {
    private prisma: PrismaClient
    private readonly URL: string

    constructor() {
        this.prisma = new PrismaClient();
        this.URL = `${process.env.NEXT_PUBLIC_URL_SMARTIT}contratos`;
    }

    async generateContract(idsmartIt: string, IdCotizacion: string, contractDate: Date, deliveryLocationId: number): Promise<ContractEntity | null> {
        //const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}contratos`;

        const formattedDate = format(contractDate, 'yyyy-MM-dd HH:mm:ss');

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idsmartIt}`
            },
            body: JSON.stringify({
                IdCotizacion: parseInt(IdCotizacion, 10),
                FechaEntrega: formattedDate,
                IdUbicacion: deliveryLocationId
            })
        };

        const response = await fetch(this.URL, options);
        const result: any = await response.json();

        if (result.Message) {
            throw new Error(result.Message);
        }

        await this.updateContractIdAndDate(IdCotizacion, result.NoContrato, contractDate);
        //await this.updateContractIdAndDate(IdCotizacion, result.id, contractDate);

        return ContractFactory.fromDTO({
            Id: result.NoContrato,
            IdAgencia: 0,
            RutaContrato: result.RutaContrato,
            RutaReferenciaBancaria: result.RutaReferenciaBancaria,
            RutaCartaEntrega: result.RutaCartaEntrega,
            FolioPoliza: result.FolioPoliza,
            ReferenciaBancaria: result.ReferenciaBancaria,
            EstatusContrato: 1,
            FechaInicioContrato: (new Date()).toISOString(),
            FechaTerminoContrato: undefined,
            FechaEntregaUnidad: undefined,
            NumeroSemanas: 0,
            Semanalidad: 0,
            TasaInteres: 0,
            IdCliente: 0,
            UbicacionEntrega: undefined
        });
    }

    async getById(contractId: number): Promise<ContractEntity | null> {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
            }
        }

        const response = await fetch(`${this.URL}/${contractId}`, options)
        const result = await response.json()

        if(!result) return null

        const contractEntity = ContractFactory.fromDTO(result)
        return contractEntity

    }

    async sign(idsmartIt: string, contractId: number): Promise<ContractSigningEntity | null> {
        //const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}contrato/firmar`;
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idsmartIt}`
            },
        };

        const response = await fetch(`${this.URL}/${contractId}/firmar`, options);
        const result = await response.json();
        if (result && result.Message) {
            throw new Error(result.Message || 'Error signing contract');
        }

        return ContractSigningFactory.fromDTO(result);
    }

    private async updateContractIdAndDate(idCotizacion: string, contractId: string, contractDate: Date): Promise<void> {
        try {
            const updateResult = await this.prisma.application.updateMany({
                where: { quoteSmartItId: idCotizacion },
                data: {
                    contractId: contractId,
                    contractDate: contractDate
                },
            });

            if (updateResult.count === 0) {
                throw new Error('No applications found for the given quoteSmartItId');
            }
        } catch (error) {
            console.error('Error updating contractId and contractDate:', error);
            throw error;
        }
    }
}
