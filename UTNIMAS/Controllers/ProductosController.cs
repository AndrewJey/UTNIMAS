using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using UTNIMAS.Models;
//
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
                           FOTO_PRODUCTO = d.FOTO_PRODCUTO,  //Puede que en el modelo este mal inicializada porque en la base de datos es un tipo "image"
                           EMPRESA_ID = d.EMPRESA_ID
                       }).ToList();
                return View(lst);
            }
        }
        // GET: Productos/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }
        public class Productoz
        {
            public int PRODUCTO_ID { get; set; }
            public string NOMBRE_PRODUCTO { get; set; }
            public string ID_PRECIO { get; set; }
            public string DESCRIP_PRODUCTO { get; set; }
            public string FOTO_PRODUCTO { get; set; }
            public string EMPRESA_ID { get; set; }
        }
        [HttpGet]
        [ActionName("GetOnlyProducto")]
        public ActionResult GetOnlyProducto(string Id)
        {
            try
            {
                PRODUCT em = new PRODUCT();
                if (!string.IsNullOrEmpty(Id))
                {
                    using (UTNIMASEntities db = new UTNIMASEntities())
                    {
                        em = db.PRODUCTS.Find(int.Parse(Id));
                    }
                    Productoz e3 = new Productoz
                    {
                        PRODUCTO_ID = em.PRODUCTO_ID,
                        NOMBRE_PRODUCTO = em.NOMBRE_PRODUCTO,
                        ID_PRECIO = em.ID_PRECIO.ToString(),
                        DESCRIP_PRODUCTO = em.DESCRIP_PRODUCTO,
                        FOTO_PRODUCTO = em.FOTO_PRODCUTO.ToString(),
                        EMPRESA_ID = em.EMPRESA_ID.ToString()
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
        [ActionName("DeleteProducto")]
        public ActionResult Delete(string ID)
        {
            using (UTNIMASEntities db = new UTNIMASEntities())
            {
                PRODUCT em = db.PRODUCTS.Find(int.Parse(ID));
                if (em != null)
                {
                    db.PRODUCTS.Remove(em);
                    db.SaveChanges();
                }
            }
            return Json(new { Success = true, data = ID, status = 200 }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [ActionName("EditarPr")]
        public ActionResult EditarPr(PRODUCT Producto)
        {
            using (UTNIMASEntities db = new UTNIMASEntities())
            {

                PRODUCT em = db.PRODUCTS.Find(Producto.PRODUCTO_ID);

                em.PRODUCTO_ID = Producto.PRODUCTO_ID;
                em.NOMBRE_PRODUCTO = Producto.NOMBRE_PRODUCTO;
                em.ID_PRECIO = Producto.ID_PRECIO;
                em.DESCRIP_PRODUCTO = Producto.DESCRIP_PRODUCTO;
                em.FOTO_PRODCUTO = Producto.FOTO_PRODCUTO;
                em.EMPRESA_ID = Producto.EMPRESA_ID;
                db.SaveChanges();
            }
            return Json(new { Success = true, data = Producto, status = 200 }, JsonRequestBehavior.AllowGet);
        }


        // GET: Empresas/Create
        public ActionResult EditarProducto(string Id)
        {
            ViewBag.IdProducto = Id;
            return View();
        }

        // POST: Empresas/Create
        [HttpPost]
        [ActionName("Create")]
        public ActionResult Create(ProductosModels producto)
        {
            try
            {
                UTNIMASEntities db = new UTNIMASEntities();
                // TODO: Add insert logic here
                string query = "INSERT INTO EMPRESAS(NOMBRE_PRODUCTO,ID_PRECIO,DESCRIP_PRODUCTO,FOTO_PRODCUTO,EMPRESA_ID)" +
                    "VALUES('" + producto.NOMBRE_PRODUCTO + "', '" + producto.ID_PRECIO + "', '" + producto.DESCRIP_PRODUCTO + "', 1, '" + producto.FOTO_PRODUCTO + "', '" + producto.EMPRESA_ID + "')";
                db.Database.ExecuteSqlCommand(query);
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                return View();
            }
        }

        // POST: Productos/Edit/5
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

        // GET: Productos/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Productos/Delete/5
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