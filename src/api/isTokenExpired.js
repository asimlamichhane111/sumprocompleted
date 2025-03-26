function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiryTime = payload.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime >= expiryTime-10;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
}

export default isTokenExpired;
