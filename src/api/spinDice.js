export const spinDice = (gameId, playerId) => {
    return fetch(
        `https://krutilka.michaelkovzanovich.workers.dev/api/room/${gameId}/spin`,
        {
            method: "POST",
            body: JSON.stringify({ playerId: String(playerId) })
        }
    )
}