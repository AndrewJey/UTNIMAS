using System;
using System.Data.SqlClient;
//Conexión a la Base de Datos
namespace UTNIMAS
{
    public class ConexionBD
    {
        /** CONEXION ANDRES **/
        //string conexion = "Data Source=DESKTOP-E38KCH7;Initial Catalog=UTNIMAS;Integrated Security=True";
        /** CONEXION GABRIEL**/
        //string conexion = "Data Source=MSI;Initial Catalog=UTNIMAS;Integrated Security=True";
        /** CONEXION RONALD**/
        //string conexion = "Data Source=DESKTOP-LVSUABE;Initial Catalog=UTNIMAS;Integrated Security=True";
        /** CONEXION JEYCON**/
        string conexion = "Data Source=JEYCONDK\\SQLEXPRESS01;Initial Catalog=UTNIMAS;Integrated Security=True";
        public SqlConnection conectarBD = new SqlConnection("server=JEYCONDK\\SQLEXPRESS01; database=UTNIMAS; integrated security = true");
        //Constructor:
        public ConexionBD()
        {
            conectarBD.ConnectionString = conexion;
        }

        public SqlConnection ConexDB()
        {
            SqlConnection coon = conectarBD;
            return coon;
        }

        //Abrir la Conexión de la DB:
        public void abrir()
        {
            try
            {
                conectarBD.Open();
                Console.WriteLine("Conexión Abierta");
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Abrir la BD: " + e.Message);
            }
        }
        //Cerrar la Conexión de la DB:
        public void cerrar()
        {
            try
            {
                conectarBD.Close();
                Console.WriteLine("Conexión Cerrada");
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Cerrar la BD: " + e.Message);
            }
        }
    }
}