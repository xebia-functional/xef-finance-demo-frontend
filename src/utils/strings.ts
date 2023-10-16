export const toSnakeCase = (str: string): string =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join('_') ?? str;

export const toSpaceCase = (str: string): string =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join(' ') ?? str;

export const toCapitalizedSpaceCase = (str: string): string =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => `${x.charAt(0).toUpperCase()}${x.slice(1).toLowerCase()}`)
    .join(' ') ?? str;

export function formatCurrency(number) {
    // Check if the input is a valid number
    if (typeof number !== 'number' || isNaN(number)) {
        return 'Invalid Input';
    }

    // Convert the number to a string with dollar symbol
    const formattedCurrency = number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return formattedCurrency;
}
