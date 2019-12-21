using System.Collections.Generic;
using System.Data.SqlClient;
using System.Web.Mvc;
using UTNIMAS.Models;

namespace UTNIMAS.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            List<ProductosModels> lst = new List<ProductosModels>();
            Models.ConexionBD con = new Models.ConexionBD(); //Crea la instancia de la conexion
            con.ConexDB(); //Conecta la BD
            con.abrir(); //Abre la BD   
            SqlCommand cmd2 = new SqlCommand("SELECT * FROM dbo.PRODUCTS", con.ConexDB());
            SqlDataReader myReader = cmd2.ExecuteReader();
            while (myReader.Read())
            {
                ProductosModels p = new ProductosModels
                {
                    PRODUCTOS_ID = 1,
                    NOMBRE_PRODUCTO = myReader["NOMBRE_PRODUCTO"].ToString(),
                    ID_PRECIO = 1,
                    DESCRIP_PRODUCTO = myReader["DESCRIP_PRODUCTO"].ToString(),
                    FOTO_PRODUCTO = myReader["FOTO_PRODUCTO"].ToString(),
                    EMPRESA_ID = myReader["EMPRESA_ID"].ToString()
                };
                lst.Add(p);
            }
            return View(lst);
            //return Redirect("/Home/Index");
            //return View();
            //List<ProductosModels> lst;
            //using (UTNIMASEntities db = new UTNIMASEntities())
            //{
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
            //  return View(/*lst*/);
            //}
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