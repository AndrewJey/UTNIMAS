using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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
                       join c in db.EMPRESAS on d.EMPRESA_ID equals c.EMPRESA_ID
                       where d.EMPRESA_ID == c.EMPRESA_ID
                       select new ProductosModels
                       {
                           PRODUCTOS_ID = d.PRODUCTO_ID,
                           NOMBRE_PRODUCTO = d.NOMBRE_PRODUCTO,
                           ID_PRECIO = d.ID_PRECIO,
                           DESCRIP_PRODUCTO = d.DESCRIP_PRODUCTO,
                           FOTO_PRODUCTO = d.FOTO_PRODCUTO,  //Puede que en el modelo este mal inicializada porque en la base de datos es un tipo "image"
                           EMPRESA_ID = c.NOMBRE_EMPRESA
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
            string Iduser = null;
            string Empresa = null;
            try
            {
                string userId = System.Web.HttpContext.Current.User.Identity.Name;
                if (userId != "")
                {
                    //UTNIMASEntities db1 = new UTNIMASEntities();
                    Models.ConexionBD con = new Models.ConexionBD(); //Crea la instancia de la conexion
                    con.ConexDB(); //Conecta la BD
                    con.abrir(); //Abre la BD   
                    SqlCommand cmd = new SqlCommand("SELECT ID_CLIENT FROM dbo.CLIENTS WHERE EMAIL_CLIENT = @userId ", con.ConexDB());
                    cmd.Parameters.AddWithValue("@userId", userId);

                    Iduser = (cmd.ExecuteScalar().ToString());

                    UTNIMASEntities db = new UTNIMASEntities();
                    // TODO: Add insert logic here
                    string query = "INSERT INTO EMPRESAS(NOMBRE_PRODUCTO,ID_PRECIO,DESCRIP_PRODUCTO,FOTO_PRODCUTO,EMPRESA_ID)" +
                        "VALUES('" + producto.NOMBRE_PRODUCTO + "', '" + producto.ID_PRECIO + "', '" + producto.DESCRIP_PRODUCTO + "','" + Iduser + "','" + producto.FOTO_PRODUCTO + "', '" + producto.EMPRESA_ID + "')";
                    db.Database.ExecuteSqlCommand(query);
                    con.cerrar();
                }
                string Mensaje = "Registro de Producto Completo";
                return Json(new { Success = true, Mensaje }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string Mensaje = "Error con la Solicitud";
                return Json(new { Success = false, Mensaje }, JsonRequestBehavior.AllowGet);
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
        public ActionResult obtenerInfo(string Id)
        {
            string NOMBRE_EMPRESA = "";
            string DIRECCION_EMPRESA = "";
            string NOMBRE_CONTACTO = "";
            string SECTOR_PRODUCCION = "";
            try
            {
                    //UTNIMASEntities db1 = new UTNIMASEntities();
                    Models.ConexionBD con = new Models.ConexionBD(); //Crea la instancia de la conexion
                    con.ConexDB(); //Conecta la BD
                    con.abrir(); //Abre la BD   
                    if (Id != null)
                    {

                        SqlCommand cmd2 = new SqlCommand("SELECT NOMBRE_EMPRESA,DIRECCION_EMPRESA,NOMBRE_CONTACTO,SECTOR_PRODUCCION FROM dbo.EMPRESAS WHERE EMPRESA_ID = @userId ", con.ConexDB());
                        cmd2.Parameters.AddWithValue("@userId", Id);
                        //Empresa = cmd2.ExecuteScalar().ToString();
                    SqlDataReader registros = cmd2.ExecuteReader();
                    while (registros.Read())
                    {
                        NOMBRE_EMPRESA = registros["NOMBRE_EMPRESA"].ToString();
                        DIRECCION_EMPRESA = registros["DIRECCION_EMPRESA"].ToString();
                        NOMBRE_CONTACTO = registros["NOMBRE_CONTACTO"].ToString();
                        SECTOR_PRODUCCION = registros["SECTOR_PRODUCCION"].ToString();
                    }
                    }
                return Json(new { Success = true, NOMBRE_EMPRESA, DIRECCION_EMPRESA, NOMBRE_CONTACTO, SECTOR_PRODUCCION }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string Mensaje = "Error con la Solicitud";
                return Json(new { Success = false, Mensaje }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}