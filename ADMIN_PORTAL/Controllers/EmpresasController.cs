using ADMIN_PORTAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ADMIN_PORTAL.Controllers
{
    public class EmpresasController : Controller
    {
        // GET: Empresas

        public ActionResult Index()
        {
            List<EmpresasModels> lst;
            using (ADMIN_PORTAL.Models.UTNIMASEntities db = new ADMIN_PORTAL.Models.UTNIMASEntities())
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
                    using (ADMIN_PORTAL.Models.UTNIMASEntities db = new ADMIN_PORTAL.Models.UTNIMASEntities())
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
            using (ADMIN_PORTAL.Models.UTNIMASEntities db = new ADMIN_PORTAL.Models.UTNIMASEntities())
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
            using (ADMIN_PORTAL.Models.UTNIMASEntities db = new ADMIN_PORTAL.Models.UTNIMASEntities())
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
            try
            {
                ADMIN_PORTAL.Models.UTNIMASEntities db = new ADMIN_PORTAL.Models.UTNIMASEntities();
                // TODO: Add insert logic here
                string query = "INSERT INTO EMPRESAS(DIRECCION_EMPRESA,NOMBRE_EMPRESA,EMAIL_EMPRESA,ID_CLIENTE,NOMBRE_CONTACTO,TELEF_CONTACTO,SECTOR_PRODUCCION)" +
                    "VALUES('" + empresa.DIRECCION_EMPRESA + "', '" + empresa.NOMBRE_EMPRESA + "', '" + empresa.EMAIL_EMPRESA + "', 1, '" + empresa.NOMBRE_CONTACTO + "', '" + empresa.TELEF_CONTACTO + "', '" + empresa.SECTOR_PRODUCCION + "')";
                db.Database.ExecuteSqlCommand(query);
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                return View(ex);
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
