import insertQuery from "../utils/insertQuery.js"
import selectQuery from "../utils/selectQuery.js"

const productorasContratoPost = (req, res) => {
    const {id_client} = req.body

    const condicion = " WHERE c.id_client = " + id_client + " AND c.estatus = 'Activo' AND c.id_prod = p.id"

    selectQuery("p.id id_prod, p.nombre nombre, c.id contrato", " fah_empresasproductoras p, fah_contratos c ", condicion, '', (err, result) => {
        if (err)
            res.status(500).send(err)
        else
            res.json(result)
    })
}