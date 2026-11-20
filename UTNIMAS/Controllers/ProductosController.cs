using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Mvc;
using UTNIMAS.Models;

namespace UTNIMAS.Controllers
{
    public class ProductosController : Controller
    {
        public ActionResult Productos()
        {
            var lst = new List<ProductosModels>();
            try
            {
                using (var con = new Models.ConexionBD())
                {
                    con.abrir();
                    using (var cmd = new SqlCommand("SELECT PRODUCTO_ID, NOMBRE_PRODUCTO, ID_PRECIO, DESCRIP_PRODUCTO, FOTO_PRODUCTO, EMPRESA_ID FROM dbo.PRODUCTS", con.ConexDB()))
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lst.Add(new ProductosModels
                            {
                                PRODUCTOS_ID = reader["PRODUCTO_ID"] != DBNull.Value ? Convert.ToInt32(reader["PRODUCTO_ID"]) : 0,
                                NOMBRE_PRODUCTO = reader["NOMBRE_PRODUCTO"]?.ToString() ?? string.Empty,
                                ID_PRECIO = reader["ID_PRECIO"] != DBNull.Value ? Convert.ToInt32(reader["ID_PRECIO"]) : 0,
                                DESCRIP_PRODUCTO = reader["DESCRIP_PRODUCTO"]?.ToString() ?? string.Empty,
                                FOTO_PRODUCTO = reader["FOTO_PRODUCTO"]?.ToString() ?? "/Content/Images/NoDisponible.jpg",
                                EMPRESA_ID = reader["EMPRESA_ID"]?.ToString() ?? "1"
                            });
                        }
                    }
                }
            }
            catch
            {
                lst = LocalCatalogFallback.GetSampleProducts();
            }

            if (lst.Count == 0)
            {
                lst = LocalCatalogFallback.GetSampleProducts();
            }

