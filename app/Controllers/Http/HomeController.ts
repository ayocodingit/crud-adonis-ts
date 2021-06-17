export default class HomeController {
  public async index({ request }) {
    return {
      app: 'App',
      host: request.hostname(),
    }
  }
}
