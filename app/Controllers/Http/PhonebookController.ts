import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Phonebook from 'App/Models/Phonebook'
import StorePhoneBookValidator from 'App/Validators/StorePhoneBookValidator'
import UpdatePhoneBookValidator from 'App/Validators/UpdatePhoneBookValidator'

export default class PhonebookController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const record = await Phonebook.query().paginate(page, perPage)

    return response.json(record)
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(StorePhoneBookValidator)
      await Phonebook.create(payload)
      return response.status(201).json({ message: 'CREATED' })
    } catch (error) {
      throw error
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const phonebook = await Phonebook.findOrFail(params.id)
    return response.json(phonebook)
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const payload = await request.validate(UpdatePhoneBookValidator)
      const phonebook = await Phonebook.findOrFail(params.id)
      phonebook.merge(payload)
      await phonebook.save()
      return response.json({ message: 'UPDATED' })
    } catch (error) {
      throw error
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    const phonebook = await Phonebook.findOrFail(params.id)
    await phonebook.delete()
    return response.json(phonebook)
  }
}
