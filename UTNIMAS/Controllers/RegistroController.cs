using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.Mvc;

namespace UTNIMAS.Controllers
{
    public class RegistroController : Controller
    {
        // GET: Registro
        public ActionResult RegistroEmpresas()
        {
            Models.ConexionBD con = new Models.ConexionBD(); //Crea la instancia de la conexion
            con.ConexDB(); //Conecta la BD
            con.abrir(); //Abre la BD                
            //CREAR COMANDO DE SQL
            SqlCommand cmd = new SqlCommand("Insert into dbo.EMPRESAS(EMPRESA_ID,NOMBRE_EMPRESA,DIRECCION_EMPRESA,NOMBRE_CONTACTO,TELEF_CONTACTO,EMAIL_EMPRESA,SECTOR_PRODUCCION,ID_CLIENTE)values(@Id,@Name,@Addr,@Contact,@Telf,@Email,@Sector,@Client)", con.ConexDB());
            //AGREGAR LOS PARAMETROS A LA BD
            cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Convert.ToInt32(1/*AGREGAR DATOS DEL FORM DE LA VISTA*/);
            //cmd.Parameters.Add("@Name", SqlDbType.VarChar, 30).Value = Console.ReadLine();
            //EJECUTA LOS COMANDOS SQL
            //cmd.ExecuteNonQuery();
            //Cerrar la Conexon con la DB
            con.cerrar();
            //Mostrar Vista
            return View();
            //string Iduser = null;
            //string Empresa = "";
            //string userEmail = System.Web.HttpContext.Current.User.Identity.Name;
            //try
            //{
            //    if (userEmail != "")
            //    {
            //        //UTNIMASEntities db1 = new UTNIMASEntities();
            //        Models.ConexionBD con = new Models.ConexionBD(); //Crea la instancia de la conexion
            //        con.ConexDB(); //Conecta la BD
            //        con.abrir(); //Abre la BD   
            //        SqlCommand cmd = new SqlCommand("SELECT ID_CLIENT FROM dbo.CLIENTS WHERE EMAIL_CLIENT = @userEmail ", con.ConexDB());
            //        cmd.Parameters.AddWithValue("@userEmail", userEmail);
            //        Iduser = (cmd.ExecuteScalar().ToString());
            //        if (Iduser != null)
            //        {
            //            SqlCommand cmd2 = new SqlCommand("SELECT NOMBRE_EMPRESA FROM dbo.EMPRESAS WHERE ID_CLIENTE = @userId ", con.ConexDB());
            //            cmd2.Parameters.AddWithValue("@userId", Iduser);
            //            Empresa = cmd2.ExecuteScalar().ToString();
            //        }
            //    }
            //    ViewBag.Empresa = Empresa;
            //    return View();
            //}
            //    catch (Exception ex)
            //    {
            //        string Mensaje = "Error con la Solicitud";
            //        return Json(new { Success = false, Mensaje }, JsonRequestBehavior.AllowGet);
            //    }
        }
        public ActionResult RegistroProductos()
        { //Models.ConexionBD con = new Models.ConexionBD(); //Crea la instancia de la conexion
            //con.ConexDB(); //Conecta la BD
            //con.abrir(); //Abre la BD                
            //CREAR COMANDO DE SQL
            //SqlCommand cmd = new SqlCommand("Insert into dbo.PRODUCTS(PRODUCTOS_ID,NOMBRE_PRODUCTO,ID_PRECIO,NOMBRE_CONTACTO,DESCRIP_PRODUCTO,FOTO_PRODUCTO,EMPRESA_ID)values(@PRODUCTOS_ID,@NOMBRE_PRODUCTO,@ID_PRECIO,@DESCRIP_PRODUCTO,@FOTO_PRODUCTO,@EMPRESA_ID)", con.ConexDB());
            //AGREGAR LOS PARAMETROS A LA BD
            //cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Convert.ToInt32(1/*AGREGAR DATOS DEL FORM DE LA VISTA*/);
            //cmd.Parameters.Add("@Name", SqlDbType.VarChar, 30).Value = Console.ReadLine();
            //EJECUTA LOS COMANDOS SQL
            //cmd.ExecuteNonQuery();
            //Cerrar la Conexon con la DB
            //con.cerrar();
            //Mostrar Vista
            //return View();
            string Iduser = null;
            string Empresa = "";
            string userEmail = System.Web.HttpContext.Current.User.Identity.Name;
            try
            {
                if (userEmail != "")
                {
                    //UTNIMASEntities db1 = new UTNIMASEntities();
                    Models.ConexionBD con = new Models.ConexionBD(); //Crea la instancia de la conexion
                    con.ConexDB(); //Conecta la BD
                    con.abrir(); //Abre la BD   
                    SqlCommand cmd = new SqlCommand("SELECT ID_CLIENT FROM dbo.CLIENTS WHERE EMAIL_CLIENT = @userEmail ", con.ConexDB());
                    cmd.Parameters.AddWithValue("@userEmail", userEmail);
                    Iduser = (cmd.ExecuteScalar().ToString());
                    if (Iduser != null)
                    {

                        SqlCommand cmd2 = new SqlCommand("SELECT NOMBRE_EMPRESA FROM dbo.EMPRESAS WHERE ID_CLIENTE = @userId ", con.ConexDB());
                        cmd2.Parameters.AddWithValue("@userId", Iduser);
                        Empresa = cmd2.ExecuteScalar().ToString();

                    }

                }
                ViewBag.Empresa = Empresa;
                return View();
            }
            catch (Exception ex)
            {
                string Mensaje = "Error con la Solicitud";
                return Json(new { Success = false, Mensaje }, JsonRequestBehavior.AllowGet);
            }


        }
        public ActionResult RegistroPrecios()
        {

            Models.ConexionBD con = new Models.ConexionBD(); //Crea la instancia de la conexion
            con.ConexDB(); //Conecta la BD
            con.abrir(); //Abre la BD                
            //CREAR COMANDO DE SQL
            SqlCommand cmd = new SqlCommand("Insert into dbo.PRECIOS(PRECIOS_ID,PRECIO_UNIDAD,PRECIO_PAQUETE,PRECIO_SERVICIO,PRECIO_MAYOREO,PRECIO_ESPECIAL)values(@PRECIOS_ID,@PRECIO_UNIDAD,@PRECIO_PAQUETE,@PRECIO_SERVICIO,@PRECIO_MAYOREO,@PRECIO_ESPECIAL)", con.ConexDB());
            //AGREGAR LOS PARAMETROS A LA BD
            cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Convert.ToInt32(1/*AGREGAR DATOS DEL FORM DE LA VISTA*/);
            //cmd.Parameters.Add("@Name", SqlDbType.VarChar, 30).Value = Console.ReadLine();
            //EJECUTA LOS COMANDOS SQL
            //cmd.ExecuteNonQuery();
            //Cerrar la Conexon con la DB
            string userId = System.Web.HttpContext.Current.User.Identity.Name;
            if (userId != "")
            {
                SqlCommand cmd2 = new SqlCommand("SELECT ID_CLIENT FROM dbo.CLIENTS WHERE EMAIL_CLIENT = @userId ", con.ConexDB());
                cmd2.Parameters.AddWithValue("@userId", userId);
                ViewBag.EMPRESA = (cmd2.ExecuteScalar().ToString());
            }
            con.cerrar();
            //Mostrar Vista
            return View();
        }
    }
}