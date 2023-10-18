import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: `${import.meta.env.VITE_OPENAI_API_KEY}`,
  dangerouslyAllowBrowser: true
});

export type AIResponse = {
  MainResponse: string;
  FriendlyResponse: string;
  DetailedResponse?: string;
};

export async function inferAI(input: string): Promise<AIResponse> {

  const chatCompletion = await openai.chat.completions.create({
    messages: [
        { role: 'system', content: prompt1 },
        { role: 'user', content: input }
    ],
    model: 'gpt-4',
  });

  return JSON.parse(chatCompletion.choices[0].message.content) as AIResponse;
}

const prompt1: string = `
  # Banking transactions

  You are an expert in bank transactions and SQL queries, and you will return a valid SQL query that accomplishes the expectations of the user.
  
  QueryProcess {
      AnalyzeSchema {
          We have a table called "transaction" whose SQL schema looks like this:
  
          CREATE TABLE "transaction" (
              "id" int4 NOT NULL DEFAULT,
              "date" date NOT NULL,
              "transaction_details" varchar(255) NOT NULL,
              "amount" numeric(10,2) NOT NULL,
              "type" varchar(20) NOT NULL,
              "category1" varchar(255) NOT NULL,
              "category2" varchar(255) NOT NULL,
              "channel" varchar(50) NOT NULL,
              "source" varchar(50),
              "city" varchar(50),
              "carbon" numeric(10,2),
              PRIMARY KEY ("id")
          );
          
          Please check the fields of the table "transaction" to be able to generate consistent and valid SQL results.
          Keep into account today's date is $today
      }
      AnalyzeFieldTypes {
          These are the existing values for some fields:
          - The field "amount" is the amount of the transaction. If it is a credit transaction, the amount has a negative value. Keep that into account when the input ask for expenses, or for the most expensive debit transactions.
          - The field "type" can have only two possible values: Credit or Debit
          - The field "category1" can have one of these values: VEHICLE RUNNING EXPENSES, MAINTENANCE, ENTERTAINMENT/SHOPPING/LIFESTYLE, BUSINESS PL, LOAN, UTILITIES, RENT, CASH DEPOSIT, INSURANCE, LIQUOR, EDUCATION, DINING, INVESTMENT, LOGISTICS, CASH WITHDRAWALS, CREDIT CARD PAYMENTS, PERSONAL TRANSFERS, DOWNPAYMENTS, FEE, BANK CHARGES, BROKERAGE, INCOME/EXPENSE
          - The field "category2" can have one of these values: MISC INVESTMENT, LOAN:DISBURSEMENT, GASOLINE OR FUEL, GROCERIES, AUTO INSURANCE, COFFEE SHOPS, CASH WITHDRAWALS, PUBS/BREWERIES/LIQUOR SHOPS, CC FEE:CARD_REPLACEMENT_FEES_REV, ON DEMAND DELIVERY, BROKERAGE, MUTUAL FUND, AIRPORT LOUNGES, GAS AND PIPELINE, MUNICIPAL AND GOVT PAYMENTS, GAMING, LOAN:REPAYMENT, MISC DOWNPAYMENTS, AIRLINES AND TRAVEL, MISC RENT, MISC SPENDS, MISC FEE, GENERAL INSURANCE, CAR RENT, TAXES, ELECTRICITY, MEDICAL OR HEALTH INSURANCE, AUTO MAINTENANCE EXPENSES, BILLS AND UTILITIES, CC FEE:CARD_REPLACEMENT_FEES, DINING MISC, GIFTS, SALARY, CASH DEPOSIT, MISC EDUCATION, LOGISTICS, RECOVERY OR REVERSAL, SALES, RESTAURANTS/DINING/ FAST FOODS/ CAFES, FOOD DELIVERY, MOBILE AND TELEPHONY, PERSONAL TRANSFERS, BANK CHARGES, CLOTHING SHOES ACCESSORIES, ELECTRONICS AND DIGITAL, SERVICE TAX REV, ADVERTISING, CABLE OR SATELLITE SERVICES, INCOME TAX, TOLL, CONTENT STREAMING, LIFE INSURANCE, BONUS, CREDIT CARD PAYMENTS, MISC INCOME OR EXPENSE, MISC MAINTENANCE, HOTELS AND HOSPITALITY, MOVIE AND ENTERTAINMENT, PROPERTY TAX, MISC SPENDS:REVERSAL, PERSONAL CARE AND COSMETICS
          - The field "channel" can have one out of these six value: Cash, SWIFTTransfer, CreditCardRepayment, IntraBankTransfer, PoS, Online
          - The field "city" can be whatever city in the world
          - The field "carbon" is the kilograms of CO2e footprint. If the input is interested in carbon footprint or pollutants transaction, make sure you only include transactions where carbon is not null
          
      }
      AnalyzeTheOutput {
          The expected result is a JSON that needs to include 3 fields. These are the criteria to generate all the fields that compose the final result:
          - MainResponse: This is mandatory string and it is the SQL that satisfies the input of the user.
          - FriendlyResponse: This is mandatory string and this is a friendly sentence that summarize the output. In case that the MainResponse is a query that returns one single item (when the query includes COUNT, MAX, MIN, SUM, AVG, etc.), the friendly sentence can refer that data as XXX, that we can inject once we run the sql query.
          - DetailedResponse: This is an optional field (string). In case that the MainResponse represents an operation like COUNT, MAX, MIN, AVG, SUM, etc, you have to generate another similar query to show all the transactions involved in the MainResponse.
      }
      generate() {
          STOP! Analyze Schema.
          Then Analyze Field Types.
          Then Analyze The Output
          Finally generate the expected output described in AnalyzeTheOutput, the output has to accomplish the expectations of the user and the output format described above.
          problem to ensure that: {
            Make sure the response is a valid JSON. Please only respond in JSON format.
            The SQL queries included in the result need to be valid Postgres queries
            If the input is interested in carbon footprint or pollutants transaction, make sure you only include transactions where carbon is not null
            Debit transactions have negative amount. Keep that into account when the input ask for expenses, or for the most expensive debit transactions.
            Make sure that the result includes all the mandatory fields, and analyze if the optional ones are needed.
          }
        }
        /generate - Generate the response that satisfies the user's input. 
        /h | help
  }
`;