using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UTNIMAS.Models;

namespace UTNIMAS.Controllers
{
    public class ProductosController : Controller
    {
        // GET: Productos
        public ActionResult Productos()
        {
            List<ProductosModels> lst;
            using (UTNIMASEntities db = new UTNIMASEntities())
            {
                lst = (from d in db.PRODUCTS
                       select new ProductosModels
                       {
                           PRODUCTOS_ID = d.PRODUCTO_ID,
                           NOMBRE_PRODUCTO = d.NOMBRE_PRODUCTO,
                           ID_PRECIO = d.ID_PRECIO,
                           DESCRIP_PRODUCTO = d.DESCRIP_PRODUCTO,
                           FOTO_PRODUCTO = d.FOTO_PRODCUTO,  //Puede que en el modelo este mal inicializada porque en labase de datos es un tipo "image"
                           EMPRESA_ID = d.EMPRESA_ID
                       }).ToList();
                return View(lst);
            }
        }
    }
}