import { contratoController } from "../controllers/contratos/contratosController.js";
import { Router } from "express"

const router = Router()

router.post('/detalleContrato/cultivosproductora', contratoController.getCultivosProductoraPost)

export const contratosRouter = router