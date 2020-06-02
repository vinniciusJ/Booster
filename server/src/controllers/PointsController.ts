import knex from '../database/connection'
import { Request, Response } from 'express'

class PointsController {
    async show(request: Request, response: Response){
        const { id } = request.params

        const point = await knex('points').where('id', id).first()

        if (!point){
            return response.status(400).json({message: "Point not found"})
        }

        return response.json(point)
    }
    async create(request: Request, response: Response){
        const {name, email, whatsapp, latitude, longitude, city, uf, items} = request.body

        const trx = await knex.transaction()
        const point = {image: 'image-fake', name, email, whatsapp, latitude, longitude, city, uf}

        const insertedIDs = await trx('points').insert(point)

        const point_id = insertedIDs[0]

        const pointItems = items.map((item_id: Number) => {
            return {item_id, point_id}
        })

        await trx('point_items').insert(pointItems)

        return response.json({
            id: point_id,
            ...point,
        })
    }
}
export default PointsController