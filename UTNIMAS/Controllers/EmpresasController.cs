﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UTNIMAS.Models;

namespace UTNIMAS.Controllers
{
    public class EmpresasController : Controller
    {
        // GET: Empresas

        public ActionResult Index()
        {
            List<EmpresasModels> lst;
            using (UTNIMASEntities db = new UTNIMASEntities())
            {
                lst = (from d in db.EMPRESAS
                       select new EmpresasModels
                       {
                           EMPRESA_ID = d.EMPRESA_ID,
                           NOMBRE_EMPRESA = d.NOMBRE_EMPRESA,
                           DIRECCION_EMPRESA = d.DIRECCION_EMPRESA,
                           NOMBRE_CONTACTO = d.NOMBRE_CONTACTO,
                           TELEF_CONTACTO = d.TELEF_CONTACTO,
                           EMAIL_EMPRESA = d.EMAIL_EMPRESA,
                           SECTOR_PRODUCCION = d.SECTOR_PRODUCCION,
                           ID_CLIENTE = d.ID_CLIENTE.ToString()
                       }).ToList();

            }
            return View(lst);
        }

        // GET: Empresas/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }


        public class Empresaz
        {
            public int EMPRESA_ID { get; set; }
            public string NOMBRE_EMPRESA { get; set; }
            public string DIRECCION_EMPRESA { get; set; }
            public string NOMBRE_CONTACTO { get; set; }
            public string TELEF_CONTACTO { get; set; }
            public string EMAIL_EMPRESA { get; set; }
            public string SECTOR_PRODUCCION { get; set; }
            public string ID_CLIENTE { get; set; }
        }

        [HttpGet]
        [ActionName("GetOnlyEmpresa")]
        public ActionResult GetOnlyEmpresa(string Id)
        {
            try
            {
                EMPRESA em = new EMPRESA();
                if (!string.IsNullOrEmpty(Id))
                {
                    using (UTNIMASEntities db = new UTNIMASEntities())
                    {
                        em = db.EMPRESAS.Find(int.Parse(Id));
                    }
                    Empresaz e3 = new Empresaz
                    {
                        DIRECCION_EMPRESA = em.DIRECCION_EMPRESA,
                        EMAIL_EMPRESA = em.EMAIL_EMPRESA,
                        EMPRESA_ID = em.EMPRESA_ID,
                        ID_CLIENTE = em.ID_CLIENTE.ToString(),
                        NOMBRE_CONTACTO = em.NOMBRE_CONTACTO,
                        NOMBRE_EMPRESA = em.NOMBRE_EMPRESA,
                        SECTOR_PRODUCCION = em.SECTOR_PRODUCCION,
                        TELEF_CONTACTO = em.TELEF_CONTACTO
                    };
                    return Json(new { Success = true, data = e3, status = 200 }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { Success = true, data = "Error", status = 200 }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {

                throw;
            }

        }

        [HttpPost]
        [ActionName("DeleteEmpresa")]
        public ActionResult Delete(string ID)
        {
            using (UTNIMASEntities db = new UTNIMASEntities())
            {
                EMPRESA em = db.EMPRESAS.Find(int.Parse(ID));
                if (em != null)
                {
                    db.EMPRESAS.Remove(em);
                    db.SaveChanges();
                }
            }
            return Json(new { Success = true, data = ID, status = 200 }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [ActionName("EditarEm")]
        public ActionResult EditarEm(EMPRESA Empresa)
        {
            using (UTNIMASEntities db = new UTNIMASEntities())
            {

                EMPRESA em = db.EMPRESAS.Find(Empresa.EMPRESA_ID);

                em.DIRECCION_EMPRESA = Empresa.DIRECCION_EMPRESA;
                em.EMAIL_EMPRESA = Empresa.EMAIL_EMPRESA;
                em.ID_CLIENTE = Empresa.ID_CLIENTE;
                em.NOMBRE_CONTACTO = Empresa.NOMBRE_CONTACTO;
                em.NOMBRE_EMPRESA = Empresa.NOMBRE_EMPRESA;
                em.SECTOR_PRODUCCION = Empresa.SECTOR_PRODUCCION;
                em.TELEF_CONTACTO = Empresa.TELEF_CONTACTO;

                db.SaveChanges();
            }

            return Json(new { Success = true, data = Empresa, status = 200 }, JsonRequestBehavior.AllowGet);
        }


        // GET: Empresas/Create
        public ActionResult EditarEmpresa(string Id)
        {
            ViewBag.IdEmpresa = Id;
            return View();
        }

        // POST: Empresas/Create
        [HttpPost]
        [ActionName("Create")]
        public ActionResult Create(EmpresasModels empresa)
        {
            string Iduser = null;
            int Empresa = 0;
            string userEmail = System.Web.HttpContext.Current.User.Identity.Name;
            try
            {             
                    if (userEmail != "")
                    {
                        //UTNIMASEntities db1 = new UTNIMASEntities();
                        Models.ConexionBD con = new Models.ConexionBD(); //Crea la instancia de la conexion
                        con.ConexDB(); //Conecta la BD
                        con.abrir(); //Abre la BD   
                        SqlCommand cmd = new SqlCommand("SELECT ID_CLIENT FROM dbo.CLIENTS WHERE EMAIL_CLIENT = @userEmail ", con.ConexDB());
                        cmd.Parameters.AddWithValue("@userEmail", userEmail);
                        Iduser = (cmd.ExecuteScalar().ToString());
                        if (Iduser != null)
                        {

                        SqlCommand cmd2 = new SqlCommand("SELECT COUNT(*) FROM dbo.EMPRESAS WHERE ID_CLIENTE = @userId ", con.ConexDB());
                            cmd2.Parameters.AddWithValue("@userId", Iduser);
                            Empresa = Convert.ToInt32(cmd2.ExecuteScalar());
                                                    
                        }

                    }
                if (Empresa == 0)
                {
                    UTNIMASEntities db = new UTNIMASEntities();
                    string query = "INSERT INTO EMPRESAS(DIRECCION_EMPRESA,NOMBRE_EMPRESA,EMAIL_EMPRESA,ID_CLIENTE,NOMBRE_CONTACTO,TELEF_CONTACTO,SECTOR_PRODUCCION)" +
                        "VALUES('" + empresa.DIRECCION_EMPRESA + "', '" + empresa.NOMBRE_EMPRESA + "', '" + empresa.EMAIL_EMPRESA + "','" + Iduser + "','" + empresa.NOMBRE_CONTACTO + "', '" + empresa.TELEF_CONTACTO + "', '" + empresa.SECTOR_PRODUCCION + "')";
                    db.Database.ExecuteSqlCommand(query);
                    string Mensaje = "Registro de Empresa Completo";
                    return Json(new { Success = true, Mensaje }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    string Mensaje = "Solamente Puede Crear una Empresa";
                    return Json(new { Success = false, Mensaje }, JsonRequestBehavior.AllowGet);
                }
               
            }
            catch (Exception ex)
            {
                string Mensaje = "Error con la Solicitud";
                return Json(new { Success = false, Mensaje }, JsonRequestBehavior.AllowGet);
            }
        }

        // POST: Empresas/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Empresas/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Empresas/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
