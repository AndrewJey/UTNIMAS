using System.Collections.Generic;
using System.Web.Mvc;
using UTNIMAS.Models;

namespace UTNIMAS.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {

            //return Redirect("/Home/Index");
            //return View();
            List<ProductosModels> lst;
            using (UTNIMASEntities db = new UTNIMASEntities())
            {
                //lst = (from d in db.PRODUCTS
                //       join c in db.EMPRESAS on d.EMPRESA_ID equals c.EMPRESA_ID
                //       where d.EMPRESA_ID == c.EMPRESA_ID
                //       select new ProductosModels
                //       {
                //           PRODUCTOS_ID = d.PRODUCTO_ID,
                //           NOMBRE_PRODUCTO = d.NOMBRE_PRODUCTO,
                //           ID_PRECIO = d.ID_PRECIO,
                //           DESCRIP_PRODUCTO = d.DESCRIP_PRODUCTO,
                //           FOTO_PRODUCTO = d.FOTO_PRODUCTO,  //Puede que en el modelo este mal inicializada porque en la base de datos es un tipo "image"
                //           EMPRESA_ID = c.NOMBRE_EMPRESA
                //       }).ToList();
                return View(/*lst*/);
            }
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}