using System.Collections.Generic;
using System.Linq;
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
                           SECTOR_PRODUCCION = d.SECTOR_PRODUCCION
                           //ID_CLIENTE = d.ID_CLIENTE
                       }).ToList();

            }
            return View(lst);
        }

        // GET: Empresas/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Empresas/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Empresas/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Empresas/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
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