export const getOpponentData = () => {
    try {

        if (window.Telegram) {
         return window.Telegram.WebApp.initData + ''
        }

        throw new Error("No TgWebAppData")
    } catch (error) {
        alert(error.message)

        return 'No TgWebAppData'
    }
}