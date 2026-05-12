import { MOCK_HOST_CONTEXT } from './__mocks__/hostContext'

export type BankAccount = {
  id: string
  bankName: string
  currency: string
  accountType: 'Savings' | 'Current'
  accountNumber: string
  maskedLabel: string
  isPrimary?: boolean
}

/**
 * Mock API: list bank accounts available for linking.
 *
 * @remarks
 * Backend API is not available yet, so this returns deterministic mock data.
 * Replace with `fetchWithAuth('/api/v1/...')` when the backend ships.
 */
export async function listBankAccounts(): Promise<BankAccount[]> {
  const accounts: BankAccount[] = [
    {
      id: 'acct-1',
      bankName: 'FCMB',
      currency: 'NGN',
      accountType: 'Savings',
      accountNumber: MOCK_HOST_CONTEXT.primaryAccountNumber,
      maskedLabel: `${MOCK_HOST_CONTEXT.primaryAccountNumber} / NGN / Savings`,
      isPrimary: true,
    },
    {
      id: 'acct-2',
      bankName: 'FCMB',
      currency: 'NGN',
      accountType: 'Current',
      accountNumber: MOCK_HOST_CONTEXT.selectedBankAccountNumber,
      maskedLabel: `${MOCK_HOST_CONTEXT.selectedBankAccountNumber} / NGN / Current`,
    },
    {
      id: 'acct-3',
      bankName: 'FCMB',
      currency: 'USD',
      accountType: 'Current',
      accountNumber: MOCK_HOST_CONTEXT.accountNumber,
      maskedLabel: `${MOCK_HOST_CONTEXT.accountNumber} / USD / Current`,
    },
  ]

  // Small delay to mimic network and show loading UI.
  await new Promise((r) => setTimeout(r, 250))
  return accounts
}

