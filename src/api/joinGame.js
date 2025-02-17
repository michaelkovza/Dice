export const joinGame = (gameId, opponent) => {
    return fetch(`https://krutilka.michaelkovzanovich.workers.dev/api/room/${gameId}/join`,
    {
        method: "POST",
        body: JSON.stringify({ opponentData: opponent })
    })
}