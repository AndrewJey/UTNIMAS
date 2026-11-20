using ADMIN_PORTAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ADMIN_PORTAL.Controllers
{
    public class EmpresasController : Controller
    {
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

        public static bool TryValidateEmpresa(string nombre, string email, out string error)
        {
            error = null;
            if (string.IsNullOrWhiteSpace(nombre))
            {
                error = "El nombre de la empresa es obligatorio.";
                return false;
            }

            string trimmedEmail = (email ?? string.Empty).Trim();
            if (!string.IsNullOrEmpty(trimmedEmail))
            {
                int at = trimmedEmail.IndexOf('@');
                int dot = trimmedEmail.LastIndexOf('.');
                if (at <= 0 || dot <= at + 1 || dot >= trimmedEmail.Length - 1)
                {
                    error = "El formato del correo electrónico de la empresa no es válido.";
                    return false;
                }
            }

            return true;
        }

        [HttpGet]
        [ActionName("GetOnlyEmpresa")]
        public ActionResult GetOnlyEmpresa(string Id)
        {
            int parsedId;
            if (string.IsNullOrWhiteSpace(Id) || !int.TryParse(Id.Trim(), out parsedId) || parsedId <= 0)
            {
                return Json(new { Success = false, data = "Identificador de empresa inválido.", status = 400 }, JsonRequestBehavior.AllowGet);
            }

            using (ADMIN_PORTAL.Models.UTNIMASEntities db = new ADMIN_PORTAL.Models.UTNIMASEntities())
            {
                EMPRESA em = db.EMPRESAS.Find(parsedId);
                if (em == null)
                {
                    return Json(new { Success = false, data = "Empresa no encontrada.", status = 404 }, JsonRequestBehavior.AllowGet);
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
        }

        [HttpPost]
        [ActionName("DeleteEmpresa")]
        public ActionResult Delete(string ID)
        {
            int parsedId;
            if (string.IsNullOrWhiteSpace(ID) || !int.TryParse(ID.Trim(), out parsedId) || parsedId <= 0)
            {
                return Json(new { Success = false, data = "Identificador de empresa inválido.", status = 400 }, JsonRequestBehavior.AllowGet);
            }

            using (ADMIN_PORTAL.Models.UTNIMASEntities db = new ADMIN_PORTAL.Models.UTNIMASEntities())
            {
                EMPRESA em = db.EMPRESAS.Find(parsedId);
                if (em == null)
                {
                    return Json(new { Success = false, data = "Empresa no encontrada.", status = 404 }, JsonRequestBehavior.AllowGet);
                }

                db.EMPRESAS.Remove(em);
                db.SaveChanges();
            }
            return Json(new { Success = true, data = parsedId, status = 200 }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ActionName("EditarEm")]
        public ActionResult EditarEm(EMPRESA Empresa)
        {
            string error = null;
            if (Empresa == null || Empresa.EMPRESA_ID <= 0 || !TryValidateEmpresa(Empresa.NOMBRE_EMPRESA, Empresa.EMAIL_EMPRESA, out error))
            {
                return Json(new { Success = false, data = error ?? "Datos de empresa inválidos.", status = 400 }, JsonRequestBehavior.AllowGet);
            }

            using (ADMIN_PORTAL.Models.UTNIMASEntities db = new ADMIN_PORTAL.Models.UTNIMASEntities())
            {
                EMPRESA em = db.EMPRESAS.Find(Empresa.EMPRESA_ID);
                if (em == null)
                {
                    return Json(new { Success = false, data = "Empresa no encontrada.", status = 404 }, JsonRequestBehavior.AllowGet);
                }

                em.DIRECCION_EMPRESA = (Empresa.DIRECCION_EMPRESA ?? string.Empty).Trim();
                em.EMAIL_EMPRESA = (Empresa.EMAIL_EMPRESA ?? string.Empty).Trim();
                em.ID_CLIENTE = Empresa.ID_CLIENTE;
                em.NOMBRE_CONTACTO = (Empresa.NOMBRE_CONTACTO ?? string.Empty).Trim();
                em.NOMBRE_EMPRESA = Empresa.NOMBRE_EMPRESA.Trim();
                em.SECTOR_PRODUCCION = (Empresa.SECTOR_PRODUCCION ?? string.Empty).Trim();
                em.TELEF_CONTACTO = (Empresa.TELEF_CONTACTO ?? string.Empty).Trim();

                db.SaveChanges();
            }

            return Json(new { Success = true, data = Empresa, status = 200 }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult EditarEmpresa(string Id)
        {
            ViewBag.IdEmpresa = Id;
            return View();
        }

        [HttpPost]
        [ActionName("Create")]
        public ActionResult Create(EmpresasModels empresa)
        {
            string error = null;
            if (empresa == null || !TryValidateEmpresa(empresa.NOMBRE_EMPRESA, empresa.EMAIL_EMPRESA, out error))
            {
                ModelState.AddModelError(string.Empty, error ?? "Datos de empresa inválidos.");
                return View(empresa);
            }

            try
            {
                int idCliente = 1;
                int parsedClient;
                if (!string.IsNullOrWhiteSpace(empresa.ID_CLIENTE) && int.TryParse(empresa.ID_CLIENTE.Trim(), out parsedClient) && parsedClient > 0)
                {
                    idCliente = parsedClient;
                }

                using (ADMIN_PORTAL.Models.UTNIMASEntities db = new ADMIN_PORTAL.Models.UTNIMASEntities())
                {
                    EMPRESA nueva = new EMPRESA
                    {
                        DIRECCION_EMPRESA = (empresa.DIRECCION_EMPRESA ?? string.Empty).Trim(),
                        NOMBRE_EMPRESA = empresa.NOMBRE_EMPRESA.Trim(),
                        EMAIL_EMPRESA = (empresa.EMAIL_EMPRESA ?? string.Empty).Trim(),
                        ID_CLIENTE = idCliente,
                        NOMBRE_CONTACTO = (empresa.NOMBRE_CONTACTO ?? string.Empty).Trim(),
                        TELEF_CONTACTO = (empresa.TELEF_CONTACTO ?? string.Empty).Trim(),
                        SECTOR_PRODUCCION = (empresa.SECTOR_PRODUCCION ?? string.Empty).Trim()
                    };
                    db.EMPRESAS.Add(nueva);
                    db.SaveChanges();
                }
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, "No se pudo registrar la empresa: " + ex.Message);
                return View(empresa);
            }
        }

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            return RedirectToAction("Index");
        }

        public ActionResult Delete(int id)
        {
            return View();
        }

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            return RedirectToAction("Index");
        }
    }
}
