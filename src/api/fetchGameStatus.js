export const fetchGame = (gameId) => {
    return fetch(`https://krutilka.michaelkovzanovich.workers.dev/api/room/${gameId}`)
}