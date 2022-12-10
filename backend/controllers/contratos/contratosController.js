import insertQuery from "../../utils/insertQuery.js"
import selectQuery from "../../utils/selectQuery.js"

const getCultivosProductoraPost = (req, res) => {
    const {id_prod, id_pais} = req.body

    const condicion = " WHERE c.id_prod = " + id_prod + " AND v.id = c.id_crz AND v.id = p.id_crz AND p.id_pais = " + id_pais + " AND isnull(p.fe_f) AND c.calibre = p.calibre"

    selectQuery("c.id_crz id_crz_cult, c.id id_cult, p.precio precio, v.nombre nombre, c.calibre calibre", " fah_variedadescrz v, fah_cultivos c, fah_precioscrzpais p ", condicion, '', 
        (err, result) => {
            if (err)
                res.status(500).send(err)
            else
                res.json(result)
        })
}


export const contratoController = {
    getCultivosProductoraPost
}