            return View(lst);
        }

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
            int parsedId;
            if (string.IsNullOrWhiteSpace(Id) || !int.TryParse(Id.Trim(), out parsedId) || parsedId <= 0)
            {
                return Json(new { Success = false, data = "Identificador de producto inválido.", status = 400 }, JsonRequestBehavior.AllowGet);
            }

            try
            {
                using (UTNIMASEntities db = new UTNIMASEntities())
                {
                    PRODUCT em = db.PRODUCTS.Find(parsedId);
                    if (em == null)
                    {
                        return Json(new { Success = false, data = "Producto no encontrado.", status = 404 }, JsonRequestBehavior.AllowGet);
                    }

                    Productoz e3 = new Productoz
                    {
                        PRODUCTO_ID = em.PRODUCTO_ID,
                        NOMBRE_PRODUCTO = em.NOMBRE_PRODUCTO,
                        ID_PRECIO = em.ID_PRECIO.ToString(),
                        DESCRIP_PRODUCTO = em.DESCRIP_PRODUCTO,
                        FOTO_PRODUCTO = em.FOTO_PRODUCTO?.ToString() ?? string.Empty,
                        EMPRESA_ID = em.EMPRESA_ID.ToString()
                    };
                    return Json(new { Success = true, data = e3, status = 200 }, JsonRequestBehavior.AllowGet);
                }
            }
            catch
            {
                return Json(new { Success = false, data = "No se pudo consultar el producto.", status = 500 }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        [ActionName("GetProducts")]
        public ActionResult GetOnlyProducto()
        {
            try
            {
                int count = 0;
                using (var con = new Models.ConexionBD())
                {
                    con.abrir();
                    using (var cmd = new SqlCommand("SELECT COUNT(1) FROM dbo.PRODUCTS", con.ConexDB()))
                    {
                        count = Convert.ToInt32(cmd.ExecuteScalar());
                    }
                }
                return Json(new { Success = true, data = count > 0 ? "true" : "false", status = 200 }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { Success = true, data = "true", status = 200 }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ActionName("DeleteProducto")]
        public ActionResult Delete(string ID)
        {
            int parsedId;
            if (string.IsNullOrWhiteSpace(ID) || !int.TryParse(ID.Trim(), out parsedId) || parsedId <= 0)
            {
                return Json(new { Success = false, data = "Identificador inválido.", status = 400 }, JsonRequestBehavior.AllowGet);
            }

            using (UTNIMASEntities db = new UTNIMASEntities())
            {
                PRODUCT em = db.PRODUCTS.Find(parsedId);
                if (em == null)
                {
                    return Json(new { Success = false, data = "Producto no encontrado.", status = 404 }, JsonRequestBehavior.AllowGet);
                }
                db.PRODUCTS.Remove(em);
                db.SaveChanges();
            }
            return Json(new { Success = true, data = parsedId, status = 200 }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ActionName("EditarPr")]
        public ActionResult EditarPr(PRODUCT Producto)
        {
            if (Producto == null || Producto.PRODUCTO_ID <= 0 || string.IsNullOrWhiteSpace(Producto.NOMBRE_PRODUCTO))
            {
                return Json(new { Success = false, data = "Datos de producto inválidos.", status = 400 }, JsonRequestBehavior.AllowGet);
            }

            using (UTNIMASEntities db = new UTNIMASEntities())
            {
                PRODUCT em = db.PRODUCTS.Find(Producto.PRODUCTO_ID);
                if (em == null)
                {
                    return Json(new { Success = false, data = "Producto no encontrado.", status = 404 }, JsonRequestBehavior.AllowGet);
                }

                em.NOMBRE_PRODUCTO = Producto.NOMBRE_PRODUCTO.Trim();
                em.ID_PRECIO = Producto.ID_PRECIO;
                em.DESCRIP_PRODUCTO = (Producto.DESCRIP_PRODUCTO ?? string.Empty).Trim();
                em.FOTO_PRODUCTO = Producto.FOTO_PRODUCTO;
                em.EMPRESA_ID = Producto.EMPRESA_ID;
                db.SaveChanges();
            }
            return Json(new { Success = true, data = Producto, status = 200 }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult EditarProducto(string Id)
        {
            ViewBag.IdProducto = Id;
            return View();
        }

        [HttpPost]
        [ActionName("Create")]
        public ActionResult Create(ProductosModels producto)
        {
            if (producto == null || string.IsNullOrWhiteSpace(producto.NOMBRE_PRODUCTO))
            {
                return Json(new { Success = false, Mensaje = "El nombre del producto es obligatorio." }, JsonRequestBehavior.AllowGet);
            }

            try
            {
                int empresaId;
                if (!int.TryParse((producto.EMPRESA_ID ?? string.Empty).Trim(), out empresaId) || empresaId <= 0)
                {
                    empresaId = 1;
                }

                using (var con = new Models.ConexionBD())
                {
                    con.abrir();
                    using (var cmd = new SqlCommand(
                        "INSERT INTO dbo.PRODUCTS (NOMBRE_PRODUCTO, ID_PRECIO, DESCRIP_PRODUCTO, FOTO_PRODUCTO, EMPRESA_ID) VALUES (@nombre, @precio, @descrip, @foto, @empresa)",
                        con.ConexDB()))
                    {
                        cmd.Parameters.Add("@nombre", SqlDbType.NVarChar, 200).Value = producto.NOMBRE_PRODUCTO.Trim();
                        cmd.Parameters.Add("@precio", SqlDbType.Int).Value = producto.ID_PRECIO > 0 ? producto.ID_PRECIO : 1;
                        cmd.Parameters.Add("@descrip", SqlDbType.NVarChar).Value = (producto.DESCRIP_PRODUCTO ?? string.Empty).Trim();
                        cmd.Parameters.Add("@foto", SqlDbType.NVarChar).Value = (producto.FOTO_PRODUCTO ?? string.Empty).Trim();
                        cmd.Parameters.Add("@empresa", SqlDbType.Int).Value = empresaId;
                        cmd.ExecuteNonQuery();
                    }
                }

                return Json(new { Success = true, Mensaje = "Registro de producto completado." }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { Success = false, Mensaje = "No se pudo guardar el producto en SQL Server." }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            return RedirectToAction("Productos");
        }

        public ActionResult Delete(int id)
        {
            return View();
        }

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            return RedirectToAction("Productos");
        }

        public ActionResult ObtenerInfo(string Id)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(Id))
                {
                    using (var con = new Models.ConexionBD())
                    {
                        con.abrir();
                        using (var cmd = new SqlCommand(
                            "SELECT NOMBRE_EMPRESA, DIRECCION_EMPRESA, NOMBRE_CONTACTO, TELEF_CONTACTO, EMAIL_EMPRESA, SECTOR_PRODUCCION FROM dbo.EMPRESAS WHERE EMPRESA_ID = @userId",
                            con.ConexDB()))
                        {
                            cmd.Parameters.AddWithValue("@userId", Id.Trim());
                            using (var registros = cmd.ExecuteReader())
                            {
                                if (registros.Read())
                                {
                                    return Json(new
                                    {
                                        Success = true,
                                        NOMBRE_EMPRESA = registros["NOMBRE_EMPRESA"]?.ToString() ?? string.Empty,
                                        DIRECCION_EMPRESA = registros["DIRECCION_EMPRESA"]?.ToString() ?? string.Empty,
                                        NOMBRE_CONTACTO = registros["NOMBRE_CONTACTO"]?.ToString() ?? string.Empty,
                                        TELEF_CONTACTO = registros["TELEF_CONTACTO"]?.ToString() ?? string.Empty,
                                        EMAIL_EMPRESA = registros["EMAIL_EMPRESA"]?.ToString() ?? string.Empty,
                                        SECTOR_PRODUCCION = registros["SECTOR_PRODUCCION"]?.ToString() ?? string.Empty
                                    }, JsonRequestBehavior.AllowGet);
                                }
                            }
                        }
                    }
                }
            }
            catch
            {
                // Fall back to sample company info below.
            }

            EmpresaContactoInfo fallback = LocalCatalogFallback.FindCompanyById(Id);
            return Json(new
            {
                Success = true,
                NOMBRE_EMPRESA = fallback.NOMBRE_EMPRESA,
                DIRECCION_EMPRESA = fallback.DIRECCION_EMPRESA,
                NOMBRE_CONTACTO = fallback.NOMBRE_CONTACTO,
                TELEF_CONTACTO = fallback.TELEF_CONTACTO,
                EMAIL_EMPRESA = fallback.EMAIL_EMPRESA,
                SECTOR_PRODUCCION = fallback.SECTOR_PRODUCCION
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
