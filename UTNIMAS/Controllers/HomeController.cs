using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;
using UTNIMAS.Models;

namespace UTNIMAS.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            List<ProductosModels> lst = LoadProductsWithFallback();
            return View(lst);
        }

        private static List<ProductosModels> LoadProductsWithFallback()
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
                // Fallback to bundled demo catalog when SQL Server is unavailable.
            }

            return lst.Count > 0 ? lst : LocalCatalogFallback.GetSampleProducts();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Plataforma UTN-IMAS Ideas Productivas para compra, venta y vitrina de emprendimientos registrados.";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Canales oficiales de atención y enlace comercial UTN – IMAS.";
            return View();
        }
    }
}
