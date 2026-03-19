
interface Transaction {
  id: string
  name: string
  adminName: string
  date: string
  amount: string
  initial: string
  color: string
  type: 'credit' | 'debit'
  status: 'billed' | 'unbilled'
  paymentStatus: 'success' | 'pending' | 'failed'
}


// Category colors mapping
const CATEGORY_COLORS = {
  cloud: 'bg-orange',      // Google Cloud, Amazon
  streaming: 'bg-black',   // Netflix, Spotify, ChatGPT
  finance: 'bg-zinc-500',  // Refunds, Bank Transfers, Salary
  other: 'bg-blue-500'     // Everything else
}

export const TRANSACTION_HISTORY_DATA: Transaction[] = [
  {
    id: '1',
    name: 'Google Cloud',
    adminName: 'John Doe',
    date: 'Jan 01 , 2025 | 8:00 PM',
    amount: '+ N 23,670',
    initial: 'G',
    color: CATEGORY_COLORS.cloud,
    type: 'credit',
    status: 'billed',
    paymentStatus: 'success'
  },
  {
    id: '2',
    name: 'Amazon',
    adminName: 'Jane Smith',
    date: 'Nov 30, 2024 | 8:45 PM',
    amount: '+ N 72,107',
    initial: 'A',
    color: CATEGORY_COLORS.cloud,
    type: 'credit',
    status: 'billed',
    paymentStatus: 'success'
  },
  {
    id: '3',
    name: 'Salary Deposit',
    adminName: 'HR Department',
    date: 'Nov 24, 2024 | 9:45 PM',
    amount: '- N 550,000',
    initial: 'S',
    color: CATEGORY_COLORS.finance,
    type: 'debit',
    status: 'unbilled',
    paymentStatus: 'pending'
  },
  {
    id: '4',
    name: 'Chatgpt',
    adminName: 'Mike Johnson',
    date: 'Nov 24, 2024 | 9:45 PM',
    amount: '- N 55,000',
    initial: 'C',
    color: CATEGORY_COLORS.streaming,
    type: 'debit',
    status: 'unbilled',
    paymentStatus: 'success'
  },
  {
    id: '5',
    name: 'Refund',
    adminName: 'Support Team',
    date: 'Oct 20, 2024 | 2:30 PM',
    amount: '+ N 15,000',
    initial: 'R',
    color: CATEGORY_COLORS.finance,
    type: 'credit',
    status: 'billed',
    paymentStatus: 'success'
  },
  {
    id: '6',
    name: 'Amazon Prime',
    adminName: 'Sarah Wilson',
    date: 'Oct 15, 2024 | 10:00 AM',
    amount: '- N 12,107',
    initial: 'A',
    color: CATEGORY_COLORS.cloud,
    type: 'debit',
    status: 'unbilled',
    paymentStatus: 'pending'
  },
  {
    id: '7',
    name: 'Bank Transfer',
    adminName: 'Finance Dept',
    date: 'Oct 10, 2024 | 11:00 AM',
    amount: '+ N 200,000',
    initial: 'B',
    color: CATEGORY_COLORS.finance,
    type: 'credit',
    status: 'billed',
    paymentStatus: 'success'
  },
  {
    id: '8',
    name: 'Netflix',
    adminName: 'Admin User',
    date: 'Oct 05, 2024 | 8:00 PM',
    amount: '- N 5,500',
    initial: 'N',
    color: CATEGORY_COLORS.streaming,
    type: 'debit',
    status: 'unbilled',
    paymentStatus: 'success'
  },
  {
    id: '9',
    name: 'Spotify',
    adminName: 'Music Dept',
    date: 'Sep 28, 2024 | 3:15 PM',
    amount: '- N 2,500',
    initial: 'S',
    color: CATEGORY_COLORS.streaming,
    type: 'debit',
    status: 'unbilled',
    paymentStatus: 'success'
  },
  {
    id: '10',
    name: 'Freelance Payment',
    adminName: 'Client ABC',
    date: 'Sep 25, 2024 | 1:00 PM',
    amount: '+ N 150,000',
    initial: 'F',
    color: CATEGORY_COLORS.other,
    type: 'credit',
    status: 'billed',
    paymentStatus: 'success'
  },
  {
    id: '11',
    name: 'Uber',
    adminName: 'Transport',
    date: 'Sep 20, 2024 | 7:30 PM',
    amount: '- N 8,500',
    initial: 'U',
    color: CATEGORY_COLORS.other,
    type: 'debit',
    status: 'unbilled',
    paymentStatus: 'failed'
  },
  {
    id: '12',
    name: 'Dividend',
    adminName: 'Investment Co',
    date: 'Sep 15, 2024 | 9:00 AM',
    amount: '+ N 45,000',
    initial: 'D',
    color: CATEGORY_COLORS.finance,
    type: 'credit',
    status: 'billed',
    paymentStatus: 'success'
  },
  {
    id: '13',
    name: 'Apple Store',
    adminName: 'Tech Purchase',
    date: 'Sep 10, 2024 | 4:45 PM',
    amount: '- N 125,000',
    initial: 'A',
    color: CATEGORY_COLORS.other,
    type: 'debit',
    status: 'unbilled',
    paymentStatus: 'pending'
  },
  {
    id: '14',
    name: 'Bonus',
    adminName: 'HR Department',
    date: 'Sep 05, 2024 | 10:30 AM',
    amount: '+ N 300,000',
    initial: 'B',
    color: CATEGORY_COLORS.finance,
    type: 'credit',
    status: 'billed',
    paymentStatus: 'success'
  },
  {
    id: '15',
    name: 'Electricity Bill',
    adminName: 'Utilities',
    date: 'Sep 01, 2024 | 2:00 PM',
    amount: '- N 18,000',
    initial: 'E',
    color: CATEGORY_COLORS.other,
    type: 'debit',
    status: 'unbilled',
    paymentStatus: 'failed'
  },
  {
    id: '16',
    name: 'Interest',
    adminName: 'Bank',
    date: 'Aug 28, 2024 | 12:00 PM',
    amount: '+ N 5,200',
    initial: 'I',
    color: CATEGORY_COLORS.finance,
    type: 'credit',
    status: 'billed',
    paymentStatus: 'success'
  }
]
