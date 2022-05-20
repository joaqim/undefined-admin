export const generateState = (): string => {
    let state = Math.random().toString(36).substring(2)
    localStorage.setItem(`fortnox.${state}`, state)
    return state;
}

