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

const getDetallesContratoPost = (req, res) => {
    const {id_client, id_prod, id_cont} = req.body

    const condicion = " WHERE dc.id_client = " + id_client + " dc.id_prod = " + id_prod + " dc.id_cont = " + id_cont 

    selectQuery("dc.id_crz_cult variedad, v.nombre nombre, v.especie especie", " fah_detallescontrato dc, fah_variedadescrz v", condicion, '', (err, result) => {
        if (err)
            res.status(500).send(err)
        else
            res.json(result)
    })
}

const getFormulasPost = (req, res) => {
    
}

export const evalAnualController = {
    productorasContratoPost, getDetallesContratoPost
}