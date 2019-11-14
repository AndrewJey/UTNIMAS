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
            ConexionBD con = new ConexionBD(); //Crea la instancia de la conexion
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
        }
        public ActionResult RegistroProductos()
        {
            ConexionBD con = new ConexionBD(); //Crea la instancia de la conexion
            con.ConexDB(); //Conecta la BD
            con.abrir(); //Abre la BD                
            //CREAR COMANDO DE SQL
            SqlCommand cmd = new SqlCommand("Insert into dbo.PRODUCTS(PRODUCTOS_ID,NOMBRE_PRODUCTO,ID_PRECIO,NOMBRE_CONTACTO,DESCRIP_PRODUCTO,FOTO_PRODUCTO,EMPRESA_ID)values(@PRODUCTOS_ID,@NOMBRE_PRODUCTO,@ID_PRECIO,@DESCRIP_PRODUCTO,@FOTO_PRODUCTO,@EMPRESA_ID)", con.ConexDB());
            //AGREGAR LOS PARAMETROS A LA BD
            cmd.Parameters.Add("@Id", SqlDbType.Int).Value = Convert.ToInt32(1/*AGREGAR DATOS DEL FORM DE LA VISTA*/);
            //cmd.Parameters.Add("@Name", SqlDbType.VarChar, 30).Value = Console.ReadLine();
            //EJECUTA LOS COMANDOS SQL
            //cmd.ExecuteNonQuery();
            //Cerrar la Conexon con la DB
            con.cerrar();
            //Mostrar Vista
            return View();
        }
        public ActionResult RegistroPrecios()
        {
            ConexionBD con = new ConexionBD(); //Crea la instancia de la conexion
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
            con.cerrar();
            //Mostrar Vista
            return View();
        }
    }
}