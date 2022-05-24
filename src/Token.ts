import { FortnoxToken } from "thin-backend";

interface Token extends Partial<FortnoxToken> {
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresIn: number;
    tokenType?: string | null;
}

export default Token;