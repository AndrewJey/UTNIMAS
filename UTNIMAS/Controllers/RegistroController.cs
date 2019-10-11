using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace UTNIMAS.Controllers
{
    public class RegistroController : Controller
    {
        // GET: Registro
        public ActionResult RegistroEmpresas()
        {
            return View();
        }
        public ActionResult RegistroProductos()
        {
            return View();
        }
    }
}