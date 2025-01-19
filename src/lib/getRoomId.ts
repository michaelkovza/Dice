const TG_START_APP_KEY = 'tgWebAppStartParam'

export const getRoomId = () => {
    const params = new URLSearchParams(window.location.search)

    return params.get(TG_START_APP_KEY)
}