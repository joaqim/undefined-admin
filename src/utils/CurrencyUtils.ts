import axios from "axios";
import { EOL } from "os";

abstract class CurrencyUtils {
    public static async fetchCurrencyRate(date: Date, currency: string, currencyTarget: string = "SEK"): Promise<number> {
        if (`${currency}-${currencyTarget}` == "SEK-SEK") {
            return 1;
        }
        const formatDate = (date: Date): string => {
            const addLeadingZeros = (n: number): string | number => {
                if (n <= 9) {
                    return "0" + n;
                }
                return n
            }

            return date.getFullYear() + "-" + addLeadingZeros(date.getMonth() + 1) + "-" + addLeadingZeros(date.getDate())
        }

        const dateTo = formatDate(date)
        date.setDate(date.getDate() - 7)
        const dateFrom = formatDate(date)

        const { data } = await axios({
            method: 'POST',
            url: "http://localhost:8080/currency",
            data: {
                currency,
                dateFrom,
                dateTo,
                access_token: "UNUSED"
            },
            responseType: 'text'
        })
        return parseFloat(data)
    }
}

export default CurrencyUtils;