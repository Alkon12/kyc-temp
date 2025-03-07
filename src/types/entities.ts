import { Person } from "@api/graphql/app.schema.gen";
import { PersonRegis } from "@api/graphql/app.schema.gen";
import { ParamDetail, ParamHeader, Slot } from "@prisma/client";

export type IParamHeader = Omit<ParamHeader, 'createdAt' | 'paramDetails'> & {
  createdAt: string
  paramDetails: IParamDetail[]
}

export type IParamDetail = Omit<ParamDetail, 'createdAt'> & {
  createdAt: string
}


export type IPerson = Omit<
  Person,
  "createdAt" 
> & {
  createdAt: string;
};

export type IPersonRegis = Omit<
  PersonRegis,
  "createdAt" 
> & {
  createdAt: string;
};
