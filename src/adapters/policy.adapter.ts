import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IPolicyServiceResponse } from './types';

export class PolicyAdapter {
  async getTripPricePerMile(): Promise<number> {
    const options: AxiosRequestConfig = {
      headers: {
        user: JSON.stringify({ email: 'kierancareer@hotmail.com' }),
      },
    };

    const policyServiceResponse: AxiosResponse<IPolicyServiceResponse> =
      await axios.post<IPolicyServiceResponse>(
        process.env.POLICY_URL,
        undefined,
        options,
      );

    const pricePerMile: number = policyServiceResponse.data.pricePerMile;

    return pricePerMile;
  }
}

var policyAdapter: PolicyAdapter;

export const initializePolicyAdapter = () => {
  if (!policyAdapter) {
    policyAdapter = new PolicyAdapter();
  }

  return policyAdapter;
};
