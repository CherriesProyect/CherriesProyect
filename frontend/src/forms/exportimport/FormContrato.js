import { Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'reactjs-popup/dist/index.css';

export default function FormContrato(){
    const [productoras, setProductoras] = useState([])
    const [clientes, setClientes] = useState([])

    const [formasPago, setFormasPago] = useState([])
    const [verificarFormPago, setVerificarFormPago] = useState(false)

    const [registrarDetalle, setRegistrarDetalle] = useState(false)

    const [abrirModal, setAbrirModal] = useState(false)

    const [detallesCont, setDetallesCont] = useState([])

    const [cultivos, setCultivos] = useState([])

    const [monto, setMonto] = useState(0)

    const[contrato , setContrato] =useState({
        id_prod: '',
        id_client: '',
        transp: '',
        descuento: '',
        id_fr_pg: '',
        id_prod_pais: '',
    })

    const [detContrato, setDetContrato] = useState({
        id_client_cont: '',
        id_prod_cult: '',
        id_crz_cult: '',
        id_cult: '',
        ctd: '',
        nombre: '',
        precioxPais: '',
        monto: '',
        fe_envio: ''
    })

    const handleChangeContrato = (e) => {
        if (e.target.name === 'id_prod'){
            setContrato({
                ...contrato,
                id_prod: productoras[e.target.value].id,
                id_prod_pais: productoras[e.target.value].id_pais
            })
            setVerificarFormPago(true)
        }
        else
            setContrato({
                ...contrato,
                [e.target.name] : e.target.value,
            })
    }

    const handleChangeDetContrato = (e) => {
        if (e.target.name === 'cultivo'){
            setDetContrato({
                ...detContrato,
                id_crz_cult: cultivos[e.target.value].id_crz_cult,
                id_cult: cultivos[e.target.value].id_cult,
                precioxPais: cultivos[e.target.value].precio,
                nombre: cultivos[e.target.value].nombre
            })
        }
        else{
            setDetContrato({
                ...detContrato,
                [e.target.name]: e.target.value
            })
        }
    }

    const handleSiguiente = () => {
        const {id_prod, id_client, transp, id_fr_pg} = contrato
        const id_pais = contrato.id_prod_pais

        if ((id_prod === '')||(id_client === '')||(transp === '')||(id_fr_pg === '')){
            alert('Los campos no pueden estar vacios')
            return
        }    
        ///validacion de que no hay contrato activo con la productora escogida
        axios.post('http://localhost:3001/api/contratos/detalleContrato/cultivosproductora',{id_prod, id_pais}).then(res => setCultivos(res.data))
        setRegistrarDetalle(true)
        setDetContrato({
            ...detContrato,
            id_prod_cont: contrato.id_prod,
            id_client_cont: contrato.id_client,
            id_prod_cult: contrato.id_prod,
        })
    }

    const handleConfirm = () => {
        const {id_crz_cult, ctd} = detContrato
        
        if ((id_crz_cult === '')||(ctd ===''))
            alert('Campos obligatorios vacios')
        else{
            setDetContrato({...detContrato, monto: detContrato.ctd * detContrato.precioxPais})
            setMonto((detContrato.ctd * detContrato.precioxPais) + monto)
            setAbrirModal(true)
        }        
    }
    
    const handleAgregarDet = () => {
        setDetallesCont((prevDetsCont) => prevDetsCont.concat(detallesCont))
        setDetContrato({
            id_prod_cult: '',
            id_crz_cult: '',
            id_cult: '',
            ctd: '',
            fe_envio: ''
        })
        setAbrirModal(false)
    }

    const handleSubmit = () => {
        const {id_prod, id_client, id_fr_pg, descuento, transp} = contrato

        axios.post('', {id_prod, id_client, id_fr_pg, descuento, transp, monto}).then(res => {

            const id = res.data
            axios.post('', {id, detallesCont}).then(res => {
                if (res.data.error !== undefined){
                    alert(res.data.error + "\n" + res.data.sqlMessage)
                    return
                }
                else
                    alert('Registro realizado')
            }).catch(err => {console.log(err) ; alert('error')})

        })
    }

    useEffect(() => {
        axios.get('http://localhost:3001/api/empresas/productora/paises').then(res => setProductoras(res.data))
        axios.get('http://localhost:3001/api/empresas/cliente').then(res => setClientes(res.data))
    }, [])

    useEffect(() => {
        if (verificarFormPago){
            const {id_prod} = contrato
            axios.post('http://localhost:3001/api/pagos/formaspago/productora', {id_prod}).then(res => setFormasPago(res.data))
            setContrato({...contrato, id_fr_pg: ''})
            setVerificarFormPago(false)
        }
    }, [verificarFormPago])

    return(
        <>
            <div className='container mt-xxl-5 d-flex align-items-center justify-content-center'>
                <Form className='w-100' onSubmit={handleSubmit}>
                    <Form.Group hidden={registrarDetalle}>
                        <Form.Group>
                            <Form.Label>Empresa cliente</Form.Label>
                                <Form.Select type='text' name='id_client' defaultValue = 'Selecciona una opcion' onChange={handleChangeContrato}>
                                    <option hidden>Selecciona una opcion</option>
                                        {clientes.map( (cliente) => { 
                                            return <option key={cliente.id} value = {cliente.id}>{cliente.nombre}</option>
                                        })}        
                                </Form.Select>

                        </Form.Group>
                        
                        <Form.Group>
                            <Form.Label>Contrato activo con empresa productora</Form.Label>
                                <Form.Select type='text' name='id_prod' defaultValue = 'Selecciona una opcion' onChange={handleChangeContrato}>
                                    <option hidden>Selecciona una opcion</option>
                                        {productoras.map( (productora) => { 
                                            return <option key={productoras.indexOf(productora)} value = {productoras.indexOf(productora)}>{productora.nombre}</option>
                                        })}        
                                </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Transporte de la mercancia</Form.Label>
                            <Form.Select name='transp' onChange={handleChangeContrato}>
                                <option hidden>Selecciona una opcion</option>
                                <option>Aéreo</option>
                                <option>Terrestre</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Porcentaje de descuento</Form.Label>
                            <Form.Control type='number' name='descuento' min='1' onChange={handleChangeContrato} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Forma de pago</Form.Label>
                            <Form.Select name='id_fr_pg' defaultValue='Selecciona una opcion' onChange={handleChangeContrato}>
                                <option hidden>Selecciona una opcion</option>
                                    {formasPago.map((forma) => {
                                        let texto = ''
                                        if (forma.tipo === 'Contado'){
                                            texto = forma.tipo
                                            if (forma.conta_emi === 1)
                                                texto += ' con emision de pago por contado'
                                            else
                                                texto += ' sin emision de pago por contado'
                                            
                                            if (forma.conta_env === 1)
                                                texto += ' y con envio por contado'
                                            else
                                                texto+= ' y sin envio por contado' 
                                        }
                                        else
                                            texto+= forma.num_cuotas + ' cuotas, c/u de ' + forma.prt_cuota + '%'
                                        
                                        return <option key={forma.id} value={forma.id}>{texto}</option>
                                    })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Button className='mt-4'variant="primary" onClick={handleSiguiente}>
                                Siguiente
                            </Button>
                        </Form.Group>

                    </Form.Group>
                   
                    <Form.Group hidden={!registrarDetalle}>
                        <h2>Detalles de contrato</h2>
                            
                        <Form.Group>
                            <Form.Label>Variedad cereza</Form.Label>
                                <Form.Select className='mt-2' type='text' name='cultivo' defaultValue = 'Selecciona una opcion' onChange={handleChangeDetContrato}>
                                    <option hidden>Selecciona una opcion</option>
                                    {cultivos.map( (cultivo) => { 
                                        return <option key={cultivos.indexOf(cultivo)} value = {cultivos.indexOf(cultivo)}>{cultivo.nombre + " " + cultivo.calibre + " " + cultivo.precio + "$/kg"}</option>
                                    })}
                                </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Cantidad a comprar en kg</Form.Label>
                            <Form.Control type='number' name='ctd' min='1' onChange={handleChangeDetContrato} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Fecha de envio aproximada {"(opcional)"}</Form.Label>
                            <Form.Control type='text' name='fe_envio' min='1' onChange={handleChangeDetContrato} />
                        </Form.Group>
                        
                        <Form.Group>
                            <Button color='success' onClick={handleConfirm}>Confirmar</Button>
                        </Form.Group>
                        
                        
                    </Form.Group>

                    <Modal isOpen={abrirModal}>
                        <ModalHeader>
                            Detalle de contrato 
                        </ModalHeader>    

                        <ModalBody>
                            <Container>
                                <Row className="mt-xxl-5 d-flex align-items-center justify-content-center" xs="auto">{"Precio total a pagar por " + detContrato.nombre + ": " + detContrato.monto}</Row>
                                <Row className="mt-xxl-5 d-flex align-items-center justify-content-center" xs="auto">{"Total a pagar actual del contrato: " + monto + "$"}</Row>
                            </Container >
                        </ModalBody>      
                    
                        <ModalFooter>
                            <Container>
                                <Row className="mt-xxl-5 d-flex align-items-center justify-content-center" xs="auto">Agregar otro detalle</Row>
                                <Row className="mt-xxl-5 d-flex align-items-center justify-content-center" xs="auto" >
                                    <Col><Button color='primary' onClick={handleAgregarDet}>Si</Button></Col>
                                    <Col><Button color='black' type='submit'>No</Button></Col>
                                </Row>
                            </Container>                        
                        </ModalFooter>
                    </Modal>   
                </Form> 

                                                              
            </div>
        </>
    )
}