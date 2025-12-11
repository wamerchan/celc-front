#!/usr/bin/env node
/*
  Script de poblado mock para la base de datos CELC (ajustado a esquema real)
  - Usa mysql2/promise
  - Seguro para re-ejecución: borra datos con TRUNCATE donde aplica
  - Genera roles, usuarios, equipos, líneas, asignaciones, revisiones y registros de errores
*/

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'CELC',
};

function randomDateBetween(from, to){
  return new Date(from.getTime() + Math.random()*(to.getTime()-from.getTime()));
}

function formatDate(d){ return d.toISOString().slice(0,10); }
function formatDateTime(d){ return d.toISOString().slice(0,19).replace('T',' '); }

async function main(){
  const conn = await mysql.createConnection(DB_CONFIG);
  try{
    console.log('Conectado a DB, preparando inserts...');

    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    const tables = ['RegistroErrores','Revisiones','Asignaciones','Lineas','Equipos','Usuarios','Roles'];
    for(const t of tables){
      try{ await conn.query(`TRUNCATE TABLE \`${t}\``); console.log('TRUNCATED', t); }catch(e){ console.warn('No se pudo truncar', t, e.message); }
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    // ROLES
    const roles = ['Administrador','Técnico','Empleado','Supervisor','Invitado'];
    for(const r of roles){
      await conn.query('INSERT INTO Roles (nombre_rol, descripcion) VALUES (?,?)', [r, r+' role created by mock']);
    }
    console.log('Roles insertados');

    const [rowsRoles] = await conn.query('SELECT id_rol, nombre_rol FROM Roles');
    const roleMap = {};
    for(const row of rowsRoles) roleMap[row.nombre_rol]=row.id_rol;

    // USUARIOS (20)
    const nombres = ['Carlos','María','Luis','Ana','Miguel','Sofía','José','Lucía','Andrés','Paula','Diego','Valentina','Jorge','Camila','Felipe','Isabella','Pablo','Martina','Ricardo','Alejandra'];
    const apellidos = ['Gómez','Pérez','Rodríguez','García','Martínez','López','Hernández','Sánchez','Ramírez','Torres'];

    const users = [];
    const roleIds = Object.values(roleMap);
    // Pre-computar hash bcrypt para la contraseña común '123456'
    const plaintext = '123456';
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(plaintext, salt);

    for(let i=0;i<20;i++){
      const nombre = nombres[i % nombres.length];
      const apellido = apellidos[i % apellidos.length];
      const cedula = 'V'+(10000000 + i).toString();
      const correo = `${nombre.toLowerCase()}.${apellido.toLowerCase()}${i}@example.com`;
      const hash = hashedPassword;
      const dob = randomDateBetween(new Date(1970,0,1), new Date(2000,11,31));
      const rol = roleIds[Math.floor(Math.random()*roleIds.length)];
      const activo = 1;
      const [r] = await conn.query('INSERT INTO Usuarios (nombres, apellidos, cedula, fecha_nacimiento, correo_electronico, contrasena_hash, id_rol, fecha_creacion, activo) VALUES (?,?,?,?,?,?,?,?,?)', [nombre, apellido, cedula, formatDate(dob), correo, hash, rol, formatDateTime(new Date()), activo]);
      users.push({id: r.insertId, nombre, apellido});
    }
    console.log('Usuarios insertados:', users.length);

    // EQUIPOS (50)
    const marcas = ['Samsung','Huawei','Xiaomi','Apple','Nokia','Motorola','LG','Sony'];
    const modelos = ['A1','B2','C3','Pro','Mini','Ultra','S20','Note'];
    const estadosEquipo = ['Disponible','Asignado','En Mantenimiento','Baja'];
    const equipos = [];
    for(let i=0;i<50;i++){
      const marca = marcas[Math.floor(Math.random()*marcas.length)];
      const modelo = modelos[Math.floor(Math.random()*modelos.length)] + (Math.floor(Math.random()*900)+100);
      const numero_serie = 'SN' + (Date.now()%100000) + i + Math.floor(Math.random()*999);
      const imei = (360000000000000 + i).toString();
      const estado = estadosEquipo[Math.floor(Math.random()*estadosEquipo.length)];
      const fecha_adq = randomDateBetween(new Date(Date.now()-1000*60*60*24*365*5), new Date());
      const descripcion = `Equipo ${marca} ${modelo}`;
      const [r] = await conn.query('INSERT INTO Equipos (marca, modelo, numero_serie, imei, estado, fecha_adquisicion, descripcion) VALUES (?,?,?,?,?,?,?)', [marca, modelo, numero_serie, imei, estado, formatDate(fecha_adq), descripcion]);
      equipos.push({id: r.insertId});
    }
    console.log('Equipos insertados:', equipos.length);

    // LINEAS (50)
    const operadores = ['Movistar','Claro','T-Mobile','Digitel','Personal'];
    const planes = ['Prepago 3GB','Postpago 10GB','Ilimitado','Control 5GB','Negocio 20GB'];
    const estadosLinea = ['Activa','Inactiva','Suspendida'];
    const lineas = [];
    for(let i=0;i<50;i++){
      const numero = '04' + (10000000 + i).toString().slice(1);
      const operador = operadores[Math.floor(Math.random()*operadores.length)];
      const plan = planes[Math.floor(Math.random()*planes.length)];
      const estado = estadosLinea[Math.floor(Math.random()*estadosLinea.length)];
      const fechaAct = randomDateBetween(new Date(Date.now()-1000*60*60*24*365*3), new Date());
      const fecha_venc = new Date(fechaAct.getTime()); fecha_venc.setFullYear(fecha_venc.getFullYear()+1);
      const [r] = await conn.query('INSERT INTO Lineas (numero_telefono, operador, plan_datos, estado, fecha_activacion, fecha_vencimiento_plan, descripcion) VALUES (?,?,?,?,?,?,?)', [numero, operador, plan, estado, formatDate(fechaAct), formatDate(fecha_venc), 'Linea creada por mock']);
      lineas.push({id: r.insertId});
    }
    console.log('Lineas insertadas:', lineas.length);

    // ASIGNACIONES (60)
    const asignaciones = [];
    const equiposDisponibles = new Set(equipos.map(e=>e.id));
    const lineasDisponibles = new Set(lineas.map(l=>l.id));
    for(let i=0;i<60;i++){
      if(equiposDisponibles.size===0 && lineasDisponibles.size===0) break;
      const u = users[Math.floor(Math.random()*users.length)];
      let equipoId = null;
      if(equiposDisponibles.size>0 && Math.random()>0.2){ const arr = Array.from(equiposDisponibles); equipoId = arr[Math.floor(Math.random()*arr.length)]; equiposDisponibles.delete(equipoId); }
      let lineaId = null;
      if(lineasDisponibles.size>0 && Math.random()>0.3){ const arr = Array.from(lineasDisponibles); lineaId = arr[Math.floor(Math.random()*arr.length)]; lineasDisponibles.delete(lineaId); }

      // Asegurar que al menos uno no sea null (constraint CHECK)
      if(!equipoId && !lineaId){
        // intentar asignar al menos equipo
        if(equiposDisponibles.size>0){ const arr = Array.from(equiposDisponibles); equipoId = arr[Math.floor(Math.random()*arr.length)]; equiposDisponibles.delete(equipoId); }
        else if(lineasDisponibles.size>0){ const arr = Array.from(lineasDisponibles); lineaId = arr[Math.floor(Math.random()*arr.length)]; lineasDisponibles.delete(lineaId); }
        else { continue; }
      }

      const fechaAsign = randomDateBetween(new Date(Date.now()-1000*60*60*24*365*3), new Date());
      let fechaDesasig = null;
      if(Math.random()>0.5) fechaDesasig = randomDateBetween(fechaAsign, new Date());
      const observ = Math.random()>0.8? 'Asignación temporal' : null;
      const [r] = await conn.query('INSERT INTO Asignaciones (id_usuario, id_equipo, id_linea, fecha_asignacion, fecha_desasignacion, observaciones) VALUES (?,?,?,?,?,?)', [u.id, equipoId, lineaId, formatDateTime(fechaAsign), fechaDesasig?formatDateTime(fechaDesasig):null, observ]);
      asignaciones.push({id: r.insertId});
    }
    console.log('Asignaciones insertadas:', asignaciones.length);

    // REVISIONES (10)
    const [techRows] = await conn.query('SELECT id_usuario FROM Usuarios WHERE id_rol = ?', [roleMap['Técnico']]);
    const techs = techRows.map(r=>r.id_usuario);
    const revisiones = [];
    for(let i=0;i<10;i++){
      const equipo = equipos[Math.floor(Math.random()*equipos.length)];
      const programada = randomDateBetween(new Date(), new Date(Date.now()+1000*60*60*24*30));
      const realizada = randomDateBetween(new Date(Date.now()-1000*60*60*24*30), new Date());
      const resultado = Math.random()>0.5? 'Aprobada' : 'Reparacion Necesaria';
      const tecnico = techs.length>0? techs[Math.floor(Math.random()*techs.length)]: null;
      await conn.query('INSERT INTO Revisiones (id_equipo, fecha_programada, fecha_realizada, resultado, observaciones, realizada_por_usuario) VALUES (?,?,?,?,?,?)', [equipo.id, formatDate(programada), formatDate(realizada), resultado, 'Revision generada por mock', tecnico]);
      revisiones.push(1);
    }
    console.log('Revisiones insertadas:', revisiones.length);

    // REGISTRO DE ERRORES (8)
    const tipos = ['Hardware','Software','Conectividad','Seguridad','Usuario'];
    const modulos = ['Auth','Asignacion','Sync','API','UI'];
    for(let i=0;i<8;i++){
      const tipo = tipos[Math.floor(Math.random()*tipos.length)];
      const modulo = modulos[Math.floor(Math.random()*modulos.length)];
      const descripcion = `${tipo} error en modulo ${modulo}`;
      const fecha = randomDateBetween(new Date(Date.now()-1000*60*60*24*30), new Date());
      const userOrNull = Math.random()>0.3? users[Math.floor(Math.random()*users.length)].id : null;
      const ip = `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
      await conn.query('INSERT INTO RegistroErrores (tipo_error, descripcion_error, fecha_hora, id_usuario, ip_origen, modulo_afectado) VALUES (?,?,?,?,?,?)', [tipo, descripcion, formatDateTime(fecha), userOrNull, ip, modulo]);
    }
    console.log('Registros de errores insertados');

    console.log('Poblado completado');
  }catch(err){
    console.error('Error en poblado:', err.message || err);
  }finally{
    await conn.end();
  }
}

main();
